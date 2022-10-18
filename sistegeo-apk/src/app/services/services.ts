import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL_SERVICIOS = environment.URL_SERVICIOS;


@Injectable({
  providedIn: 'root'
})
export class Services {

  constructor(
    private http: HttpClient
  ) {

  }

// ==================================================
//  Envia latitud y longitud al backend
// ==================================================
enviarData( dataLtLg: any ) {

  console.log("data es service : " + dataLtLg);

  let url = URL_SERVICIOS + '/dataGeolocalizacion/setData';

  console.log("url es service : " + url);

  this.http.post( url,
    {
      latitud: dataLtLg.coords.latitude,
      longitud: dataLtLg.coords.longitude
    }
    ).subscribe();

}

// ==============================
listarVehiculos(  ) {

  console.log('entra en listarVehiculos');

    let url = URL_SERVICIOS + '/vehiculos/listar';
    // url += '?IdRol=' + this.IdRol;  // params
    return this.http.get( url );

}

}
