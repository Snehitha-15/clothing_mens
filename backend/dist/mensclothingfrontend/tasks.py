from celery import shared_task
from django.contrib.auth import get_user_model
from .recommendations import cache_recommendations_for_user

User = get_user_model()

@shared_task
def recompute_all_user_recommendations():
    users = User.objects.filter(is_active=True)

    for user in users:
        try:
            cache_recommendations_for_user(user)
        except Exception as e:
            print(f"Error computing recos for {user.id}: {e}")
