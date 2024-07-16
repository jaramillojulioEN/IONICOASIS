import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

interface ActionSheetButton {
  text: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(
    private ac: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  public btnEliminar: ActionSheetButton = {
    text: 'Eliminar',
    role: 'destructive',
    handler: () => { },
    cssClass: 'custom-action-delete-sheet-button'
  }

  public btnAgregar: ActionSheetButton = {
    text: 'Agregar Existencias',
    handler: () => { },
    cssClass: ''
  }
  
  public btnAgregarconsumo: ActionSheetButton = {
    text: 'Agregar Consumo',
    handler: () => { },
    cssClass: ''
  }

  public btnProps: ActionSheetButton = {
    text: 'Ver detalles',
    handler: () => { },
    cssClass: ''
  }
  public btnConsumo: ActionSheetButton = {
    text: 'Ver consumo',
    handler: () => { },
    cssClass: ''
  }


  public btncobrar: ActionSheetButton = {
    cssClass: 'custom-action-delete-sheet-button',
    text: 'Cobrar',
    handler: () => { }
  }

  public btnActualizar: ActionSheetButton = {
    text: 'Editar',
    handler: () => { }
  }

  public btnVerGrafico: ActionSheetButton = {
    text: 'Ver Gráfica',
    handler: () => { }
  }
  public btnActivar: ActionSheetButton = {
    text: 'Activar caja',
    handler: () => { }
  }
  public btnVer: ActionSheetButton = {
    text: 'Ver receta',
    handler: () => { }
  }

  public btnVerOrden: ActionSheetButton = {
    text: 'Ver orden',
    handler: () => { }
  }
  public btnAgregarP: ActionSheetButton = {
    text: 'Agregar Productos',
    handler: () => { }
  }
  public btnCancelar: ActionSheetButton = {
    text: 'Cancelar',
    role: 'cancel',
    handler: () => { }
  }

  async presentCustomAlert(header: string, message: string, callback?: () => Promise<void>) {
    const alert = await this.ac.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (callback) {
              callback();
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet(buttons: ActionSheetButton[]) {
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
    await actionSheet.present();
  }

  configureAndPresentActionSheet(buttonConfigs: { button: ActionSheetButton, handler: () => void }[]) {
    const buttons = buttonConfigs.map(config => {
      const button = { ...config.button, handler: config.handler };
      return button;
    });
    this.presentActionSheet(buttons);
  }
}
