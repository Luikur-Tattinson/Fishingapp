from django.db import models
from django.contrib.auth.models import User

class CatchEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # Links to the user who caught the fish
    area = models.CharField(max_length=100)
    body_of_water = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    weight = models.FloatField()
    length = models.FloatField()
    image = models.ImageField(upload_to='catches/MEDIA', blank=True, null=True)
    date_caught = models.DateField()
    time_caught = models.TimeField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    #Weather fields
    temperature = models.FloatField(null=True, blank=True)
    windspeed = models.FloatField(null=True, blank=True)
    precipitation = models.FloatField(null=True, blank=True)
    weather_code = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.species} ({self.weight} kg) by {self.user.username}"

