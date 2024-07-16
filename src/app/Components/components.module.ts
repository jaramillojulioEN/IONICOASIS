import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CategoriasComponent } from './Modals/CategoriasModal/categorias/categorias.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsComponent } from 'src/app/Components/Extras/charts/charts.component'
import { ConsumoComponent } from 'src/app/Components/Modals/consumo/consumo.component'
import { IonicModule } from '@ionic/angular';
import { ProductosComponent } from './Modals/PorductosModal/productos/productos.component';
import { LoaderComponent } from './Modals/LoadingModal/loader/loader.component';
import { RecetasComponent } from './Modals/RecetasModals/recetas/recetas.component';
import { PlatilloNuevoComponent } from './Modals/Platillos/platillo-nuevo/platillo-nuevo.component';
import { SideMenuComponent } from './Menus/SideMenu/side-menu/side-menu.component';
import { MainHeaderComponent } from './Headers/Header/main-header/main-header.component';
import { BebidaComponent } from 'src/app/Components/Modals/BebidasModal/bebida/bebida.component'
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { EmpleadosComponent } from 'src/app/Components/Modals/Empleados/empleados/empleados.component'
import { PropiedadesComponent } from 'src/app/Components/Secciones/Empleado/propiedades/propiedades.component'
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component'
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component'
import { OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { ServiciosComponent } from 'src/app/Components/Modals/servicios/servicios.component'
import { SelectComponent } from './select/select.component';
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { NgxPrintModule } from 'ngx-print';
import { InicioComponent } from './Modals/inicio/inicio.component'
import { RetirarComponent } from './Modals/retirar/retirar.component'
import { ExistenciasComponent } from './Modals/existencias/existencias.component'
import { TicketcajaComponent } from './ticketcaja/ticketcaja.component'
import { SkeletonComponent } from './skeleton/skeleton.component'
import { EditLavComponent } from './Modals/edit-lav/edit-lav.component'
@NgModule({
  declarations:
    [
      CardComponent,
      EmpleadosComponent,
      TicketcajaComponent,
      InicioComponent,
      EditLavComponent,
      RetirarComponent,
      DetalleComponentReceta,
      SkeletonComponent,
      ExistenciasComponent,
      TicketComponent,
      DetalleordenComponent,
      SelectComponent,
      ConsumoComponent,
      ChartsComponent,
      DatepickerComponent,
      ServiciosComponent,
      TicketComponent,
      OrdnComponent,
      CategoriasComponent,
      ProductosComponent,
      MesasComponent,
      LoaderComponent,
      RecetasComponent,
      EmpleadosComponent,
      PropiedadesComponent,
      SideMenuComponent,
      PlatilloNuevoComponent,
      MainHeaderComponent,
      BebidaComponent
    ],
  exports: [
    CardComponent,
    DetalleComponentReceta,
    MainHeaderComponent,
    ConsumoComponent,
    EditLavComponent,
    SkeletonComponent,
    InicioComponent,
    TicketcajaComponent,
    ExistenciasComponent,
    ServiciosComponent,
    ChartsComponent,
    SelectComponent,
    DatepickerComponent,
    TicketComponent,
    MesasComponent,
    TicketComponent,
    RetirarComponent,
    EmpleadosComponent,
    PropiedadesComponent,
    DetalleordenComponent,
    CategoriasComponent,
    OrdnComponent,
    ProductosComponent,
    LoaderComponent,
    RecetasComponent,
    SideMenuComponent,
    PlatilloNuevoComponent,
    BebidaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    NgxPrintModule
  ],

})
export class ComponentsModule { }
