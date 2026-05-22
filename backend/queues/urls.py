from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/queues/', views.queue_times, name='queue_times'),
    path('api/v2/queues/attractions/', views.attraction_queue_times, name='attraction_queue_times'),
    path('api/v1/opening-hours/', views.opening_hours, name='opening_hours'),
] 