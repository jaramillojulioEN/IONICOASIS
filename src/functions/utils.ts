import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/Components/Modals/LoadingModal/loader/loader.component';

@Injectable({
    providedIn: 'root'
})
export class LoaderFunctions {

    constructor(private modalController: ModalController) { }

    async StartLoader() {
        const modal = await this.modalController.create({
            component: LoaderComponent,
            backdropDismiss: false
        });
        return await modal.present();
    }

    async StopLoader() {
        setTimeout(() => {
            this.modalController.dismiss();
        }, 1000);
    }


}
