from django.shortcuts import render
import requests
import json
from django.utils import timezone
from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pathlib import Path
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from django.core.cache import cache
from django.utils.decorators import method_decorator
from functools import wraps
from .entity_data import ENTITY_INFO, EXCLUDED_ENTITIES

# Settings
USE_DUMMY_DATA = False  # Set to False to use the real API
DEBUG = True  # Set to True to disable caching during development

# API Configuration
EFTELING_ID = "30713cf6-69a9-47c9-a505-52bb965f01be"
THEMEPARKS_API_URL = f"https://api.themeparks.wiki/v1/entity/{EFTELING_ID}/live"
THEMEPARKS_HOURS_URL = f"https://api.themeparks.wiki/v1/entity/{EFTELING_ID}/schedule"

# Path to dummy data
DUMMY_DATA_PATH = Path(__file__).parent / "dummydata.json"

def transform_entity(data):
    """Transform a single entity's data into the desired format."""
    # Skip if it's in the excluded list
    if data.get("externalId") in EXCLUDED_ENTITIES:
        return None

    if data["entityType"] == "ATTRACTION":
        external_id = data.get("externalId")
        entity_info = ENTITY_INFO.get(external_id, {
            "lang": {
                "en": {
                    "name": data["name"],
                    "is_official": False,
                    "is_same": True
                },
                "de": {
                    "name": data["name"],
                    "is_official": False,
                    "is_same": True
                }
            },
            "area": None
        })

        result = {
            "name": data["name"],
            "translations": entity_info["lang"],
            "status": data["status"].lower(),
            "type": "attraction",
            "area": entity_info["area"],
            "externalId": external_id,
            "waitTime": None,
            "singleRider": {
                "available": False,
                "status": None,
                "waitTime": None
            }
        }

        # Extract wait times if available
        if "queue" in data:
            if "STANDBY" in data["queue"] and data["queue"]["STANDBY"].get("waitTime") is not None:
                result["waitTime"] = data["queue"]["STANDBY"]["waitTime"]
            
            # Check for single rider queue
            if "SINGLE_RIDER" in data["queue"]:
                result["singleRider"]["available"] = True
                result["singleRider"]["status"] = data["queue"]["SINGLE_RIDER"].get("status", "CLOSED").lower()
                if data["queue"]["SINGLE_RIDER"].get("waitTime") is not None:
                    result["singleRider"]["waitTime"] = data["queue"]["SINGLE_RIDER"]["waitTime"]

        return result

    elif data["entityType"] == "SHOW":
        external_id = data.get("externalId")
        entity_info = ENTITY_INFO.get(external_id, {
            "lang": {
                "en": {
                    "name": data["name"],
                    "is_official": False,
                    "is_same": True
                },
                "de": {
                    "name": data["name"],
                    "is_official": False,
                    "is_same": True
                }
            },
            "area": None
        })

        result = {
            "name": data["name"],
            "translations": entity_info["lang"],
            "status": data["status"].lower(),
            "type": "show",
            "area": entity_info["area"],
            "externalId": external_id,
            "schedule": []
        }

        if "schedule" in data:
            for showtime in data["schedule"]:
                result["schedule"].append({
                    "startTime": showtime.get("startTime"),
                    "endTime": showtime.get("endTime"),
                    "status": showtime.get("status", "UNKNOWN").lower()
                })

        return result

    return None

@api_view(['GET'])
@cache_page(60) if not DEBUG else lambda x: x  # Cache for 60 seconds unless in debug mode
def queue_times(request):
    """Fetch and return queue times from either ThemeParks API or dummy data."""
    try:
        if USE_DUMMY_DATA:
            # Load data from dummy file
            with open(DUMMY_DATA_PATH) as f:
                data = json.load(f)
            source = "dummy"
        else:
            # Fetch data from ThemeParks API
            response = requests.get(THEMEPARKS_API_URL)
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()
            source = "tpw-api"

        # Transform the data and group by type
        grouped_entities = {
            "attractions": [],
            "shows": []
        }
        for item in data.get("liveData", []):
            transformed = transform_entity(item)
            if transformed is not None:
                if transformed["type"] == "attraction":
                    grouped_entities["attractions"].append(transformed)
                elif transformed["type"] == "show":
                    grouped_entities["shows"].append(transformed)

        # Return the transformed data
        return Response({
            "last_updated": timezone.now().isoformat(),
            "source": source,
            "entities": grouped_entities
        })

    except (requests.RequestException, FileNotFoundError, json.JSONDecodeError) as e:
        return Response({
            "error": "Failed to fetch queue times",
            "detail": str(e)
        }, status=503)  # Service Unavailable

def cache_until_midnight(view_func):
    """Cache the view until midnight Amsterdam time."""
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        # Get Amsterdam timezone
        tz = ZoneInfo('Europe/Amsterdam')
        now = datetime.now(tz)
        
        # Calculate time until midnight
        midnight = (now + timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        seconds_until_midnight = int((midnight - now).total_seconds())
        
        # Create a cache key that includes the date
        cache_key = f'opening_hours_{now.date().isoformat()}'
        
        # Try to get from cache
        response_data = cache.get(cache_key)
        if response_data is not None and not DEBUG:
            return Response(response_data)
        
        # If not in cache, call the view function
        response = view_func(request, *args, **kwargs)
        
        # Cache the response data until midnight
        if not DEBUG:
            cache.set(cache_key, response.data, seconds_until_midnight)
        
        return response
    
    return wrapped_view

@api_view(['GET'])
@cache_until_midnight
def opening_hours(request):
    """Fetch and return today's and tomorrow's park opening hours."""
    try:
        # Fetch data from ThemeParks API
        response = requests.get(THEMEPARKS_HOURS_URL)
        response.raise_for_status()
        data = response.json()

        # Get current date in park's timezone
        tz = ZoneInfo(data.get('timezone', 'Europe/Amsterdam'))
        current_date = datetime.now(tz).date()
        tomorrow_date = current_date + timedelta(days=1)

        # Find today's and tomorrow's opening hours
        schedule = data.get('schedule', [])
        today_hours = next(
            (s for s in schedule if s['date'] == current_date.isoformat()),
            None
        )
        tomorrow_hours = next(
            (s for s in schedule if s['date'] == tomorrow_date.isoformat()),
            None
        )

        return Response({
            'today': today_hours,
            'tomorrow': tomorrow_hours,
            'timezone': data.get('timezone'),
            'last_updated': timezone.now().isoformat()
        })

    except requests.RequestException as e:
        return Response({
            'error': 'Failed to fetch opening hours',
            'detail': str(e)
        }, status=503)  # Service Unavailable
