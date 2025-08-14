# Frontend - React TypeScript

This is the React TypeScript frontend for the PlutoData assignment.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   npm run dev
   ```

The application will be available at http://localhost:5173

## Available Scripts

- `npm start` - Start the development server
- `npm run dev` - Start the development server (alias for start)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **Responsive design** with modern CSS
- **Error handling** and loading states
- **CRUD operations** for items

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## API Integration

The frontend communicates with the FastAPI backend running on `http://localhost:8000`. The application includes:

- Fetching all items
- Creating new items
- Deleting items
- Error handling for API failures

## Technologies Used

- React 18
- TypeScript
- Vite
- Axios
- Modern CSS with Flexbox and Grid
