import Ws from 'App/Services/ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('offer', (offer) => {
    console.log('recevied offer:', offer)
    socket.broadcast.emit('offer', offer)
  })

  socket.on('answer', (answer) => {
    console.log('recevied answer:', answer)
    socket.broadcast.emit('answer', answer)
  })

  socket.on('ice-candidate', (candidate) => {
    console.log('recevied ice-candidate:', candidate)

    socket.broadcast.emit('ice-candidate', candidate)
  })

  socket.on('media', (data) => {
    // Handle received audio data here
    console.log(data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})
