import { Component, Input, OnInit } from '@angular/core';
import { RecetasService } from 'src/app/services/Recetas/recetas.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponentReceta implements OnInit {

  constructor(private RecetasService: RecetasService) { }

  ngOnInit() {
    this.ObtenerRecetas()
    console.log(this.receta)

  }

  async ObtenerRecetas(): Promise<void> {

    try {
      const response: any = await (await this.RecetasService.Recetas(0, 0, 0, this.receta.id)).toPromise();

      if (response && response.receta) {
        this.receta = response.receta;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  @Input() receta: any = []


}
