import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/Components/Modals/LoadingModal/loader/loader.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';
import { RecetasService } from 'src/app/services/Recetas/recetas.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';

@Injectable({
    providedIn: 'root'
})
export class Calls {

    constructor(private modalController: ModalController,
        private ld: LoadingController,
        private RecetasService: RecetasService,
        private OrdenesService : OrdenesService,
        private userservice : UserServiceService
    ) { }

    async ObtenerRecetasSimple(id: number): Promise<any> {
        try {
            const response: any = await (await this.RecetasService.Recetasimple(id)).toPromise();
            if (response && response.receta) {
                return response.receta;
            } else {
                console.error('Error: Respuesta inválida');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }

    getsucus(): Promise<any[]> {
      return new Promise((resolve, reject) => {
        this.userservice.Sucursales().subscribe(
          (response: any) => {
            if (response && response.sucursales) {
              console.log(response.sucursales);
              resolve(response.sucursales);
            } else {
              console.error('Error: Respuesta inválida');
              reject('Respuesta inválida');
            }
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
            reject(error);
          },
          () => {
            console.log("just loaded");
          }
        );
      });
    }
    

    async buscarOrden(orden:any): Promise<void> {
        (await this.OrdenesService.BuscarOrden(false, orden.id)).subscribe(
          async (response: any) => {
            if (response && response.orden) {
              return response.orden
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