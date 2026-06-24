# SyncPad

SyncPad is a real-time collaborative text editor built with React, TypeScript, Quill, Yjs, and Hocuspocus. It lets multiple users join the same workspace, edit together instantly, and see live cursor and presence updates with conflict-free synchronization powered by CRDTs.

## Features

- Real-time collaborative editing
- Shared workspaces with join codes
- Live cursor tracking
- User presence with names and colors
- Conflict-free synchronization with Yjs
- Rich text editing with Quill
- WebSocket-powered collaboration
- Lightweight and responsive UI
- Local-first support with IndexedDB sync

## Demo Flow

1. Enter your display name.
2. Enter a workspace code.
3. Join the workspace.
4. Share the code with others.
5. Start editing together in real time.

All connected users see text updates and cursor movement instantly.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Quill

### Collaboration
- Yjs
- y-quill
- y-websocket
- y-indexeddb

### Backend
- Hocuspocus Server
- Hocuspocus Provider
- WebSockets

### Presence
- Quill Cursors
- Yjs Awareness API

## Architecture

```text
┌───────────────┐
│ React + Quill │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Yjs CRDT    │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│ Hocuspocus Server  │
│ ws://localhost:1234│
└───────┬────────────┘
        │
        ▼
  Multiple connected clients
```

Yjs manages the shared document state using CRDTs, which allows multiple users to edit the same content without merge conflicts.

## Project Structure

```text
SyncPad/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   └── Editor.tsx
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── server.cjs
├── package.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

### Clone the Repository

```bash
git clone https://github.com/KDurgaPrasad116/SyncPad.git
cd SyncPad
```

### Install Dependencies

```bash
npm install
```

## Run Locally

### 1. Start the collaboration server

```bash
node server.cjs
```

Expected output:

```text
🚀 Secure Signaling Backend running on ws://localhost:1234
```

### 2. Start the frontend

Open a second terminal and run:

```bash
npm run dev
```

Vite will start the app locally, usually at:

```text
http://localhost:5173
```

Open that URL in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

## Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-dom` | React rendering |
| `quill` | Rich text editor |
| `yjs` | CRDT-based synchronization |
| `y-quill` | Quill and Yjs binding |
| `@hocuspocus/provider` | Realtime collaboration provider |
| `@hocuspocus/server` | Collaboration backend |
| `quill-cursors` | Live cursor rendering |
| `ws` | WebSocket support |

## How It Works

### Workspace Rooms

Each collaborative session is identified by a room name based on the workspace code:

```ts
name: `secure-workspace-${roomCode}`
```

Users who join with the same workspace code connect to the same shared document.

### Presence and Awareness

Each connected user shares metadata like this:

```ts
{
  name: userName,
  color: myColor
}
```

This powers live cursor indicators and active-user presence in the editor.

### Live Synchronization

SyncPad combines:

- Quill editor events
- Yjs CRDT updates
- Hocuspocus WebSocket transport

This setup keeps every connected client in sync while avoiding manual merge handling.

## Configuration

### WebSocket Endpoint

Current development configuration:

```ts
url: "ws://localhost:1234"
```

For production, replace it with your deployed secure endpoint:

```ts
url: "wss://your-domain.com"
```

## Screenshots

Add screenshots or GIFs here to show the join screen and collaborative editor.

Example:

```md


```

## Future Improvements

- Authentication and user accounts
- Workspace invitations
- Database-backed document persistence
- End-to-end encryption
- Rich text extensions
- File uploads
- Version history
- Comments and annotations
- Dark mode
- User avatars

## Troubleshooting

### Cannot connect to workspace

Make sure the backend server is running:

```bash
node server.cjs
```

### WebSocket connection failed

Check that this endpoint is reachable:

```text
ws://localhost:1234
```

Also verify that no firewall or port conflict is blocking the connection.

### Collaborators cannot see updates

Check the following:

- Both users joined the same workspace code.
- The backend server is running.
- The browser console shows no WebSocket or provider errors.

## Development Notes

SyncPad initializes the collaboration layer in this order:

1. Quill editor
2. Yjs document
3. Hocuspocus provider
4. Quill-Yjs binding

This creates a shared editing environment with synchronized document state and collaborative presence.

## Author

**Durga Prasad**

- GitHub: [KDurgaPrasad116](https://github.com/KDurgaPrasad116)

## License

This project does not currently include a license.

If you want to make it open source, add an MIT license in a separate `LICENSE` file.

## Acknowledgements

Built with:

- Yjs
- Hocuspocus
- Quill
- React
- Vite
