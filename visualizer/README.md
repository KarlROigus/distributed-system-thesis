# Visualizer Service

A Node.js-based real-time visualization dashboard for the distributed system.

## Features

- **Real-time Data Visualization**: Live charts showing incoming data values
- **WebSocket Support**: Real-time updates using Socket.IO
- **Statistics Dashboard**: 
  - Current value
  - Total received count
  - Average calculation
  - Min/Max values
  - Client activity tracking
- **Modern UI**: Beautiful, responsive dashboard with Chart.js

## Architecture

The visualizer consists of:
- **Backend (Express + Socket.IO)**: Receives data from Core service and broadcasts to connected clients
- **Frontend (HTML + Chart.js)**: Real-time dashboard with interactive charts

## API Endpoints

- `POST /data` - Receives data from Core service
- `GET /metrics` - Returns current aggregated metrics
- WebSocket connection - Real-time data streaming to clients

## Running

### With Docker Compose (Recommended)

```bash
docker compose up --build
```

The dashboard will be available at: http://localhost:3000

### Local Development

```bash
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Data Flow

1. Clients send data to Core service
2. Core aggregates and forwards data to Visualizer
3. Visualizer updates metrics and broadcasts to all connected dashboard clients
4. Dashboard displays real-time charts and statistics

