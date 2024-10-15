import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { LoaderFunctions } from 'src/functions/utils';
import { SelectComponent } from '../../select/select.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { EmpleadosService } from 'src/app/services/Empleados/empleados.service';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.scss'],
})
export class ConsumoComponent implements OnInit {
  isprep: any;
  nombrebebida: any = "Seleccionar Benida";
  nombreplatillo: any = "Seleccionar Platillo";
  mensaje: string = "";

  constructor(
    private fn: LoaderFunctions,
    private pop : PopoverController,
    private ac : AlertServiceService,
    private consumos : EmpleadosService,
    private md : ModalController
  ) { }
  @Input() data: any = []

  consumo: any = {
    id: 0,
    idbebida: undefined,
    idplatillo: undefined,
    concepto: "",
    fecha: this.fn.obtenerFechaHoraActual(),
    cantidad: 1,
    idempleado: this.data.id
  }
  segmento : string = "prestamo"
  ngOnInit() {
    this.consumo.idempleado = this.data.id
  }
  confirmar(): void {
    if(this.validar()){
      this.crear()
    }
    else{
      this.ac.presentCustomAlert("Error", this.mensaje)
    }
    console.log(this.consumo)
  }

  limpiar () : void{
    this.consumo = {
      id: 0,
      idbebida: undefined,
      idplatillo: undefined,
      concepto: "",
      fecha: this.fn.obtenerFechaHoraActual(),
      cantidad: 1,
      idempleado : this.data.id
    }
    this.nombrebebida = "Seleccionar Bebida";
    this.nombreplatillo = "Seleccionar Platillo";
  }


  async Select(isPlatillo: boolean, event: Event) {
    const modal = await this.pop.create({
      component: SelectComponent,
      backdropDismiss: true,
      componentProps: {
        isPlatillo: isPlatillo,
        preciocliente : false
      },
      translucent: true,
      event: event,
      arrow: true,
      side: 'top',
      size: "cover",
      mode: 'ios'
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        if (isPlatillo) {
          this.nombreplatillo = dataReturned.data.nombre

          this.consumo.idplatillo = dataReturned.data.id
          dataReturned.data.nombre
        } else {
          this.nombrebebida = dataReturned.data.nombre
          if (dataReturned.data.isprep) {
            this.isprep = dataReturned.data.isprep;
            this.consumo.idplatillo = dataReturned.data.id
          } else {
            this.consumo.idbebida = dataReturned.data.id

          }
        }
      }

    });
    return await modal.present();
  }

  async crear (){
    (await this.consumos.CrearConsumo(this.consumo)).subscribe(
      (response: any) => {
        window.dispatchEvent(new Event('success'));
        this.md.dismiss();
        this.ac.presentCustomAlert("Termino", response.message)
        this.limpiar()
      },
      (error: any) => {
        this.ac.presentCustomAlert('Error en la solicitud:', error.message);
        console.error('Error en la solicitud:', error);
      }
    );
  }

  validar () : boolean{
    let valido = true

    if(this.consumo.cantidad ==0 || this.consumo.cantidad ==null){
      valido = false
      this.mensaje = "la cantidad 0 no es valida"
      this.limpiar()
      return valido
    }
    if(this.consumo.idbebida === 0 && this.consumo.idplatillo === 0 && this.consumo.concepto === "" ){
      valido = false
      this.mensaje = "Debe agregar un consumo"
      return valido
    }
    return valido;
  }


}
