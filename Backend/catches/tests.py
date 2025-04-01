from django.test import TestCase
from .models import CatchEntry
from django.contrib.auth.models import User
from datetime import datetime, time
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from unittest.mock import patch
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class CatchModelTest(TestCase):
    def test_create_catch_entry(self):
        user = User.objects.create_user(username='testuser', password='testpass')

        catch = CatchEntry.objects.create(
            user = user,
            area ='area',
            body_of_water = 'River',
            species = 'StreetShark',
            weight = 2.5,
            length = 900,
            date_caught = '2025-04-01',
            time_caught = time(13, 0),
            image = 'test.jpg',
            latitude=62.2426,
            longitude=25.7473,
            temperature=10.5,
            windspeed=5.0,
            precipitation=0.0,
            weather_code=2
        )

        self.assertEqual(catch.user.username, 'testuser')
        self.assertEqual(catch.species, 'StreetShark')
        self.assertEqual(catch.temperature, 10.5)
        self.assertEqual(catch.latitude, 62.2426)
        self.assertEqual(catch.weather_code, 2)
        
class CreateCatchAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    @patch('requests.get')
    def test_create_catch_with_mocked_weather(self, mock_get):
        # Mock weather API response
        mock_weather_data = {
            "hourly": {
                "time": [f"2025-04-01T{str(i).zfill(2)}:00" for i in range(24)],
                "temperature_2m": [10.0] * 24,
                "windspeed_10m": [5.0] * 24,
                "precipitation": [0.0] * 24,
                "weathercode": [2] * 24,
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_weather_data

        data = {
            "area": "TestArea",
            "body_of_water": "TestRiver",
            "species": "TestFish",
            "weight": 2.3,
            "length": 55.5,
            "date_caught": "2025-04-01",
            "time_caught": "13:00",
            "latitude": 62.2426,
            "longitude": 25.7473,
        }

        response = self.client.post('/api/catches/add/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['temperature'], 10.0)
        self.assertEqual(response.data['weather_code'], 2)

class CatchValidationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='testpass')
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_missing_required_fields(self):
        # Missing species, weight, etc.
        data = {
            'area': 'TestArea',
            'body_of_water': 'TestLake',
            # 'species': 'Pike', <- missing
            # 'weight': 2.5,     <- missing
            'length': 55.0,
            'date_caught': '2025-04-01',
            'time_caught': '12:00',
            'latitude': 62.2426,
            'longitude': 25.7473
        }

        response = self.client.post('/api/catches/add/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('species', response.data)
        self.assertIn('weight', response.data)

    def test_invalid_weight_type(self):
        data = {
            'area': 'TestArea',
            'body_of_water': 'TestLake',
            'species': 'Perch',
            'weight': 'heavy',  # invalid type
            'length': 30.0,
            'date_caught': '2025-04-01',
            'time_caught': '12:00',
            'latitude': 62.2426,
            'longitude': 25.7473
        }

        response = self.client.post('/api/catches/add/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weight', response.data)

    def test_invalid_date_format(self):
        data = {
            'area': 'TestArea',
            'body_of_water': 'TestLake',
            'species': 'Perch',
            'weight': 1.5,
            'length': 30.0,
            'date_caught': '01-04-2025',  # Wrong format
            'time_caught': '12:00',
            'latitude': 62.2426,
            'longitude': 25.7473
        }

        response = self.client.post('/api/catches/add/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_missing_coordinates(self):
        data = {
            'area': 'TestArea',
            'body_of_water': 'TestLake',
            'species': 'Trout',
            'weight': 1.2,
            'length': 35.0,
            'date_caught': '2025-04-01',
            'time_caught': '14:00'
            # Missing latitude and longitude
        }

        response = self.client.post('/api/catches/add/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)