import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriaServiceService } from 'src/app/services/Categorias/categoria-service.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})

export class ProductosComponent implements OnInit {
  nombre: string;
  cantidad: number;
  categoria: number;


  categorias?: any[];

  constructor(private modalController: ModalController, private CategoriasService: CategoriaServiceService, private ProductosService: ProductoServiceService) {
    this.nombre = "";
    this.cantidad = 0;
    this.categoria = 0;
  }

  @Input() idcategoria: number = 0;
  @Input() titulo: string = "";
  @Input() id: number = 0;


  async ngOnInit() {
    this.ObtenerCategorias()
    if(this.id !=0){
      (await this.ProductosService.buscarProducto(this.id)).subscribe(response => {
        console.log(response.producto);
        this.categoria = response.producto.idcategoria
        this.nombre = response.producto.nombre
        this.cantidad = response.producto.cantidad
      });
    }
  }

  dismissModal(): void {
    this.modalController.dismiss();
  }
  

  ObtenerCategorias(): void {
    this.CategoriasService.Categorias().subscribe(
      (response: any) => {
        if (response && response.categorias) {
          this.categorias = response.categorias;
          this.categoria = this.idcategoria
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async guardarProducto(): Promise<void> {

    if (this.id == 0) {
      (await this.ProductosService.CrearProducto(this.cantidad, this.nombre, this.categoria)).subscribe(
        (response: any) => {
          console.log(response);
          window.dispatchEvent(new Event('success'));
          this.dismissModal();
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      const data = {
        cantidad: this.cantidad,
        nombre: this.nombre,
        idcategoria : this.categoria,
        id: this.id
      }
      ;(await this.ProductosService.ActulizarProducto(data)).subscribe(
        (response: any) => {
          console.log(response);
          this.dismissModal();
          window.dispatchEvent(new Event('success'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }

  }
}
