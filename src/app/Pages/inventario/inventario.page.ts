import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { ExistenciasComponent } from 'src/app/Components/Modals/existencias/existencias.component';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CantidesComponent } from 'src/app/Components/Modals/cantides/cantides.component';
import { HistorialExistenciasComponent } from 'src/app/Components/Modals/historial-existencias/historial-existencias.component';
import { Calls } from 'src/functions/call';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  productos: any = [];
  BebidaArry: any = [];
  loadedProductos = false;
  loadedBebidas = false;
  rol: any = [];
  sucursales: any = [];
  segmento: string = 'productos';

  paginadorProductos = { PaginaActual: 1, TotalPorPagina: 15, TotalItems: 0, PaginationEnabled: true };
  paginadorBebidas   = { PaginaActual: 1, TotalPorPagina: 15, TotalItems: 0, PaginationEnabled: true };

  constructor(
    private ProductoService: ProductoServiceService,
    private BebidaService: BebidaService,
    private ac: AlertServiceService,
    private ModalController: ModalController,
    private us: UserServiceService,
    private call: Calls
  ) { }

  async ngOnInit() {
    this.sucursales = await this.call.getsucus();
    this.rol = this.us.getRol();
    this.ObtenerProducutos();
    this.ObtenerBebidas();
    window.addEventListener('successb', () => {
      this.ObtenerBebidas();
      this.ModalController.dismiss();
    });
    window.addEventListener('successp', () => {
      this.ObtenerProducutos();
      this.ModalController.dismiss();
    });
  }

  async handleRefresh(event: any) {
    this.paginadorProductos.PaginaActual = 1;
    this.paginadorBebidas.PaginaActual = 1;
    await Promise.all([this.ObtenerProducutos(), this.ObtenerBebidas()]);
    event.target.complete();
  }

  // ── Paginación productos ──────────────────────────────────
  totalPaginasProductos(): number {
    return Math.ceil(this.paginadorProductos.TotalItems / this.paginadorProductos.TotalPorPagina) || 1;
  }
  anteriorProductos() {
    if (this.paginadorProductos.PaginaActual > 1) {
      this.paginadorProductos.PaginaActual--;
      this.ObtenerProducutos();
    }
  }
  siguienteProductos() {
    if (this.paginadorProductos.PaginaActual < this.totalPaginasProductos()) {
      this.paginadorProductos.PaginaActual++;
      this.ObtenerProducutos();
    }
  }

  // ── Paginación bebidas ────────────────────────────────────
  totalPaginasBebidas(): number {
    return Math.ceil(this.paginadorBebidas.TotalItems / this.paginadorBebidas.TotalPorPagina) || 1;
  }
  anteriorBebidas() {
    if (this.paginadorBebidas.PaginaActual > 1) {
      this.paginadorBebidas.PaginaActual--;
      this.ObtenerBebidas();
    }
  }
  siguienteBebidas() {
    if (this.paginadorBebidas.PaginaActual < this.totalPaginasBebidas()) {
      this.paginadorBebidas.PaginaActual++;
      this.ObtenerBebidas();
    }
  }

  // Devuelve la existencia de un item para una sucursal dada
  getExistencia(item: any, idsucursal: number): any {
    const lista = item.productosexitencias ?? item.bebidasexitencias ?? [];
    return lista.find((e: any) => e.idsucursal === idsucursal);
  }

  // ── Acciones ──────────────────────────────────────────────
  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnAgregar, handler: () => this.agregarExistecias(data) },
      { button: this.ac.btnCancelar, handler: () => { } }
    ]);
  }

  async agregarExistecias(data: any) {
    const modal = await this.ModalController.create({
      component: ExistenciasComponent,
      componentProps: { data }
    });
    return await modal.present();
  }

  async vercantidades(data: any) {
    const modal = await this.ModalController.create({
      component: CantidesComponent,
      componentProps: { data }
    });
    return await modal.present();
  }

  async verHistorial(data: any) {
    const modal = await this.ModalController.create({
      component: HistorialExistenciasComponent,
      componentProps: {
        id: data.id,
        nombre: data.nombre,
        isbebida: data.precioventa ? true : false
      }
    });
    return await modal.present();
  }

  // ── Carga de datos ────────────────────────────────────────
  async ObtenerProducutos(): Promise<void> {
    this.loadedProductos = false;
    try {
      const response: any = await (await this.ProductoService.Productos(this.paginadorProductos)).toPromise();
      if (response?.productos) {
        this.productos = response.productos.sort((a: any, b: any) =>
          (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' })
        );
        this.paginadorProductos.TotalItems = response.Paginador?.TotalItems ?? 0;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loadedProductos = true;
    }
  }

  async ObtenerBebidas(): Promise<void> {
    this.loadedBebidas = false;
    try {
      const response: any = await (await this.BebidaService.Bebidas(this.paginadorBebidas)).toPromise();
      if (response?.bebidas) {
        this.BebidaArry = response.bebidas.sort((a: any, b: any) =>
          (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' })
        );
        this.paginadorBebidas.TotalItems = response.Paginador?.TotalItems ?? 0;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loadedBebidas = true;
    }
  }
}
