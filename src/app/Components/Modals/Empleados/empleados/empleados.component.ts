import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriaServiceService } from 'src/app/services/Categorias/categoria-service.service';
import { EmpleadosService } from 'src/app/services/Empleados/empleados.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
})
export class EmpleadosComponent implements OnInit {
  Usuario: any;
  Empleados: any;
  @Input() data: any = []
  roless: any = [];
  contrasena: string = ""
  user: any = [];
  constructor(
    private CategoriasService: CategoriaServiceService,
    protected us: UserServiceService,
    protected empleadoservice: EmpleadosService,
    protected md: ModalController,
    protected fn: LoaderFunctions
  ) { }

  dias: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  dia: string = "Lunes"
  ngOnInit() {
    this.getsucus()
    console.log(this.data)
    this.user = this.us.getUser()
    this.ObtenerRoles();

    if (!this.data) {
      this.Usuario = {
        id: 0,
        nombreusuario: "",
        contraseña: "",
        nombre: "",
        idrol: 0,
        idsucursal: this.user.sucursales.id,
        empleados: undefined,
      }
      this.Empleados = {
        id: 0,
        nombrecompleto: this.Usuario.nombre,
        correo: "",
        telefono: "",
        idusuario: 0,
        cargo: "",
        salario: "",
        diapago: "",
        fechacontrato: this.fn.obtenerFechaHoraActual(),
      }
    } else {
      console.log(this.data.usuarios)
      this.Empleados = this.data;
      this.Usuario = this.data.usuarios;
      this.Usuario.idsucursal = this.user.sucursales.id;
      this.contrasena = this.Usuario.contraseña
    }

  }

  sucursales: any = [];

  getsucus(): void {
    this.us.Sucursales().subscribe(
      (response: any) => {
        if (response && response.sucursales) {
          this.sucursales = response.sucursales;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      },
      () => {
        console.log("just loaded")
      }
    );
  }
  // convertirFecha(fechaStr: string): string {
  //   const fecha = new Date(fechaStr);

  //   const year = fecha.getFullYear();
  //   const month = ("0" + (fecha.getMonth() + 1)).slice(-2);
  //   const day = ("0" + fecha.getDate()).slice(-2);
  //   const hours = ("0" + fecha.getHours()).slice(-2);
  //   const minutes = ("0" + fecha.getMinutes()).slice(-2);
  //   const seconds = ("0" + fecha.getSeconds()).slice(-2);
  //   const milliseconds = ("00" + fecha.getMilliseconds()).slice(-3);

  //   const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  //   return formattedDate;
  // }

  async ObtenerRoles(): Promise<void> {
    try {
      this.CategoriasService.Roles().subscribe(
        (response: any) => {
          if (response && response.roles) {
            this.roless = response.roles;
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } catch (error) {

    }
  }



  async Guardar() {
    this.Usuario.contraseña = this.contrasena
    if (this.Usuario.id == 0) {
      this.Empleados.nombrecompleto = this.Usuario.nombre
      this.Usuario.empleados = [this.Empleados]
      console.log(this.Usuario);
      (await this.empleadoservice.CrearEmpleado(this.Usuario)).subscribe(
        (response: any) => {
          console.log(response);
          this.md.dismiss();
          window.dispatchEvent(new Event('success'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.Empleados.nombrecompleto = this.Usuario.nombre
      this.Usuario.empleados = [this.Empleados];
      if (this.Usuario.sucursales) {
        this.Usuario.sucursales = null
      }
      if (this.Usuario.roles) {
        this.Usuario.roles = null
      }
      if (this.Usuario.empleados[0]) {
        this.Usuario.empleados[0].usuarios = null
      }
      (await this.empleadoservice.ActulizarEmpleado(this.Usuario)).subscribe(
        (response: any) => {
          console.log(response);
          this.md.dismiss();
          window.dispatchEvent(new Event('success'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }

  }

}
