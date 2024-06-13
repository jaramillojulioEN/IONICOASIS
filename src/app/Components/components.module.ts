import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CategoriasComponent } from './Modals/CategoriasModal/categorias/categorias.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
@NgModule({
  declarations:
    [
      CardComponent,
      DetalleComponentReceta,
      DetalleordenComponent,
      ConsumoComponent,
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
    ServiciosComponent,
    DatepickerComponent,
    TicketComponent,
    MesasComponent,
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
    RouterModule
  ],

})
export class ComponentsModule { }
