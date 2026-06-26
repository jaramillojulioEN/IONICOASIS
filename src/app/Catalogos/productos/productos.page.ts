import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { ModalController } from '@ionic/angular';
import { ProductosComponent } from 'src/app/Components/Modals/PorductosModal/productos/productos.component';
import { AlertController } from '@ionic/angular';
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any = [];
  loaded: boolean = false;

  pagina = {
    PaginaActual: 1,
    TotalPorPagina: 10,
    TotalPages: 1,
    TotalItems: 0,
    PaginationEnabled: true
  };

  paginaAnterior() {
    this.pagina.PaginaActual = this.pagina.PaginaActual - 1;
    this.ObtenerProducutos();
  }

  paginaSiguiente() {
    this.pagina.PaginaActual = this.pagina.PaginaActual + 1;
    this.ObtenerProducutos();
  }

  constructor(
    private AlertController: AlertController,
    private ProductoService: ProductoServiceService,
    private ModalController: ModalController,
    private ac: AlertServiceService
  ) { }

  ngOnInit() {
    this.ObtenerProducutos()
    window.addEventListener('success', () => {
      this.pagina.PaginaActual = 1;
      this.ObtenerProducutos();
    })
  }
  async AbrirModalProducto(id: number, titulo: string) {
    const modal = await this.ModalController.create({
      component: ProductosComponent,
      componentProps: {
        id: id,
        titulo: titulo
      },
    });
    return await modal.present();
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.EliminarProducto(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModalProducto(data.id, "Actualizar"); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async ObtenerProducutos(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.ProductoService.Productos(this.pagina)).toPromise();
      if (response && response.productos) {
        this.productos = response.productos;
        this.pagina = response.Paginador;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  async EliminarProducto(producto: any): Promise<void> {
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de eilimina el producto: " + producto.nombre, () => this.ConfirmarEliminar(producto.id))
  }

  async ConfirmarEliminar(id: number): Promise<void> {

    (await this.ProductoService.EliminarProductos(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerProducutos(false);
          this.ac.presentCustomAlert("Exito", response.message)
        } else {
          this.ac.presentCustomAlert("Error", "No se pudo eliminar el producto.");
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
        this.ac.presentCustomAlert("Error", "No se pudo eliminar el producto. Verifica tu conexión.");
      }
    );
  }


}
