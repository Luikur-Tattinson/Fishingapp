from django.db import models
from django.contrib.auth.models import User

class CatchEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # Links to the user who caught the fish
    area = models.CharField(max_length=100)
    body_of_water = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    weight = models.FloatField()
    length = models.FloatField()
    image = models.ImageField(upload_to='catches/MEDIA')  # Image saved in MEDIA folder under catches/
    date_caught = models.DateField()

    def __str__(self):
        return f"{self.species} ({self.weight} kg) by {self.user.username}"

