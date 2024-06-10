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

    filterbydate(elements: any, fecha: string) : any {
        let result: any[] = [];
        elements.forEach((element: any) => {
            if(element.fecha.split("T")[0] == fecha.split("T")[0]){
                result.push(element)
            }
        });
        return result;
    }


}
