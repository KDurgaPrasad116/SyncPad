# 🚀 SyncPad

> A real-time collaborative workspace with live document editing, team chat, voice messaging, file sharing, and presence awareness.

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-success)
![Hocuspocus](https://img.shields.io/badge/Hocuspocus-WebSocket-orange)

---

## 📖 Overview

SyncPad is a collaborative workspace inspired by tools like Google Docs, Notion, and Slack.

It allows multiple users to join a shared room where they can

- Edit documents simultaneously
- Chat in real time
- Share files
- Record and send voice messages
- See active collaborators and live cursors

The synchronization engine is powered by **Yjs CRDTs**, making collaboration conflict-free without traditional locking.

---

## ✨ Features

### 📝 Collaborative Rich Text Editor

- Live document editing
- Rich text formatting
- Ordered/Bullet Lists
- Cursor synchronization
- Conflict-free editing (CRDT)

---

### 💬 Team Chat

- Real-time messaging
- Link preview support
- Rich text rendering
- Auto scrolling

---

### 🎤 Voice Messages

- Record audio
- Preview before sending
- Playback inside chat

---

### 📂 File Sharing

- Upload files
- Download shared files
- File size validation

---

### 👥 Presence System

- Live online users
- User colors
- Cursor tracking
- Active workspace members

---

### 📱 Mobile Friendly

- Responsive layout
- Swipe navigation
- Mobile tabs

---

## 🏗 Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Rich Text

- Quill
- Quill Cursors

### Collaboration

- Yjs
- Hocuspocus

### Styling

- CSS
- Responsive Design

### Backend

- Node.js
- Express
- WebSocket

---

## ⚙️ Architecture

```
                Client A
                    │
                    │
        ┌───────────▼───────────┐
        │    Hocuspocus Server  │
        └───────────▲───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
     Client B               Client C
```

All clients synchronize using Yjs CRDT documents through a Hocuspocus WebSocket server.

---

## 📂 Project Structure

```text
SyncPad/
├── public/
├── server/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── audio/
│   │   ├── chat/
│   │   ├── editor/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/KDurgaPrasad116/SyncPad.git
```

Move inside the project

```bash
cd SyncPad
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Run backend

```bash
node server/server.cjs
```

Open

```
http://localhost:5173
```

---

## 🛠 Usage

1. Start the backend
2. Start the frontend
3. Enter your username
4. Create or join a room
5. Start collaborating instantly

---

## 🔄 How Collaboration Works

1. User edits Quill document
2. Quill updates Yjs document
3. Yjs generates CRDT updates
4. Hocuspocus broadcasts updates
5. Other clients receive updates
6. Their editors update instantly

No manual synchronization is required.

---

## 📡 Real-Time Features

✔ Live document editing

✔ Live chat

✔ Live cursors

✔ Active users

✔ Voice messages

✔ File sharing

---

## 📈 Performance

- Conflict-free synchronization
- Efficient CRDT updates
- Minimal network traffic
- Low latency collaboration

---

## 🛣 Roadmap

- [ ] Authentication
- [ ] Room permissions
- [ ] Dark mode
- [ ] Emoji reactions
- [ ] Collaborative drawing board
- [ ] Markdown support
- [ ] Image upload
- [ ] Notifications
- [ ] Video calls
- [ ] Database persistence
- [ ] Offline support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit changes

```bash
git commit -m "Add amazing feature"
```

4. Push branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

See the LICENSE file for details.

---

## 👨‍💻 Author

**K Durga Prasad**

GitHub

https://github.com/KDurgaPrasad116

---

## 🙏 Acknowledgements

- React
- Yjs
- Hocuspocus
- Quill
- TypeScript
- Vite