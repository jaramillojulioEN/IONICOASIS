import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  public CatalogosPages = [
    { title: 'Productos', url: '/productos', icon: 'wine' },
    { title: 'Platillos', url: '/platillos', icon: 'pizza' },
    { title: 'Recetas', url: '/recetas', icon: 'receipt' },
    { title: 'Categorias', url: '/categorias', icon: 'duplicate' },
    { title: 'Bebidas', url: '/categorias', icon: 'beer' },
    { title: 'Mesas', url: '/mesas', icon: 'cafe' },
  ];

  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home', open: false },
    { 
      title: 'Catálogos', 
      url: '/incio', 
      icon: 'apps-outline', 
      subpages: this.CatalogosPages, 
      open: false
    },
    { title: 'Contacto', url: '/contacto', icon: 'call', open: false },
  ];

  constructor(private navCtrl: NavController, private menuCtrl: MenuController) {}

  toggleSubmenu(page: any) {
    page.open = !page.open;
  }

  closeAllPages() {
    this.appPages.forEach(page => {
      page.open = false;
    });
  }

  async navigateTo(url: string) {
    this.navCtrl.navigateRoot(url);  // Navega a la página
  }

  ngOnInit() {
    console.log(this.appPages)
  }
}
