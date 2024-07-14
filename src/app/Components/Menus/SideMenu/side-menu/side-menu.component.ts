import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service'
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  public CatalogosPages: any = [
    { title: 'Productos', url: '/productos', icon: 'wine' },
    { title: 'Platillos', url: '/platillos', icon: 'pizza' },
    { title: 'Recetas', url: '/recetas', icon: 'receipt' },
    { title: 'Categorias', url: '/categorias', icon: 'duplicate' },
    { title: 'Bebidas', url: '/bebidas', icon: 'beer' },
    { title: 'Mesas', url: '/mesas', icon: 'cafe' },
    { title: 'Servicios Lavado', url: '/servicios', icon: 'car-sport' },
  ];

  public ExtraAdminPages: any = [
    { title: 'Caja', url: '/cierre', icon: 'flash', open: false },
    { title: 'Cortes de caja', url: '/corte', icon: 'file-tray-full', open: false },
    { title: 'Ordenes', url: '/caja', icon: 'card', open: false },
    { title: 'Lavado', url: '/lavado', icon: 'car-sport', open: false },
  ];

  public appPages: any = [];
  rol: any = [];
  user: any = [];
  setingsSec: any = [];


  constructor(

    private authservice: UserServiceService,
    private ac : AlertServiceService
  ) { }

  toggleSubmenu(page: any) {
    page.open = !page.open;
  }

  closeAllPages() {
    this.appPages.forEach((page: { open: boolean; }) => {
      page.open = false;
    });
  }

  async navigateTo(url: string) {

  }

  async logOut() {

    this.ac.presentCustomAlert("Estas cerrando session", "¿Estas segurod de cerrar sesión? \nDebéras ingresar nuevamente tus credenciales para accder", ()=>this.ConfirmLogOut())

  }

  async ConfirmLogOut() : Promise<void> {
    if (this.authservice.LogOut()) {
      this.authservice.RedirigirRol(0)
    }
  }

  ngOnInit() {
    this.rol = this.authservice.getRol()
    this.user = this.authservice.getUser()
    if (this.rol.id == 1) {
      this.appPages = [
        { title: 'Inicio', url: '/admin', icon: 'home', open: false },
        { title: 'Inventario', url: '/inventario', icon: 'cash', open: false },
        {
          title: 'Catálogos',
          url: '/incio',
          icon: 'apps-outline',
          subpages: this.CatalogosPages,
          open: false
        },
        {
          title: 'Finanzas',
          url: '/incio',
          icon: 'pie-chart-outline',
          subpages: this.ExtraAdminPages,
          open: false
        },
        { title: 'Empleados', url: '/empleados', icon: 'person', open: false },
        { title: 'Contacto', url: '/contacto', icon: 'call', open: false },
      ]
    } else if (this.rol.id == 2) {
      this.appPages = [
        { title: 'Mesas', url: '/mesero', icon: 'cafe', open: false },
      ]
    }
    else if (this.rol.id == 4) {
      this.appPages = [
        { title: 'Ordenes pendientes', url: '/cocina', icon: 'receipt', open: false },
        { title: 'Recetas', url: '/recetas', icon: 'receipt' },

      ]
    }
    else if (this.rol.id == 5) {
      this.appPages = [
        { title: 'Cobrar', url: '/caja', icon: 'card', open: false },
        { title: 'Lavado', url: '/lavado', icon: 'car-sport', open: false },
        { title: 'Cierres e Inicios', url: '/cierre', icon: 'flash', open: false },
        { title: 'Cortes de caja', url: '/corte', icon: 'file-tray-full', open: false },
        { title: 'Empleados', url: '/empleados', icon: 'person', open: false },
      ]
    }
    this.setingsSec = [{ title: 'Cerrar Sessión', action: true, icon: 'log-out', open: false },]
  }
}
