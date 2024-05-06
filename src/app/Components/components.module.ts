import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CategoriasComponent } from './Modals/CategoriasModal/categorias/categorias.component';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ProductosComponent } from './Modals/PorductosModal/productos/productos.component';
import { LoaderComponent } from './Modals/LoadingModal/loader/loader.component';



@NgModule({
  declarations:
  [
    CardComponent,
    CategoriasComponent,
    ProductosComponent,
    LoaderComponent
  ],
  exports: [
    CardComponent,
    CategoriasComponent,
    ProductosComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],

})
export class ComponentsModule { }
