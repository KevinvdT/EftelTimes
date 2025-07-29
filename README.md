# EftelTimes
[![wakatime](https://wakatime.com/badge/github/KevinvdT/EftelTimes.svg)](https://wakatime.com/badge/github/KevinvdT/EftelTimes)

Queue times application for the Efteling theme park. Built with React and Django.

A fan-made project, not affiliated with the Efteling.

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

## Roadmap

### ✅ Phase 1: Project Foundation
- [x] Folder structure created: `/frontend` and `/backend`
- [x] Vite + React frontend scaffolded
- [x] Django backend scaffolded using Pipenv
- [x] TailwindCSS and styled-components set up
- [x] Redux Toolkit and React Router configured
- [x] Django REST Framework and CORS configured
- [x] File-based caching set up in Django

### 🎨 Phase 2: UI & Component Architecture
- [x] Project folders organized (`components/`, `layouts/`, `pages/`, `store/`, etc.)

#### UI Components (Presentational)
- [x] Build reusable UI components:
  - [x] Time display component
  - [x] Status indicator component
  - [x] Entity row component
- [x] Additional UI components:
  - [x] Tag components for status/type
  - [x] Card components for attraction details
  - [x] Loading and error state components


#### Layout Components
- [x] Create layout components:
  - [x] Page container with consistent spacing
  - [x] Header component with park status
  - [x] Responsive grid system
  - [x] Footer component
  - [x] Section container components

#### Page Components
- [x] HomePage component:
  - [x] Data fetching and state management
  - [x] Layout assembly
  - [x] UI component integration
  - [x] Responsive design

### 🔌 Phase 3: API Integration
- [x] Switch from Python wrapper to direct ThemeParks API usage
- [x] Set up `/api/v1/queues/` endpoint
- [x] Extract: name, status, wait times, area, type, translations
- [x] Include `last_updated` timestamp
- [x] Cache backend response for 60 seconds
- [x] Connect frontend to live data using RTK Query
- [x] Transform API data for frontend consumption
- [x] Add opening hours endpoint and integration
- [x] Handle timezone differences correctly

### 🧠 Phase 4: UX & State Features
- [x] Add loading and error handling
- [x] Implement global state for queue data
- [x] Smart status display based on park hours

### 🚀 Phase 5: Final Touches & Deployment
- [x] Add favicon and page title
- [ ] Add legal/fan disclaimer in the footer
- [x] Optimize layout for mobile
- [ ] Deploy backend to VPS with Nginx
- [ ] Deploy frontend (same VPS or static host)

### 🎯 Phase 6: Future Improvements
- [ ] Toggle and button components
- [ ] Add toggle for grouping by area
- [ ] Default: **grouped on desktop**, **flat on mobile**
- [ ] Favoriting functionality
- [ ] Search/filter functionality
- [ ] Dark mode support
- [ ] Winter theme
- [ ] Internationalization:
  - [ ] English version
  - [ ] Language switcher
  - [ ] Automatic language detection
- [ ] German localization
- [ ] Additional pages:
  - [ ] Attraction detail pages with history
  - [ ] Settings page for preferences
  - [ ] About page with project info
- [ ] Improved data visualization:
  - [ ] Wait time trends
  - [ ] Peak hours indication
  - [ ] Historical data analysis

## License

MIT License - See LICENSE file for details 