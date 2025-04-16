from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/queues/', views.queue_times, name='queue_times'),
] 