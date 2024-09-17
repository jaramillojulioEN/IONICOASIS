import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.page.html',
  styleUrls: ['./signalr.page.scss'],
})
export class SignalrPage implements OnInit {

  public ordenesModificadas: any[] = [];  // Array para almacenar las órdenes modificadas

  constructor(private signalRService: SignalrService) { }

  ngOnInit() {
    // Inicia la conexión al hub de SignalR
    this.signalRService.startConnection();

    // Añade un listener para escuchar el evento 'Modificaciones' desde el servidor
    this.signalRService.addListener('OrdenesModificadasCocina', (ordenes: any[]) => {
      console.log('Órdenes modificadas recibidas del servidor: ', ordenes);
      this.ordenesModificadas = ordenes;  // Almacena las órdenes modificadas en el array
    });
  }
}
