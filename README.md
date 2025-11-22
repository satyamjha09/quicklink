# 3D Product Viewer (MERN + Three.js)

## Overview
This application is a 3D Product Viewer built to demonstrate proficiency in Frontend (React, Three.js) and Backend (simulated MERN stack) development, along with AI integration using Google's Gemini API.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`) via `@google/genai`
- **Icons**: Lucide React
- **Persistence**: Simulated REST API using `localStorage` (Mock Service Layer)

## Architecture

### Frontend
The application uses a classic single-page application (SPA) architecture.
- **App.tsx**: The central controller managing global state (model URL, settings) and layout.
- **Scene.tsx**: Encapsulates the 3D canvas. It uses `<Stage>` from `drei` for instant professional lighting and centering.
- **Services**: `mockBackend` simulates API latency and persistence. `geminiService` handles AI logic.

### "Backend" Simulation
Due to the constraints of the test environment (Single Page App delivery), the Node.js/Express/MongoDB backend is simulated via the `mockBackend.ts` service.
- **Upload**: Creates a Blob URL from the File object.
- **Save Settings**: Stores a JSON document in the browser's `localStorage` with a generated ID.
- **Fetch Settings**: Retrieves the JSON document by ID from `localStorage`.

This pattern ensures the *interface* and *data flow* match a real full-stack application, easily replaceable with real `axios` calls to a backend.

## Key Features
1.  **3D Model Loading**: Supports `.glb` and `.gltf` files via drag-and-drop or file picker.
2.  **Interactive Controls**: Orbit controls (Rotate, Zoom, Pan), Auto-rotate toggle, Wireframe mode.
3.  **AI Designer**: Integrated Gemini 2.5 Flash model. Users can type "Cyberpunk" or "Minimalist", and the AI generates a color palette and view settings (wireframe/grid) which are automatically applied.
4.  **Configuration Persistence**: Users can "Save" their current view setup and reload it later using the generated Config ID.

## Deployment
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set environment variable: `REACT_APP_API_KEY` (or similar) for Gemini.
4.  Build: `npm run build`
5.  Deploy the `build` folder to Vercel or Netlify.

## Important Decisions
- **@react-three/drei Stage**: Used to reduce boilerplate for lighting and shadows. It automatically calculates the bounding box of the model and centers it, providing immediate visual quality.
- **Tailwind CSS**: Chosen for rapid UI development and mobile responsiveness.
- **Mock Backend**: Implemented to fulfill the "Backend API Design" criteria within a frontend-only deployable artifact, ensuring the code structure reflects a full-stack mindset.
