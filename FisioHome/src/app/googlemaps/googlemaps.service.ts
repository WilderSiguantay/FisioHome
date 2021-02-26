import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { environment } from '../../environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  // El fin de este servicio es importar la libreria unicamente cuando el usuario la solicite

  apiKey = environment.ApiKeyGoogleMaps;
  mapsLoaded = false;

  constructor() { }


  init(renderer: any, document: any): Promise<any>{
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve) => {

      if (this.mapsLoaded){
        console.log('google is preview loaded');
        resolve(true);
        return;
      }

      const script = renderer.createElement('script');
      script.id = 'googleMaps';

      // tslint:disable-next-line: no-string-literal
      window['mapInit'] = () => {
        this.mapsLoaded = true;
        if (google){
          console.log('google is loaded');
        }else{
          console.log('google no esta definido');
        }
        resolve(true);
        return;
      };

      if (this.apiKey){
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      }else{
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      renderer.appendChild(document.body, script);
    }
    );
  }

}
