import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecetasComponent } from 'src/app/Components/Modals/RecetasModals/recetas/recetas.component';
import { RecetasService } from '../../services/Recetas/recetas.service'
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {
  recetas: any;

  constructor(
    private modalController: ModalController, 
    private RecetasService: RecetasService,
    private ac : AlertServiceService
  ) { }

  ngOnInit() {
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
    (await this.RecetasService.Recetas()).subscribe(
      async (response: any) => {
        if (response && response.recetas) {
          this.recetas = response.recetas;
          console.log(this.recetas)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.eliminarReceta(data) },
      { button: this.ac.btnVer, handler: () => this.verRecetaCompleta(data) },
      { button: this.ac.btnActualizar, handler: () => { this.editarReceta(data.id); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async AbrirModalRecetas(id: number, titulo: string) {
    const modal = await this.modalController.create({
      component: RecetasComponent,
      componentProps: {
        id: id,
        titulo: titulo
      },
    });
    return await modal.present();
  }

  editarReceta(receta: any) { }

  eliminarReceta(receta: any) { }
}
