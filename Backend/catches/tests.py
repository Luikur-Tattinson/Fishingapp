from django.test import TestCase
from .models import CatchEntry

class CatchModelTest(TestCase):
    def test_string_representation(self):
        catch = CatchEntry(species="StreetShark", weight=2.5)
        self.assertEqual(str(catch), "StreetShark (2.5 kg) by fishfish")

