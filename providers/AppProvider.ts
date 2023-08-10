import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Application from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    if (Application.environment === 'web') {
      // socket run
      // await import('../start/webSocket')
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
