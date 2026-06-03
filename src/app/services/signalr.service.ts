import { Injectable } from '@angular/core';
import { UserServiceService } from './Users/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: any;
  private proxy: any;
  private reconnectInterval = 5000; // 5 segundos entre intentos
  private reconnectTimeoutId: any;

  constructor(
    private us: UserServiceService
  ) { }

  public startConnection(): void {
    if (!this.hubConnection) {
      this.hubConnection = ($ as any).hubConnection(`${this.us.getServer()}/signalR`);

      const user = this.us.getUser();
      if (user.idsucursal === 1) {
        console.log('Hub OASIS 1');
        this.proxy = this.hubConnection.createHubProxy('MyHub1');
      } else {
        console.log('Hub OASIS 2');
        this.proxy = this.hubConnection.createHubProxy('MyHub2');
      }

      this.hubConnection.stateChanged((change: any) => {
        console.log('Estado conexión:', change.oldState, '->', change.newState);
        if (change.newState === 4) { // Estado desconectado
          console.warn('SignalR desconectado, intentando reconectar...');
          this.tryReconnect();
        }
      });

      this.hubConnection.start()
        .done(() => console.log('Conexión a SignalR iniciada'))
        .fail((err: any) => {
          console.error('Error al iniciar la conexión: ', err);
          this.tryReconnect();
        });
    }
  }

  private tryReconnect(): void {
    if (this.reconnectTimeoutId) {
      // Ya está intentando reconectar, no hacer nada
      return;
    }

    this.reconnectTimeoutId = setTimeout(() => {
      console.log('Intentando reconectar a SignalR...');
      this.hubConnection.start()
        .done(() => {
          console.log('Reconexión exitosa');
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        })
        .fail((err: any) => {
          console.error('Error al reconectar:', err);
          this.reconnectTimeoutId = null;
          // Volver a intentar
          this.tryReconnect();
        });
    }, this.reconnectInterval);
  }

  public addListener(eventName: string, callback: (data: any) => void): void {
    if (this.proxy) {
      this.proxy.on(eventName, callback);
    } else {
      console.error('La conexión no está establecida aún');
    }
  }

  public sendMessage(methodName: string, message: any): void {
    if (this.hubConnection) {
      this.proxy.invoke(methodName, message)
        .fail((err: any) => console.error('Error al enviar mensaje: ', err));
    }
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;

      this.hubConnection.stop()
        .done(() => console.log('Conexión a SignalR detenida'))
        .fail((err: any) => console.error('Error al detener la conexión: ', err));
    }
  }
}
