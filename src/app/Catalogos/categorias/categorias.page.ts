import { Component, OnInit } from '@angular/core';
import { CategoriaServiceService } from '../../services/Categorias/categoria-service.service'
import { ModalController } from '@ionic/angular';
import { CategoriasComponent } from '../../Components/Modals/CategoriasModal/categorias/categorias.component';
import { ProductosComponent } from '../../Components/Modals/PorductosModal/productos/productos.component'
import { LoaderFunctions } from 'src/functions/utils';
import { AlertServiceService } from '../../services/Alerts/alert-service.service'


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  subcategorias: any;
  categorias: any;
  loaded: boolean = false;
  constructor(
    private CategoriasService: CategoriaServiceService,
    private ModalController: ModalController, 
    private loaderFunctions: LoaderFunctions,
    private ac : AlertServiceService
  ) { }

  ngOnInit() {
    this.ObtenerSubCategorias();
    this.ObtenerCategorias();

    window.addEventListener('categoriasActualizadas', () => {
      this.ObtenerCategorias();
    })
  }

  async AbrirModalProducto(id:number, titulo:string) {
    const modal = await this.ModalController.create({
      component: ProductosComponent,
      componentProps: {
        idcategoria: id,
        titulo : titulo
      },
    });

    return await modal.present();
  }

  async AbrirModal(id: number, titulo: string) {
    const modal = await this.ModalController.create({
      component: CategoriasComponent,
      componentProps: {
        titulo: titulo,
        id: id,
      },
    });

    return await modal.present();
  }



  async ObtenerCategorias(): Promise<void> {
    this.loaded = false;
    try {
      await new Promise<void>((resolve, reject) => {
        this.CategoriasService.Categorias().subscribe(
          (response: any) => {
            if (response && response.categorias) {
              this.categorias = response.categorias;
              console.log(this.categorias);
              resolve();
            } else {
              console.error('Error: Respuesta inválida');
              reject('Respuesta inválida');
            }
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }
  

  filterCategoriesBySubcategory(categorias: any[] | undefined, subcategoryId: number): any[] {
    return categorias?.filter(categoria => categoria?.idsubcategoria === subcategoryId) || [];
  }

  eliminarCategoria(categoria: any) {
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de elimimnar la categoria: " + categoria.categoria, ()=>this.confirmarEliminar(categoria.id))
  }

  async confirmarEliminar (id : number) : Promise<void>{
    (await this.CategoriasService.EliminarCatego(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerCategorias();
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

  async ObtenerSubCategorias(): Promise<void> {
    try{
      this.CategoriasService.SubCategorias().subscribe(
        (response: any) => {
          if (response && response.subcategorias) {
            this.subcategorias = response.subcategorias;
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }catch(error){

    }
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.eliminarCategoria(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModal(data.id, "Actualizar"); } },
      { button: this.ac.btnAgregarP, handler: () => { this.AbrirModalProducto(data.id, "Nuevo"); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }
}
