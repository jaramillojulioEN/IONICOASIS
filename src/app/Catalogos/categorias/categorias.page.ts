import { Component, OnInit } from '@angular/core';
import { CategoriaServiceService } from '../../services/Categorias/categoria-service.service'
import { ModalController } from '@ionic/angular';
import { CategoriasComponent } from '../../Components/Modals/CategoriasModal/categorias/categorias.component';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  subcategorias: any;
  categorias: any;


  constructor(private CategoriasService: CategoriaServiceService, private ModalController: ModalController) { }

  ngOnInit() {
    this.ObtenerSubCategorias();
    this.ObtenerCategorias();

    window.addEventListener('categoriasActualizadas', () => {
      this.ObtenerCategorias();
    })
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

  eliminarCategoria(categoriaId: number) {
    console.log('Eliminar categoría con ID:', categoriaId);
  }




  ObtenerSubCategorias(): void {
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
  }
}
