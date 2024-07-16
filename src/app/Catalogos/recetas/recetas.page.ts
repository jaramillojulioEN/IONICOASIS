import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecetasComponent } from 'src/app/Components/Modals/RecetasModals/recetas/recetas.component';
import { RecetasService } from '../../services/Recetas/recetas.service'
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {
  recetas: any;
  loaded: boolean = false;

  constructor(
    private modalController: ModalController,
    private RecetasService: RecetasService,
    private ac: AlertServiceService,
    private userservice: UserServiceService
  ) { }
  rol: any
  ngOnInit() {
    this.rol = this.userservice.getRol()
    this.ObtenerRecetas();
    window.addEventListener('success', () => {
      this.ObtenerRecetas();
    })
  }

  async verRecetaCompleta(receta: any): Promise<void> {

    const modal = await this.modalController.create({
      component: DetalleComponentReceta,
      componentProps: {
        receta: receta,
      },
    });
    await modal.present();
  }

  async ObtenerRecetas(): Promise<void> {
    this.loaded = false;

    try {
      const response: any = await (await this.RecetasService.Recetas()).toPromise();
      if (response && response.recetas) {
        this.recetas = response.recetas;
        console.log(this.recetas);
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }



  Opciones(data: any) {
    let buttons = [];
    if (this.rol.id !== 2) {
      buttons.push({ button: this.ac.btnEliminar, handler: () => this.eliminarReceta(data) },)
      buttons.push({ button: this.ac.btnActualizar, handler: () => this.AbrirModalRecetas(data) },)
      buttons.push({ button: this.ac.btnVer, handler: () => this.verRecetaCompleta(data) },)
      buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    } else {
      buttons.push({ button: this.ac.btnVer, handler: () => this.verRecetaCompleta(data) },)
      buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    }
    this.ac.configureAndPresentActionSheet(buttons);
  }

  async AbrirModalRecetas(data : any  = null) {
    const modal = await this.modalController.create({
      component: RecetasComponent,
      componentProps: {
        datareceta: data
      },
    });
    return await modal.present();
  }

  editarReceta(receta: any) { }

  eliminarReceta(receta: any) {
    this.ac.presentCustomAlert("Seguro?", "Estas seguro de querer eliminar la receta", () => this.confirmareliminar(receta))
  }

  async confirmareliminar(receta: any): Promise<void> {
    (await this.RecetasService.EliminarReceta(receta.id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerRecetas();
          this.ac.presentCustomAlert("Exito", response.message)
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
