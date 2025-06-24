const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

const sessions = {} // In-memory store

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Create a session
  socket.on('createSession', () => {
    const sessionId = Math.random().toString(36).substr(2, 6)
    sessions[sessionId] = {
      players: [socket.id],
      playedCards: [],
      currentTurnPlayerId: socket.id,
    }
    socket.join(sessionId)
    socket.emit('sessionCreated', sessionId)
    console.log(`Session ${sessionId} created`)
  })

  // Join a session
  socket.on('joinSession', (sessionId) => {
    const session = sessions[sessionId]
    if (!session || session.players.length >= 2) {
      socket.emit('joinError', 'Invalid or full session')
      return
    }

    session.players.push(socket.id)
    socket.join(sessionId)
    socket.emit('sessionJoined', sessionId)
    console.log(`Player joined session ${sessionId}`)

    // Notify both players: session is ready
    io.to(sessionId).emit('sessionReady', {
      players: session.players,
      currentTurnPlayerId: session.currentTurnPlayerId,
      playedCards: session.playedCards,
    })
  })

  // Handle card play
  socket.on('playCard', ({ sessionId, card }) => {
    const session = sessions[sessionId]
    if (!session) return

    if (socket.id !== session.currentTurnPlayerId) {
      socket.emit('playError', 'Not your turn')
      return
    }

    session.playedCards.push({
      player: socket.id,
      card,
    })

    // Switch turn
    const [p1, p2] = session.players
    session.currentTurnPlayerId = session.currentTurnPlayerId === p1 ? p2 : p1

    // Broadcast updated state to both players
    io.to(sessionId).emit('updateBattlefield', {
      playedCards: session.playedCards,
      currentTurnPlayerId: session.currentTurnPlayerId,
    })
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)

    for (const [sessionId, session] of Object.entries(sessions)) {
      session.players = session.players.filter((p) => p !== socket.id)

      if (session.players.length === 0) {
        delete sessions[sessionId]
      }
    }
  })
})

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
