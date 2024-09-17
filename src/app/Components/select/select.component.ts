import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { PlatilloService } from 'src/app/services/Platillos/platillo.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  PlatilloArry: any = [];
  BebidaArry: any = [];
  criterio: string = ""
  @Input() isPlatillo: boolean = true
  bebsPrp: any = [];
  loaded: boolean = false;;

  constructor(
    private PlatilloService: PlatilloService,
    private BebidaService: BebidaService,
    private pop: PopoverController,
    private ac: AlertServiceService
  ) { }
  ngOnInit() {
    this.ObtenerPlatillos(true, this.criterio)
    this.ObtenerBebidas(true, this.criterio)
    this.ObtenerBebidasPrp(true, this.criterio)
  }

  agruparPorCategoria(platillos: any[]) {
    return platillos.reduce((acc, platillo) => {
      let categoria = acc.find((c: { nombre: any; }) => c.nombre === platillo.categorias.categoria);
      if (!categoria) {
        categoria = { nombre: platillo.categorias.categoria, platillos: [] };
        acc.push(categoria);
      }
      categoria.platillos.push(platillo);
      return acc;
    }, []);
  }


  async ObtenerPlatillos(load: boolean = false, criterio: string = ""): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.PlatilloService.Platillos(load, 2, 0, criterio)).toPromise();

      if (response && response.platillos) {
        this.PlatilloArry = response.platillos;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

  valido = false
  async ValidarExistencia(data: any): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(await this.PlatilloService.existencias(data));
      console.log(response);
      return response.valido;
    } catch (error) {
      console.error('Error validating existence:', error);
      return false;
    }
  }

  async ObtenerBebidasPrp(load: boolean = false, criterio: string = ""): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.PlatilloService.Platillos(load, 1, 0, criterio)).toPromise();

      if (response && response.platillos) {
        this.bebsPrp = response.platillos;
        console.log(this.bebsPrp)

      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  async Dissmiss(data: any, isprp: boolean = false) {
    if (await this.ValidarExistencia(data)) {
      if (isprp) {
        data.isprep = isprp
      }
      this.pop.dismiss(data)
    } else {
      this.ac.presentCustomAlert("Error", "No hay elementos suficientes para esta orden: " + data.nombre)
    }

  }

  onSearchInput(event: Event) {
    if (this.isPlatillo) {
      this.ObtenerPlatillos(true, this.criterio)
    } else {
      this.ObtenerBebidas(true, this.criterio)
      this.ObtenerBebidasPrp(true, this.criterio);

    }
  }

  async ObtenerBebidas(load: boolean = false, criterio: string = ""): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.BebidaService.Bebidas(load, criterio)).toPromise();

      if (response && response.bebidas) {
        this.BebidaArry = response.bebidas;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


}
