from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_registration_email(username, email):
    subject = "Fishing app registration"
    message = f"Hello, {username}, you have registered for fishing app"
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(
        subject,
        message,
        from_email,
        [email],
        fail_silently= False,
    )




