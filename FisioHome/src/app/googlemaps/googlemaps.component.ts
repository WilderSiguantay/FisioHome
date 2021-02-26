import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { GooglemapsService } from './googlemaps.service';
import { Direccion } from '../shared/user.interface';

const {Geolocation} = Plugins;
declare var google: any;

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent implements OnInit {

  @Input() position = {
    lat: 14.642070,
    lng: -90.514025
  };

  label = {
    titulo: 'Ubicación',
    subtitulo: 'Mi ubicacion de encuentro'
  };

  direccion: string;
  map: any; // elemento mapa
  marker: any; // el marcador que aparece en el mapa
  infowindow: any; // la informacion que aparece en el marcador
  positionSet: any; // variable que guardará la posicion o direccion del mapa

  @ViewChild('map') divMap: ElementRef; // indica en donde va a estar el mapa, nos referenciamos al div que esta en el html
  constructor(private renderer: Renderer2,
              @Inject(DOCUMENT) private document,
              private googlemapsService: GooglemapsService,
              public modalController: ModalController){ }

  ngOnInit(): void{
    this.init();
    this.mylocation();
  }

  async init(){
    this.googlemapsService.init(this.renderer, this.document).then(() => {
      this.initMap();
    }).catch((err) => {
      console.log(err);
    });
  }

  initMap(){
    const position = this.position;

    const latLng = new google.maps.LatLng(position.lat, position.lng);
    const geocoder = new google.maps.Geocoder();
    const mapOptions = {
      center: latLng,
      zoom: 18,
      disableDefaultUI: true, // habilitar o desabilitar botones de google maps
      clickableIcons: true // descripcion de lugares
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true
    });

    this.clickHandleEvent();
    this.infowindow = new google.maps.InfoWindow(); // muestra la informacion en el marcador
    // this.geocodeLatLng(geocoder, this.map, this.infowindow);


    if (this.label.titulo.length) {
      this.addMarker(position);
      // this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);//
      this.geocodeLatLng(geocoder, this.map, this.infowindow);

    }
  }


  // cada vez que se da click en el mapa, se agrega un escuchador de click el cual va a obtener la latitud y la longitud
  // de esa ubicacion en el mapa la cual lo va a mandar al metodo addMarker para posicionar el marcador en esa
  // ubicacion en donde se dio click
  clickHandleEvent() {

    this.map.addListener('click', (event: any) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addMarker(position);
    });
  }

  // posicionamos el marcador en la posicion ya sea inicial o la que obtiene del gps
  addMarker(position: any): void{
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(position.lat, position.lng);
    this.marker.setPosition(latLng);
    this.map.panTo(position); // el mapa se centra con referencia a la ubicacion del marcador
    this.positionSet = position; // guardamos la posicion en la variable posicionSet
    this.geocodeLatLng(geocoder, this.map, this.infowindow);

  }

  setInfoWindow(marker: any, titulo: string, subtitulo: string){
    const contentString =  '<div id="contentInsideMap">' +
                            '<div>' +
                            '</div>' +
                            '<p style="font-weight: bold; margin-bottom:5px;">' + titulo + '</p>' +
                            '<div id="bodyContent">' +
                            '<p class="normal m-0">' + subtitulo +
                            '</p>';
    // tslint:disable-next-line: no-unused-expression
    '</div>' +
                            '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker); // nos indica en donde queremos que esté el infowindows
  }

  async mylocation(){
    console.log('mi localizacion click');
    Geolocation.getCurrentPosition().then((res) => {
      console.log('mi localizacion -> get', res);
      const position = {
        lat: res.coords.latitude,
        lng: res.coords.longitude,
      };
      this.addMarker(position);
    });
  }

  aceptar(){
    console.log('click aceptar ->', this.positionSet);
    this.modalController.dismiss({pos: this.positionSet});
  }


  // This function is called when the user clicks the UI button requesting
// a geocode of a place ID.

 geocodeLatLng(geocoder: any, map: any, infowindow: any) {
  geocoder.geocode(
    { location: this.positionSet },
    (
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    ) => {
      if (status === 'OK') {
        if (results[0]) {
          // map.setZoom(11);

          infowindow.setContent(results[0].formatted_address);
         // window.alert(results[0].formatted_address);
          infowindow.open(map, this.marker);
        } else {
          // window.alert("No results found");
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    }
  );
}

}
