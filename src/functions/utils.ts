import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/Components/Modals/LoadingModal/loader/loader.component';

@Injectable({
    providedIn: 'root'
})
export class LoaderFunctions {

    constructor(private modalController: ModalController) { }

    async StartLoader() {
        try {
            // Obtén el modal en la parte superior de la pila
            const topModal = await this.modalController.getTop();
            
            // Si el modal en la parte superior es el Loader, simplemente retorna
            if (topModal && topModal.id === "ModalLoading") {
                return Promise.resolve();
            }
            
            // Cierra cualquier modal existente
            if (topModal) {
                await this.modalController.dismiss();
            }
            
            // Crea y presenta el modal de carga
            const modal = await this.modalController.create({
                id: "ModalLoading",
                component: LoaderComponent,
                backdropDismiss: false
            });
            return await modal.present();
        } catch (error) {
            console.error('Error starting loader:', error);
        }
    }
    
    async StopLoader() {
        try {
            // Intenta cerrar el modal de carga
            await this.modalController.dismiss(null, undefined, "ModalLoading");
        } catch (error) {
            // Si el error es que el modal no existe, simplemente ignora
            if (error !== 'overlay does not exist') {
                console.error('Error stopping loader:', error);
            }
        }
    }



    filterbydate(elements: any, fecha: string): any {
        let result: any[] = [];
        elements.forEach((element: any) => {
            if (element.fecha.split("T")[0] == fecha.split("T")[0]) {
                result.push(element)
            }
        });
        return result;
    }


    obtenerFechaHoraActual(): string {
        const ahora = new Date();

        const year = ahora.getFullYear();
        const month = this.padNumber(ahora.getMonth() + 1); // Meses van de 0 a 11
        const day = this.padNumber(ahora.getDate());
        const hours = this.padNumber(ahora.getHours());
        const minutes = this.padNumber(ahora.getMinutes());
        const seconds = this.padNumber(ahora.getSeconds());
        const milliseconds = this.padNumber(ahora.getMilliseconds(), 3); // Asegurar que sean 3 dígitos

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

        return formattedDate;
    }

    private padNumber(num: number, length: number = 2): string {
        return num.toString().padStart(length, '0');
    }



}
