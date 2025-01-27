import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Services } from '../../services/services.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: []
})
export class HomePage implements OnInit {
  public folder: string;
  public estadoJornada = false;
  public now: Date = new Date();
  vehiculos!: any;
  watch: Subscription;
  IdUsuario: string;
  Usuario: any;
  vehiculoSeleccionado = 0;
  handlerMessage = '';
  roleMessage = '';
  latitude: any;
  longitude: any;
  disableVehiculo = false;

  constructor(
    private geolocation: Geolocation,
    private services: Services,
    private authServices: AuthService,
    private alertCtrl: AlertController
    ) {
    setInterval(() => {
      this.now = new Date();
    }, 1);
   }

  ngOnInit() {
    this.listarVehiculos();
    // this.cargarStorage();
    this.IdUsuario = this.authServices.IdUsuario;
    this.Usuario = this.authServices.Usuario;

  }

  // ==============================
  // Inicia/Finaliza la jornada de seguimiento
  // ==============================
  jornada()
  {
    if(this.vehiculoSeleccionado == 0)
    {
      this.showAlert('Debe seleccionar un vehiculo');
      return;
    }

    if(!this.estadoJornada)
    {
      this.disableVehiculo = true;
      this.services.inicioJornada(this.vehiculoSeleccionado,this.IdUsuario);

      this.watch = this.geolocation.watchPosition().subscribe((pos: any) => {
        this.services.trazabilidad(this.vehiculoSeleccionado,pos);
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;

        console.log("watch",pos)
      });
      this.estadoJornada = !this.estadoJornada;

    }
    else
    {
      this.presentAlert();

    }

  }


  // ==============================
  // ==============================
  listarVehiculos()
  {
    this.services.listarVehiculos(  )
    .subscribe( (resp: any) => {

       this.vehiculos = resp.vehiculos[0];

      //  this.cargando = false;

     });


  }

// ==================================================
// Detecta los cambios en el select de los planes
// ==================================================
cambios(nuevoValor: any) {

    this.vehiculoSeleccionado = nuevoValor;

    // const setName = async () => {
    //   await Preferences.set({
    //     key: 'IdVehiculo',
    //     value: nuevoValor
    //   });
    // };

    // this.cargarClientes();
}

  // ==============================
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Mensaje',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  // ==============================
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: '¿Desea finalizar la jornada?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';

            this.watch.unsubscribe();
            this.services.finJornada(this.vehiculoSeleccionado,'1');
            this.estadoJornada = !this.estadoJornada;
            this.disableVehiculo = false;


          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
}
// ==============================
cargarStorage() {
  console.log("cargarStorage es : ");

  async () => {
    const { value } = await Preferences.get({ key: 'IdUsuario' });
    console.log("value es : ",value);
    this.IdUsuario = value;
  };
}

}
