import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'admin-dash-board',
    loadChildren: () => import('./admin-dash-board/admin-dash-board.module').then( m => m.AdminDashBoardPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./Catalogos/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./Catalogos/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./Catalogos/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'recetas',
    loadChildren: () => import('./Catalogos/recetas/recetas.module').then( m => m.RecetasPageModule)
  },
  {
    path: 'platillos',
    loadChildren: () => import('./Catalogos/platillos/platillos.module').then( m => m.PlatillosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
