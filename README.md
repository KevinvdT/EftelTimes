# EftelTimes

Unofficial fan-made queue times application for the Efteling theme park. Built with React and Django.

*This is not affiliated with, endorsed, or sponsored by the Efteling theme park.*

## Features

- 🎢 Real-time queue times for all attractions
- ⏱️ Single rider wait times
- 🎪 Attraction status (open, closed, maintenance)
- 🌐 Multi-language support
- 🎨 Beautiful, theme-park inspired design

## Project Structure

```
.
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/     # Redux store
│   └── ...
└── backend/           # Django API
    ├── efteltimes/   # Django project
    └── queues/       # Queue times app
```

## Development Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend

```bash
cd backend
pipenv install
pipenv shell
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /api/v1/queues/` - Get all queue times
  ```json
  {
    "last_updated": "2024-04-15T21:00:00Z",
    "source": "tpw-api",
    "entities": {
      "attractions": [
        {
          "name": "Python",
          "waitTime": 15,
          "singleRider": {
            "available": true,
            "waitTime": 5
          },
          "status": "open"
        }
      ]
    }
  }
  ```

## Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:8000
```

### Backend
```env
DEBUG=True
USE_DUMMY_DATA=True  # Set to False for real API
```

## FUTURE Features

- [ ] User-controlled sorting of attractions
- [ ] Show schedules for entertainment
- [ ] Historical wait time data
- [ ] Push notifications for status changes

## License

MIT License - See LICENSE file for details 