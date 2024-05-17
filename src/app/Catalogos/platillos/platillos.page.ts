import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlatilloNuevoComponent } from '../../Components/Modals/Platillos/platillo-nuevo/platillo-nuevo.component'
@Component({
  selector: 'app-platillos',
  templateUrl: './platillos.page.html',
  styleUrls: ['./platillos.page.scss'],
})
export class PlatillosPage implements OnInit {

  constructor(private ModalController: ModalController) { }


  PlatilloArry: any = [
    {
      id:1,
      nombre: 'Platillo 1',
      idcategoria: 1,
      idreceta: 101,
      precio: 10.99,
      precioempleado: 8.99
    },
    {
      id:2,
      nombre: 'Platillo 2',
      idcategoria: 2,
      idreceta: 102,
      precio: 12.99,
      precioempleado: 10.99
    },
    {
      id:3,
      nombre: 'Platillo 3',
      idcategoria: 1,
      idreceta: 103,
      precio: 14.99,
      precioempleado: 12.99
    }
  ];

  ngOnInit() {
  }

  async AbrirModalPlatillo() {
    const modal = await this.ModalController.create({
      component: PlatilloNuevoComponent,
      componentProps: {

      },
    });
    return await modal.present();
  }


  EditarPlatillo(id:number) {
    console.log('Editar platillo:', id);
  }

  EliminarPlatillo(id:number) {
    console.log('Eliminar platillo:', id);
  }
}
