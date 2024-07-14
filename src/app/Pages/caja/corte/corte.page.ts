import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RetirarComponent } from 'src/app/Components/Modals/retirar/retirar.component';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component'
import { UserServiceService } from 'src/app/services/Users/user-service.service';
@Component({
  selector: 'app-corte',
  templateUrl: './corte.page.html',
  styleUrls: ['./corte.page.scss'],
})
export class CortePage implements OnInit {

  constructor(
    private cortesService: CortesService,
    private userservice: UserServiceService,
    private md: ModalController,
    private funcions: LoaderFunctions,
    private PopoverController: PopoverController
  ) { }

  segmento: string = "curso"
  loaded : boolean = false
  cortescurso: any = []
  rol: any;
  ngOnInit() {
    this.rol = this.userservice.getRol()
    this.obtenerCortesActivos();
    this.obtenerCortesActivos(false, false)
    window.addEventListener('success', () => {
      this.obtenerCortesActivos();
      this.obtenerCortesActivos(false, false)
    })
  }

  //filtrado fecha y paginador

  registrosPorPagina: number = 5;
  currentPage: number = 1;
  totalRegistros: number = 0;
  totalPages: number = 0;
  filterdate: string = this.funcions.obtenerFechaHoraActual();
  filtered: boolean = false;
  retiroshistorial: any = []
  retiroshistorialnofiltrado: any = []
  retiroshistorialfiltrado: any = []
  ///

  async openFilter(event: Event): Promise<void> {
    const popover = await this.PopoverController.create({
      component: DatepickerComponent,
      componentProps: {
        filterdate: this.filterdate,
      },
      event: event,
      size: 'auto',
      translucent: true,
      animated: true,
      showBackdrop: true,
      backdropDismiss: true
    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== undefined) {
        this.filterdate = dataReturned.data
        if (this.filterdate != undefined && this.filterdate != null) {
          this.retiroshistorial = this.funcions.filterbydate(this.retiroshistorialnofiltrado, this.filterdate)
          this.cargarLavadosHistorialPagina();
          this.filtered = true
        }
      }
    });
    await popover.present();

  }

  deletefilter() {
    this.filtered = false
    this.obtenerCortesActivos(false, false)
  }

  cargarLavadosHistorialPagina() {
    this.totalRegistros = this.retiroshistorial.length
    this.totalPages = Math.ceil(this.totalRegistros / this.registrosPorPagina)
    const startIndex = (this.currentPage - 1) * this.registrosPorPagina;
    const endIndex = startIndex + this.registrosPorPagina;
    this.retiroshistorialfiltrado = this.retiroshistorial.slice(startIndex, endIndex);
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarLavadosHistorialPagina();
    }
  }

  paginaSiguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarLavadosHistorialPagina();
    }
  }


  async AbrirModalRetiro() {
    const modal = await this.md.create({
      component: RetirarComponent,
    });
    return await modal.present();
  }


  async obtenerCortesActivos(load: boolean = true, activos: boolean = true): Promise<void> {
    this.loaded = false;
  
    try {
      const response: any = await (await this.cortesService.RetirosActivos(load, activos)).toPromise();
  
      if (response && response.Cortes) {
        if (activos) {
          this.cortescurso = response.Cortes;
        } else {
          this.retiroshistorial = response.Cortes;
          this.retiroshistorialnofiltrado = response.Cortes;
  
          if (this.rol.id !== 1) {
            this.retiroshistorial = this.funcions.filterbydate(this.retiroshistorialnofiltrado, this.filterdate);
          }
  
          this.cargarLavadosHistorialPagina();
          console.log(this.retiroshistorial);
        }
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }
  

  async Opciones(data: any) {

  }
}
