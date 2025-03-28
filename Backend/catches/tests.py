from django.test import TestCase
from .models import CatchEntry
from django.contrib.auth.models import User

class CatchModelTest(TestCase):
    def test_string_representation(self):
        user = User.objects.create_user(username='fishfish', password='fishfish')

        catch = CatchEntry.objects.create(
            species="StreetShark",
            weight=2.5,
            user=user
        )

        self.assertEqual(str(catch), "StreetShark (2.5 kg) by fishfish")

