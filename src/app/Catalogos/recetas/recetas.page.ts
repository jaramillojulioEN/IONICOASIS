import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecetasComponent } from 'src/app/Components/Modals/RecetasModals/recetas/recetas.component';
import {RecetasService} from '../../services/Recetas/recetas.service'
@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {
  recetas: any;

  constructor(private modalController: ModalController,  private RecetasService: RecetasService) { }

  ngOnInit() {
    this.ObtenerRecetas();
    window.addEventListener('success', () => {
      this.ObtenerRecetas();
    })
  }

  verRecetaCompleta(id : number){
    
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


}
