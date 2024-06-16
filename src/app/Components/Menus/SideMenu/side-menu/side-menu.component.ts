import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
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

  public appPages: any = [];
  rol: any = [];
  user: any = [];
  setingsSec: any  = [];
  

  constructor(private navCtrl: NavController, private menuCtrl: MenuController, private authservice: UserServiceService) { }

  toggleSubmenu(page: any) {
    page.open = !page.open;
  }

  closeAllPages() {
    this.appPages.forEach((page: { open: boolean; }) => {
      page.open = false;
    });
  }

  async navigateTo(url: string) {
    this.navCtrl.navigateRoot(url);
  }

  ngOnInit() {
    this.rol = this.authservice.getRol()
    this.user = this.authservice.getUser()
    console.log(this.user)
    if (this.rol.id == 1) {
      this.appPages = [
        { title: 'Inicio', url: '/admin', icon: 'home', open: false },
        {
          title: 'Catálogos',
          url: '/incio',
          icon: 'apps-outline',
          subpages: this.CatalogosPages,
          open: false
        },
        { title: 'Empleados', url: '/empleados', icon: 'person', open: false },
        { title: 'Contacto', url: '/contacto', icon: 'call', open: false },
      ]
    } else if (this.rol.id == 2) {
      this.appPages = [
        { title: 'Mesas', url: '/mesero', icon: 'cafe', open: false },
        { title: 'Mis mesas', url: '/mesas', icon: 'golf', open: false },
      ]
    }
    else if (this.rol.id == 4) {
      this.appPages = [
        { title: 'Ordenes pendientes', url: '/cocina', icon: 'receipt', open: false },
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
    this.setingsSec = [{ title: 'Configuraciones', url: '/empleados', icon: 'settings', open: false },]
  }
}
