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



  ObtenerCategorias(): void {
    
    this.CategoriasService.Categorias().subscribe(
      (response: any) => {
        if (response && response.categorias) {
          this.categorias = response.categorias;
          console.log(this.categorias)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
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
    await this.loaderFunctions.StartLoader();
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

    }finally{
      this.loaderFunctions.StopLoader();
    }
  }
}
