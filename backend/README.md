# Backend - FastAPI

This is the Python FastAPI backend for the PlutoData assignment.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

### Development Mode
```bash
uvicorn main:app --reload
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Endpoints

- `GET /` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create a new item
- `GET /api/items/{item_id}` - Get a specific item
- `DELETE /api/items/{item_id}` - Delete an item
