import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-lavado',
  templateUrl: './select-lavado.component.html',
  styleUrls: ['./select-lavado.component.scss'],
})
export class SelectLavadoComponent {
  @Input() servicios: any[] = [];  // Servicios que el padre le pasa
  @Output() serviciosSeleccionados = new EventEmitter<any[]>();
  query: string = '';
  
  // Lista de servicios seleccionados
  serviciosSeleccionadosInternos: any[] = [];
  serviciosFiltrados: any[] = [];

  constructor(protected modalCtrl: ModalController) {}

  ngOnInit() {
    this.serviciosFiltrados = this.servicios;
    console.log(this.serviciosFiltrados);
  }

  // Cerrar el modal y emitir solo los objetos con las propiedades que necesitas
  cerrarModal() {
    const serviciosSimplificados = this.serviciosSeleccionadosInternos.map(servicio => ({
      id_servicio: servicio.id_servicio,
      id_tipo_vehiculo: servicio.id_tipo_vehiculo
    }));
    this.serviciosSeleccionados.emit(serviciosSimplificados);
    this.modalCtrl.dismiss({
      serviciosSeleccionados: serviciosSimplificados
    });
  }

  // Filtrar los servicios basado en la búsqueda
  buscarServicios(event: any) {
    const query = this.query;
    this.serviciosFiltrados = this.servicios.filter(servicio =>
      servicio.Servicios.nombre_servicio.toLowerCase().includes(query)
    );
  }

  // Seleccionar o deseleccionar un servicio
  seleccionarServicio(servicio: any) {
    const index = this.serviciosSeleccionadosInternos.findIndex(s => s.id_servicio === servicio.id_servicio);
    let nuevo = { id_servicio: servicio.id_servicio, id_tipo_vehiculo: servicio.id_tipo_vehiculo };
    
    if (index === -1) {
      // Si el servicio no está seleccionado, lo agregamos
      this.serviciosSeleccionadosInternos.push(nuevo);
    } else {
      // Si ya está seleccionado, lo quitamos
      this.serviciosSeleccionadosInternos.splice(index, 1);
    }

    // Emitimos los servicios seleccionados con las propiedades limitadas
    const serviciosSimplificados = this.serviciosSeleccionadosInternos.map(servicio => ({
      id_servicio: servicio.id_servicio,
      id_tipo_vehiculo: servicio.id_tipo_vehiculo
    }));
    this.serviciosSeleccionados.emit(serviciosSimplificados);
  }

  // Verificar si un servicio está seleccionado
  isServicioSeleccionado(servicio: any): boolean {
    return this.serviciosSeleccionadosInternos.some(s => s.id_servicio === servicio.id_servicio);
  }
}
