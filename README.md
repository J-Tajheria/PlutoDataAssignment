# PlutoDataAssignment

A minimal application with TypeScript React frontend and Python FastAPI backend.

## Project Structure

```
PlutoDataAssignment/
├── frontend/          # TypeScript React application
├── backend/           # Python FastAPI application
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python3 -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Endpoints

- `GET /` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create a new item

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Python 3.8+, FastAPI, Uvicorn