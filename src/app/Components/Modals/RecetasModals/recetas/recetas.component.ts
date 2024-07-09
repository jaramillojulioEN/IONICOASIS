import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { RecetasService } from 'src/app/services/Recetas/recetas.service';
import { AlertController } from '@ionic/angular';
import { CategoriaServiceService } from 'src/app/services/Categorias/categoria-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
})
export class RecetasComponent implements OnInit {

  pasos: string;
  prodsArray: any;
  imagesArray: string[] = [];

  imagesSelected: string[] | undefined;

  Imagenes: any;
  productos: any;
  cantidadi: number = 0;

  nombrereceta: string = "";
  dura: number = 0;
  idcategoria: number = 0;

  pasosArray: string[] = [];
  pasoshtml: string = "";
  idlistaingredientes: number = 0;
  idlistaimagenes: number = 0;
  categorias: any = [];
  BebidaArry: any = [];



  constructor(
    public alertController: AlertController,
    private CategoriasService: CategoriaServiceService,
    private BebidaService: BebidaService,
    private RecetasService: RecetasService, private modalController: ModalController, private ProductoService: ProductoServiceService) {
    this.pasos = "";
  }

  @Input() titulo: string = "";
  @Input() id: number = 0;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;
  @Output() imagesSelectedEvent = new EventEmitter<string[]>();

  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async guardar(): Promise<void> {
    const resultadoValidacion = this.validar();
    let estadoValidacion = resultadoValidacion.estado;
    let mensajeValidacion = resultadoValidacion.mensaje;
    if (estadoValidacion) {
      try {
        const data = {
          pasoshtml: this.pasoshtml,
          idlistaimagenes: this.idlistaimagenes,
          idlistaingredientes: this.idlistaingredientes,
          tiempopreparacion: this.dura,
          idcategoria: this.idcategoria
        };
        const respuesta = await (await this.RecetasService.CrearReceta(data)).toPromise();
        if (respuesta) {
          this.modalController.dismiss()
          window.dispatchEvent(new Event('success'));
        }
      } catch (error) {
        console.error('Error al crear la receta:', error);
      }
    } else {
      this.presentAlert("Error", mensajeValidacion)
    }
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


  validar(): { estado: boolean, mensaje: string } {
    let mensaje = "";
    let estado = true; // Supongo que el estado inicial es verdadero, ya que no se debe bloquear el proceso si no hay errores

    if (this.nombrereceta.trim() === "") {
      mensaje = "Debe proporcionar un nombre para la receta";
      estado = false;
    } else if (this.dura === 0) {
      mensaje = "La duración debe ser superior a 0";
      estado = false;
    }
    else if (this.idlistaimagenes === 0) {
      mensaje = "Debe ingresar al menos una imagen";
      estado = false;
    }
    else if (this.idcategoria === 0) {
      mensaje = "Debe ingresar la categoria";
      estado = false;
    }
    else if (this.idlistaingredientes === 0) {
      mensaje = "Debe al menos ingresar un ingrediente";
      estado = false;
    }
    else if (this.pasosArray.length === 0) {
      mensaje = "Debe agregar al menos un paso";
      estado = false;
    } else {
      let count: number = 1;
      this.pasosArray.forEach(element => {
        this.pasoshtml += `<p>${count}. ${element}</p>\n`
        count++;
      });
      mensaje = "La receta está validada correctamente";
    }
    return { estado: estado, mensaje: mensaje };
  }


  ngOnInit() {
    this.ObtenerBebidas();
    this.ObtenerProducutos();
    this.ObtenerCategorias();
  }

  dismissModal(): void {
    this.modalController.dismiss();
  }

  async agregarImagen(): Promise<void> {
    console.log(this.imagesArray);

    for (const element of this.imagesArray) {
      console.log(this.idlistaimagenes);

      if (this.idlistaimagenes === 0) {
        try {
          await this.crearListaImagenes("images");
        } catch (error) {
          console.error('Error al crear la lista de imágenes:', error);
          return;
        }
      }

      this.agregarImagenALista(element);
    }

    this.imagesSelected = [];
    this.imagesArray = [];
  }


  async eliminarImagen(idi: number, idl: number): Promise<void> {
    try {
      await (await this.RecetasService.EliminarImagen(idi, idl)).subscribe(
        (response) => {
          console.log('Imagen eliminado con éxito:', response);
          this.obtenerImagenes()
        },
        (error) => {
          console.error('Error al eliminar la Imagen:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  async ObtenerProducutos(): Promise<void> {
    (await this.ProductoService.Productos(true)).subscribe(
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

  isingredient: boolean = true
  isibebida: boolean = false
  isfree: boolean = false

  settype(type: string) {
    this.isfree = false;
    this.isibebida = false;
    this.isingredient = false;
    switch (type) {
      case "isingredient":
        this.isingredient = true;
        this.bebida = [];
        this.descripcionlibre = ""
        break
      case "isibebida":
        this.isibebida = true;
        this.producto = []
        this.descripcionlibre = ""
        break
      case "isfree":
        this.bebida = [];
        this.producto = []
        this.isfree = true;
        break

    }
  }

  bebida: any = []
  producto: any = [];
  descripcionlibre: string = ""
  data: any = {};

  async agregarIngrediente(): Promise<void> {



    if (this.validaringrediente()) {
      if (this.idlistaingredientes === 0) {
        try {
          if (this.nombrereceta !== "") {
            await this.crearListaIngredientes(this.nombrereceta);
          } else {
            this.presentAlert("Error", "Debe agregar un nombre para la receta")
          }
          this.data = { idproducto: this.producto.id, idlistaingredientes: this.idlistaingredientes, cantidad: this.cantidadi, idbebida: this.bebida.id, ingredientenobd: this.descripcionlibre === "" ? null : this.descripcionlibre }
          this.agregarIngredienteALista(this.data)
        } catch (error) {
          console.error('Error al crear la lista de ingredientes:', error);
        }
      } else {
        this.data = { idproducto: this.producto.id, idlistaingredientes: this.idlistaingredientes, cantidad: this.cantidadi, idbebida: this.bebida.id, ingredientenobd: this.descripcionlibre === "" ? null : this.descripcionlibre }
        this.agregarIngredienteALista(this.data);
      }
    }

    this.producto = [];
    this.bebida = [];
    this.descripcionlibre = "";
    this.cantidadi = 0;

  }


  validaringrediente(): boolean {
    if (!this.producto.id && this.isingredient) {
      this.presentAlert("Error", "Debe agregar un ingrediente")
      return false;

    }
    if (!this.bebida.id && this.isibebida) {
      this.presentAlert("Error", "Debe agregar una bebida")
      return false;

    }
    if (this.descripcionlibre === "" && this.isfree) {
      this.presentAlert("Error", "Debe escribir el nombre del ingrediente")
      return false;

    }
    if (this.cantidadi === 0) {
      this.presentAlert("Error", "Debe agregar la cantidad")
      return false;
    }
    return true
  }

  async ObtenerBebidas(load: boolean = false): Promise<void> {
    (await this.BebidaService.Bebidas(load)).subscribe(
      async (response: any) => {
        if (response && response.bebidas) {
          this.BebidaArry = response.bebidas;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  async agregarIngredienteALista(data: any) {
    try {
      await this.RecetasService.agregarIngredienteALista(data).toPromise();
      this.obtenerIngredientes();
    } catch (error) {
      console.error('Error al agregar el ingrediente:', error);
    }
  }


  async agregarImagenALista(b64: string) {
    try {
      await this.RecetasService.agregarImagenALista(this.idlistaimagenes, b64).toPromise();
      this.obtenerImagenes();
    } catch (error) {
      console.error('Error al agregar el ingrediente:', error);
    }
  }


  obtenerIngredientes(): void {
    this.RecetasService.obtenerItemsListaIngredientes(this.idlistaingredientes).subscribe(
      (data: any) => {
        console.log(data.Ingredientes);
        this.prodsArray = data.Ingredientes
      },
      error => {
        console.error('Error al obtener los ingredientes:', error);
      }
    );
  }

  obtenerImagenes(): void {
    this.RecetasService.obtenerItemsListaImagenes(this.idlistaimagenes).subscribe(
      (data: any) => {
        console.log(data.Imagenes);
        this.Imagenes = data.Imagenes
      },
      error => {
        console.error('Error al obtener los ingredientes:', error);
      }
    );
  }

  crearListaIngredientes(descripcion: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.RecetasService.crearListaIngredientes(descripcion).subscribe(
        (data: any) => {
          console.log('Lista de ingredientes creada con éxito:', data);
          this.idlistaingredientes = data["IdLista"]
          resolve(data);
        },
        error => {
          console.error('Error al crear la lista de ingredientes:', error);
          reject(error);
        }
      );
    });
  }

  crearListaImagenes(descripcion: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.RecetasService.crearListaImagenes(descripcion).subscribe(
        (data: any) => {
          console.log(data["IdLista"]);
          this.idlistaimagenes = data["IdLista"]
          resolve(data);
        },
        error => {
          console.error('Error al crear la lista de imagenes:', error);
          reject(error);
        }
      );
    });
  }

  async eliminaringrediente(idi: number, idl: number) {
    try {
      await (await this.RecetasService.EliminarIngrediente(idi, idl)).subscribe(
        (response) => {
          console.log('Ingrediente eliminado con éxito:', response);
          this.obtenerIngredientes()
        },
        (error) => {
          console.error('Error al eliminar el ingrediente:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesArray.push(e.target.result);
          if (this.imagesArray.length === files.length) {
            this.imagesSelectedEvent.emit(this.imagesArray);
            this.resetFileInput();
            this.agregarImagen()
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  agregaPaso(): void {
    if (this.pasos.trim() !== "") {
      this.pasosArray.push(this.pasos);
      this.pasos = "";
    } else {
      this.presentAlert("Error", "Para agregar un paso, debe escribirlo")
    }
  }


}
