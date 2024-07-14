import { Component, Input, OnInit } from '@angular/core';
import { RecetasService } from '../../../../services/Recetas/recetas.service'
import { CategoriaServiceService } from '../../../../services/Categorias/categoria-service.service'
import { PlatilloService } from '../../../../services/Platillos/platillo.service'
import { AlertController, ModalController } from '@ionic/angular';
import {AlertServiceService} from 'src/app/services/Alerts/alert-service.service'
@Component({
  selector: 'app-platillo-nuevo',
  templateUrl: './platillo-nuevo.component.html',
  styleUrls: ['./platillo-nuevo.component.scss'],
})
export class PlatilloNuevoComponent implements OnInit {


  categorias: any = [];
  recetas: any = [];

  @Input() id: number = 0;
  @Input() titulo: string = "";
  @Input() data: any = null;
  @Input() isbebida: boolean = false;

  platillos = {
    id: this.id,
    nombre: '',
    idcategoria: 0,
    idreceta: 0,
    precio: '',
    precioempleado: ''
  };
  loaded: boolean = false;

  constructor(
    private modalController: ModalController,
    private PlatilloService: PlatilloService,
    private alertController: AlertController,
    private recetaservice: RecetasService,
    private ac : AlertServiceService,
    private categoservice: CategoriaServiceService,
  ) { }

  ngOnInit() {
    this.ObtenerRecetas()
    this.ObtenerCategorias()
    if (this.data != null) {
      this.platillos.id = this.data.id

      this.platillos.nombre = this.data.nombre
      this.platillos.precio = this.data.precio
      this.platillos.precioempleado = this.data.precioempleado
      setTimeout(() => {
        this.platillos.idreceta = this.data.idreceta
        this.platillos.idcategoria = this.data.idcategoria
      }, 0);
    }
  }

  async confirmar(): Promise<void> {
    console.log(this.platillos)
    const { valido, mensaje } = this.validarPlatillo(this.platillos);
    if (valido) {
      if (this.id == 0) {
        (await this.PlatilloService.CrearPlatillo(this.platillos)).subscribe(
          (response: any) => {
            this.modalController.dismiss()
            window.dispatchEvent(new Event('success'));
            this.ac.presentCustomAlert("Exito", response.message)
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        (await this.PlatilloService.ActulizarPlatillo(this.platillos)).subscribe(
          (response: any) => {
            this.ac.presentCustomAlert("Exito", response.message)
            window.dispatchEvent(new Event('success'));
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      }
    } else {
      this.ac.presentCustomAlert("Error", mensaje)
    }
  }


  async ObtenerRecetas(): Promise<void> {
    this.loaded = false; 
  
    try {
      const response: any = await (await this.recetaservice.Recetas(true)).toPromise();
  
      if (response && response.recetas) {
        this.recetas = response.recetas;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true; 
    }
  }
  
  ObtenerCategorias(): void {
    this.loaded = false;
  
    this.categoservice.Categorias().subscribe(
      (response: any) => {
        if (response && response.categorias) {
          this.categorias = response.categorias;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      },
      () => {
        this.loaded = true;
      }
    );
  }
  

  validarPlatillo(platillo: any): { valido: boolean, mensaje: string } {
    if (!platillo.nombre || platillo.nombre.trim().length === 0) {
      return { valido: false, mensaje: 'El campo nombre no puede estar vacío' };
    }
    if (!platillo.idcategoria || platillo.idcategoria.length === 0) {
      return { valido: false, mensaje: 'El campo categoría no puede estar vacío' };
    }
    if (!platillo.idreceta || platillo.idreceta.length === 0) {
      return { valido: false, mensaje: 'El campo receta no puede estar vacío' };
    }
    if (!platillo.precio || platillo.precio.length === 0) {
      return { valido: false, mensaje: 'El campo precio no puede estar vacío' };
    }
    if (!platillo.precioempleado || platillo.precioempleado.length === 0) {
      return { valido: false, mensaje: 'El campo precio empleado no puede estar vacío' };
    }

    if (isNaN(Number(platillo.precio))) {
      return { valido: false, mensaje: 'El campo precio debe ser un número válido' };
    }
    if (isNaN(Number(platillo.precioempleado))) {
      return { valido: false, mensaje: 'El campo precio empleado debe ser un número válido' };
    }

    return { valido: true, mensaje: 'Todos los campos son válidos' };
  }

}
