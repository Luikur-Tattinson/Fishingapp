from django.test import TestCase
from .models import CatchEntry
from django.contrib.auth.models import User

class CatchModelTest(TestCase):
    def test_string_representation(self):
        user = User.objects.create_user(username='fishfish', password='fishfish')

        catch = CatchEntry.objects.create(
            user = user,
            area ='Oulu',
            body_of_water = 'Oulujoki',
            species = 'StreetShark',
            weight = 2.5,
            length = 900,
            date_caught = '1900-12-12',
            image = 'test.jpg'
        )

        self.assertEqual(str(catch), "StreetShark (2.5 kg) by fishfish")

