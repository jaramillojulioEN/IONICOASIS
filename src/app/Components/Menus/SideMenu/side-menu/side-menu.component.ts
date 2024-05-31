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
    { title: 'Bebidas', url: '/categorias', icon: 'beer' },
    { title: 'Mesas', url: '/mesas', icon: 'cafe' },
  ];

  public appPages: any = [];
  rol: any = [];

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

  }
}
