import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RetirarComponent } from 'src/app/Components/Modals/retirar/retirar.component';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-corte',
  templateUrl: './corte.page.html',
  styleUrls: ['./corte.page.scss'],
})
export class CortePage implements OnInit {

  constructor(
    private cortesService: CortesService,
    private md: ModalController,
    private funcions : LoaderFunctions
  ) { }

  segmento: string = "curso"

  cortescurso: any = []

  ngOnInit() {
    this.obtenerCortesActivos();
  }

  async AbrirModalRetiro() {
    const modal = await this.md.create({
      component: RetirarComponent,
    });
    return await modal.present();
  }


  async obtenerCortesActivos(load: boolean = true): Promise<void> {
    try {
      (await this.cortesService.RetirosActivos(load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            this.cortescurso = response.Cortes;
            console.log(this.cortescurso)
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  async Opciones(data: any) {

  }
}
