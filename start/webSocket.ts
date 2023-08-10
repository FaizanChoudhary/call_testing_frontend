import Ws from 'App/Services/Websocket'
import * as fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'
Ws.boot()

// Listen for incoming socket connections

// var file_name
var stream_id = uuidv4().toString()
if (!fs.existsSync(Application.tmpPath())) {
  fs.mkdirSync(Application.tmpPath())
}
const dir = Application.tmpPath('/audio_stream')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

Ws.ws.on('connection', (ws) => {
  ws.isAlive = true
  ws.id = stream_id
  ws.on('pong', () => {
    Ws.heartbeat(ws)
  })
  console.log('New connection initiated!')
  ws.on('message', (message) => {
    if (message.indexOf('{') != 0) {
      console.log(message)
    } else {
      const msg = JSON.parse(message)
      switch (msg.event) {
        case 'connected':
          console.log('A new call has connected')
          break
        case 'start':
          console.log('A new call has started', msg)
          break
        case 'media':
          // console.log("Receiving audio...");
          break
        case 'stop':
          console.log('socket message Stream Stoped ')
          // mediaStreamSaver.twilioStreamStop();
          break
        default:
          break
      }
    }
  })
  ws.on('close', function close() {
    console.log('connection closing')
  })
})
