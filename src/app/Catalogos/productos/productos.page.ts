import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { ModalController } from '@ionic/angular';
import { ProductosComponent } from 'src/app/Components/Modals/PorductosModal/productos/productos.component';
import { AlertController } from '@ionic/angular';
import {AlertServiceService} from '../../services/Alerts/alert-service.service' 
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos : any = [];
  constructor(
    private AlertController : AlertController,
    private ProductoService : ProductoServiceService,
    private ModalController: ModalController,
    private ac : AlertServiceService
  ) { }

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

  async ObtenerProducutos(load : boolean = true): Promise<void> {
    (await this.ProductoService.Productos(load)).subscribe(
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

  async EliminarProducto(producto: any): Promise<void> {
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de eilimina el producto: "+ producto.nombre, ()=> this.ConfirmarEliminar(producto.id))
  }

  async ConfirmarEliminar(id : number) : Promise<void> {
    (await this.ProductoService.EliminarProductos(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerProducutos(false);
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
