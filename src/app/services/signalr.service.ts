import { Injectable } from '@angular/core';
import { UserServiceService } from './Users/user-service.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection: any;
  private proxy: any;
  private reconnectInterval = 5000;
  private reconnectTimeoutId: any;
  private registry: Map<string, Array<(data: any) => void>> = new Map();

  constructor(private us: UserServiceService) { }

  public startConnection(): void {
    if (!this.hubConnection) {
      const user = this.us.getUser();
      this.hubConnection = ($ as any).hubConnection(`${this.us.getServer()}/signalR`);
      this.proxy = this.hubConnection.createHubProxy('SucursalHub');

      this.hubConnection.stateChanged((change: any) => {
        console.log('SignalR estado:', change.oldState, '->', change.newState);

        // Auto-reconexión exitosa (2→1): el connection ID cambió, hay que re-unirse al grupo
        if (change.newState === 1 && change.oldState === 2) {
          this.proxy.invoke('unirseASucursal', this.us.getUser().idsucursal)
            .fail((err: any) => console.error('Error al re-unirse al grupo tras reconexión automática:', err));
        }

        // Desconexión total: el cliente desistió de reconectar, intentar manualmente
        if (change.newState === 4) {
          console.warn('SignalR desconectado, iniciando reconexión manual...');
          this.tryReconnect();
        }
      });

      this.hubConnection.start()
        .done(() => {
          console.log('Conexión a SignalR iniciada');
          this.proxy.invoke('unirseASucursal', user.idsucursal)
            .fail((err: any) => console.error('Error al unirse al grupo:', err));
        })
        .fail((err: any) => {
          console.error('Error al iniciar la conexión:', err);
          this.tryReconnect();
        });
    }
  }

  private tryReconnect(): void {
    if (this.reconnectTimeoutId) return;

    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;
      const user = this.us.getUser();
      this.hubConnection.start()
        .done(() => {
          console.log('Reconexión manual exitosa');
          this.proxy.invoke('unirseASucursal', user.idsucursal)
            .fail((err: any) => console.error('Error al re-unirse al grupo:', err));
        })
        .fail((err: any) => {
          console.error('Error al reconectar:', err);
          this.tryReconnect();
        });
    }, this.reconnectInterval);
  }

  // Registra el listener solo si la referencia exacta aún no está registrada para ese evento
  public addListener(eventName: string, callback: (data: any) => void): void {
    if (!this.proxy) {
      console.error('Proxy no disponible — llama startConnection() primero');
      return;
    }
    const callbacks = this.registry.get(eventName) ?? [];
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
      this.registry.set(eventName, callbacks);
      this.proxy.on(eventName, callback);
    }
  }

  // Llámalo en ngOnDestroy para evitar que el callback quede huérfano en el proxy
  public removeListener(eventName: string, callback: (data: any) => void): void {
    if (!this.proxy) return;
    const callbacks = this.registry.get(eventName);
    if (!callbacks) return;
    const idx = callbacks.indexOf(callback);
    if (idx !== -1) {
      callbacks.splice(idx, 1);
      this.proxy.off(eventName, callback);
    }
  }

  public sendMessage(methodName: string, message: any): void {
    if (this.proxy) {
      this.proxy.invoke(methodName, message)
        .fail((err: any) => console.error('Error al enviar mensaje:', err));
    }
  }

  public ensureConnected(): void {
    if (!this.hubConnection) {
      this.startConnection();
      return;
    }
    // state 4 = disconnected: trigger manual reconnect
    if (this.hubConnection.state === 4) {
      this.tryReconnect();
    }
    // state 1 = connected: re-join group in case membership was lost
    if (this.hubConnection.state === 1) {
      const user = this.us.getUser();
      if (user) {
        this.proxy.invoke('unirseASucursal', user.idsucursal)
          .fail((err: any) => console.error('Error al re-unirse al grupo:', err));
      }
    }
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
      this.hubConnection.stop()
        .done(() => console.log('Conexión a SignalR detenida'))
        .fail((err: any) => console.error('Error al detener la conexión:', err));
    }
  }
}
