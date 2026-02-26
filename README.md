# Frontend Communication Handover Documentation

## Development Environment Setup

- Install dependencies: Run `npm install`
- Launch service: Execute `npm run dev` 

## Code Architecture & Component Structure

For maintainability, styles and logic have been decoupled by components:

1. **components/**: Each functional component has its own `.tsx` and `.css` files
2. **App.tsx**: Main application entry point that manages global state (file queue, view switching)
3. **App.css**: Contains global layout, CSS Grid definitions, and CSS Reset
4. **types.ts**: Defines core data structures used throughout the frontend

## Backend Integration Points

### File Upload Process
- **Endpoint**: `POST /upload_video`
- **Payload**: FormData (field name: `file`)
- **Expected Response**: JSON object containing `task_id`

### Task Status Polling
- **Endpoint**: `GET /status/{taskId}`
- **Polling Interval**: Every 2 seconds
- **Response Handling**: When `state === "SUCCESS"`, the frontend stops polling and processes the `result` field

## Upcoming Implementation Tasks

1. **Update Upload Logic in App.tsx**: Replace the current `simulateAnalysis` function with actual fetch requests
2. **Implement Polling in AnalysisResults.tsx**: Add status polling functionality to monitor task progress
