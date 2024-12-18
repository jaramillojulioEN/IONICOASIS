import { Injectable } from '@angular/core';
import { UserServiceService } from './Users/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: any;
  private proxy: any;

  constructor(

    private us : UserServiceService
  ) { }

  public startConnection(): void {
    if (!this.hubConnection) {
      // Usa $.hubConnection para crear la conexión
      // this.hubConnection = ($ as any).hubConnection('https://localhost:44397/signalR');  URL de tu servidor ASP.NET SignalR
      this.hubConnection = ($ as any).hubConnection(`${this.us.getServer()}/signalR`);
      var user = this.us.getUser()
      if(user.idsucursal == 1){
        console.log('Hub OASIS 1')
        this.proxy = this.hubConnection.createHubProxy('MyHub1');  // Cambia 'nombreDelHub' por el nombre de tu hub
      }else{
        console.log('Hub OASIS 2')
        this.proxy = this.hubConnection.createHubProxy('MyHub2');  // Cambia 'nombreDelHub' por el nombre de tu hub
      }
      this.hubConnection.start()
        .done(() => console.log('Conexión a SignalR iniciada'))
        .fail((err: any) => console.error('Error al iniciar la conexión: ', err));
    }

    
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
      this.hubConnection.stop()
        .done(() => console.log('Conexión a SignalR detenida'))
        .fail((err: any) => console.error('Error al detener la conexión: ', err));
    }
  }
}
