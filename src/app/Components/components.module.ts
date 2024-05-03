import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CategoriasComponent } from './Modals/CategoriasModal/categorias/categorias.component';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations:
  [
    CardComponent,
    CategoriasComponent
  ],
  exports: [
    CardComponent,
    CategoriasComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],

})
export class ComponentsModule { }
