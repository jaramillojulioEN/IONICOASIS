import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { ModalController } from '@ionic/angular';
import { ProductosComponent } from 'src/app/Components/Modals/PorductosModal/productos/productos.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos : any = [];
  constructor(private AlertController : AlertController, private ProductoService : ProductoServiceService, private ModalController: ModalController) { }

  ngOnInit() {
    this.ObtenerProducutos()
    window.addEventListener('success', () => {
      this.ObtenerProducutos();
    })
  }
  async AbrirModalProducto(id:number, titulo:string) {
    const modal = await this.ModalController.create({
      component: ProductosComponent,
      componentProps: {
        id: id,
        titulo : titulo
      },
    });
    return await modal.present();
  }

  async ObtenerProducutos(): Promise<void> {
    (await this.ProductoService.Productos()).subscribe(
      async (response: any) => {
        if (response && response.productos) {
          this.productos = response.productos;
          console.log(this.productos)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async EliminarProducto(id: number): Promise<void> {
    const alert = await this.AlertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            (await this.ProductoService.EliminarProductos(id)).subscribe(
              async (response: any) => {
                if (response) {
                  console.log(response);
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
      ]
    });
  
    await alert.present();
  }


}
