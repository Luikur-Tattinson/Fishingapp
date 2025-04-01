from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import CatchEntry
from .serializers import CatchSerializer
from rest_framework.permissions import IsAuthenticated
import requests
from datetime import datetime, date

@api_view(['GET'])
def get_catches(request):
    catches = CatchEntry.objects.all()
    serializer = CatchSerializer(catches, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_catch(request):
    data = request.data.copy()
    data['user'] = request.user.id
    
    latitude = float(data.get('latitude'))
    longitude = float(data.get('longitude'))
    date_str = data.get('date_caught')
    time_str = data.get('time_caught')
    
    # Fetch weather data from Open-Meteo
    weather_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}"
        f"&hourly=temperature_2m,precipitation,windspeed_10m,weathercode"
        f"&start={date_str}T00:00:00Z&end={date_str}T23:00:00Z"
        f"&timezone=UTC"
    )
    
    try:
        dt_iso = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M").isoformat()
        request_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception as e:
        return Response({'error': 'Invalid date or time format.'}, status=status.HTTP_400_BAD_REQUEST)
    
    is_past = request_date < date.today()

    if is_past:
        weather_url = (
            f"https://archive-api.open-meteo.com/v1/archive"
            f"?latitude={latitude}&longitude={longitude}"
            f"&start_date={date_str}&end_date={date_str}"
            f"&hourly=temperature_2m,precipitation,windspeed_10m,weathercode"
            f"&timezone=UTC"
        )
    else:
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&hourly=temperature_2m,precipitation,windspeed_10m,weathercode"
            f"&start={date_str}T00:00:00Z&end={date_str}T23:00:00Z"
            f"&timezone=UTC"
        )

    try:
        response = requests.get(weather_url)
        response.raise_for_status()
        weather_data = response.json()
        print("Archive response:", weather_data)

        target_hour = datetime.strptime(time_str, "%H:%M").hour
        target_time_prefix = f"{date_str}T{target_hour:02}:00"

        matching_times = weather_data["hourly"]["time"]
        print(f"Looking for: {target_time_prefix}\nAvailable: {matching_times}")

        index = next(i for i, t in enumerate(matching_times) if t.startswith(target_time_prefix))

        temperature = weather_data["hourly"]["temperature_2m"][index]
        windspeed = weather_data["hourly"]["windspeed_10m"][index]
        precipitation = weather_data["hourly"]["precipitation"][index]
        weather_code = weather_data["hourly"]["weathercode"][index]

        data["temperature"] = temperature
        data["windspeed"] = windspeed
        data["precipitation"] = precipitation
        data["weather_code"] = weather_code

    except StopIteration:
        return Response({'error': f'No matching weather data for {target_time_prefix}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Weather fetch failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CatchSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # Associate the logged-in user
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)