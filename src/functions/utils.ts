import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/Components/Modals/LoadingModal/loader/loader.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';

@Injectable({
    providedIn: 'root'
})
export class LoaderFunctions {
    id: string = "defaultLoader";

    constructor(private modalController: ModalController,
        private ld: LoadingController,
    ) { }

    async CargandoLogin(Mensaje: string) {
        const modal = await this.modalController.create({
            component: LoaderComponent,
            componentProps: {
                Mensaje: Mensaje,
            },
        });
        return await modal.present();
    }
    async cerrarCargandoLogin(user: any = null) {
        this.modalController.dismiss()
    }

    async Welcome(user: any = null) {
        this.CargandoLogin("Bienvenido " + user.nombre)
        setTimeout(() => {
            this.modalController.dismiss()
        }, 2000);
    }

    async StartLoader(mensaje: string = "Cargando...") {

        const loading = await this.ld.create({
            message: mensaje,
            translucent: true,
            backdropDismiss: false,
            spinner: 'bubbles',
            id: this.id
        });
        await loading.present();
    }

    async StopLoader(id: string = "defaultLoader") {
        const loading = await this.ld.getTop();
        if (loading && loading.id === id) {
            await this.ld.dismiss();
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
