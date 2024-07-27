import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/Guards/role.guard';  // Ajusta la ruta según sea necesario

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
    path: 'inicio',
    loadChildren: () => import('./Catalogos/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'categorias',
    loadChildren: () => import('./Catalogos/categorias/categorias.module').then( m => m.CategoriasPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'productos',
    loadChildren: () => import('./Catalogos/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'recetas',
    loadChildren: () => import('./Catalogos/recetas/recetas.module').then( m => m.RecetasPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador', "Cocinero"] }
  },
  {
    path: 'platillos',
    loadChildren: () => import('./Catalogos/platillos/platillos.module').then( m => m.PlatillosPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'bebidas',
    loadChildren: () => import('./Catalogos/bebidas/bebidas.module').then( m => m.BebidasPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'mesas',
    loadChildren: () => import('./Catalogos/mesas/mesas.module').then( m => m.MesasPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'empleados',
    loadChildren: () => import('./Pages/empleados/empleados.module').then( m => m.EmpleadosPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador', 'Cajero'] }
    
  },
  {
    path: 'admin',
    loadChildren: () => import('./Pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Administrador'] }
  },
  {
    path: 'mesero',
    loadChildren: () => import('./Pages/mesero/mesero.module').then( m => m.MeseroPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Mesero'] }
  },
  {
    path: 'cocina',
    loadChildren: () => import('./Pages/cocina/cocina.module').then( m => m.CocinaPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Cocinero'] }
  },
  {
    path: 'caja',
    loadChildren: () => import('./Pages/caja/caja.module').then( m => m.CajaPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Cajero', "Administrador"] }
  },
  {
    path: 'lavado',
    loadChildren: () => import('./Pages/caja/lavado/lavado.module').then( m => m.LavadoPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Cajero', "Administrador"] }
  },
  {
    path: 'corte',
    loadChildren: () => import('./Pages/caja/corte/corte.module').then( m => m.CortePageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Cajero', "Administrador"] }
  },
  {
    path: 'cierre',
    loadChildren: () => import('./Pages/caja/cierre/cierre.module').then( m => m.CierrePageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['Cajero', "Administrador"] }
  },
  {
    path: 'servicios',
    loadChildren: () => import('./Catalogos/servicios/servicios.module').then( m => m.ServiciosPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ["Administrador"] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Pages/admin/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ["Administrador"] }
  },
  {
    path: 'inventario',
    loadChildren: () => import('./Pages/inventario/inventario.module').then( m => m.InventarioPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ["Administrador"] }
  },
  {
    path: 'pasado',
    loadChildren: () => import('./Pages/pasado/pasado.module').then( m => m.PasadoPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ["Cocinero"] }
  },
  {
    path: 'adminordenes',
    loadChildren: () => import('./Pages/adminordenes/adminordenes.module').then( m => m.AdminordenesPageModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ["Administrador"] }
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
