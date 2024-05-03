import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriaServiceService } from '../../../../services//Categorias/categoria-service.service'

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {

  @Input() titulo: string = "";
  @Input() id: number = 0;

  categoria: string;

  constructor(private CategoriasService: CategoriaServiceService, private modalController: ModalController) {
    this.categoria = "";
  }

  ngOnInit() {
    if (this.titulo != "Nueva") {
      this.CategoriasService.buscarCategoria(this.id).subscribe(response => {
        console.log("Propiedad categoria.categoria:", response.categoria.categoria);
        this.categoria = response.categoria.categoria
      });
    }

  }

  dismissModal(): void {
    this.modalController.dismiss();
  }

  confirm(id: number): void {
    if (this.titulo === "Actualizar") {
      this.CategoriasService.ActulizarCategoria(id, this.categoria).subscribe(
        (response: any) => {
          console.log(response);
          this.dismissModal();
          window.dispatchEvent(new Event('categoriasActualizadas'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.CategoriasService.CrearCategoria(this.categoria, id).subscribe(
        (response: any) => {
          console.log(response);
          this.dismissModal();
          window.dispatchEvent(new Event('categoriasActualizadas'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }


}
