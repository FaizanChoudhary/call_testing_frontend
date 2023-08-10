import ws from 'ws'
import AdonisServer from '@ioc:Adonis/Core/Server'

class Ws {
  public ws: any
  private booted = false

  public broadcast(msg: string) {
    this.ws.clients.forEach((client) => {
      client.send(msg)
    })
  }
  public connectionStatus() {
    this.ws.clients.forEach((client) => {
      if (client.isAlive === false) {
        return client.terminate()
      }
      client.isAlive = false
      client.ping()
    })
  }
  public heartbeat(ws) {
    ws.isAlive = true
  }
  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.ws = new ws.Server({ server: AdonisServer.instance! })
  }
}

export default new Ws()
