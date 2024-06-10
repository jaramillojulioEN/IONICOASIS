import { Component, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import {AlertServiceService} from 'src/app/services/Alerts/alert-service.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.page.html',
  styleUrls: ['./lavado.page.scss'],
})
export class LavadoPage implements OnInit {
  segmento: string = "pago"
  fechaActual: string = "";

  vehiculo: any = []

  vehiculos: any = []
  servicios: any = [];

  lavado = {
    tipoEntidad: "lavado",
    entidad: {
      id: 0,
      fecha: new Date().toISOString(),
      estado: 1,
      idsucursal: 0,
      total: 0,
      lavadodet: []
    }
  }
  lavados: any = [];

  constructor(private mc : ModalController ,private ac : AlertServiceService,private LavadoService: LavadoService, protected UserServiceService: UserServiceService) { }

  ngOnInit() {
    this.obtenerLavados(1)
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async Guardar(): Promise<void> {
    let user = this
    console.log(this.servicios)
    this.lavado.entidad.idsucursal = this.UserServiceService.getUser().idsucursal
    this.lavado.entidad.lavadodet = this.servicios
    console.log(this.lavado);


    (await this.LavadoService.CrearLavado(this.lavado)).subscribe(
      (response: any) => {
        console.log(response);
        if(response.message){
          this.ac.presentCustomAlert("Exito", response.message)

        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

  
  async obtenerLavados(estado: number): Promise<void> {
    (await this.LavadoService.lavados(estado)).subscribe(
      async (response: any) => {
        if (response && response.Lavados) {
          this.lavados = response.Lavados;
          console.log(this.lavados)
          this.obtenerServicios()
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

  async Cobrar(lavado : any): Promise<void> {
      const modal = await this.mc.create({
        component: TicketComponent,
        componentProps : {
          lavado : lavado
        },
        backdropDismiss: false
      });
      return await modal.present();
  
  }

  async Eliminar(lavado : any): Promise<void> {

  }

  async obtenerServicios(): Promise<void> {
    (await this.LavadoService.Servicios(false)).subscribe(
      async (response: any) => {
        if (response && response.Servicios) {
          this.vehiculos = response.Servicios;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

}
