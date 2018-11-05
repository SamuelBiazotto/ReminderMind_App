import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LaunchNavigator, LaunchNavigatorOptions} from "@ionic-native/launch-navigator";
import {Observable} from "rxjs";
// import {googlemaps} from "googlemaps";
import {environment} from "../../environment";
import {HttpHeaders} from "@angular/common/http";
import {ConnectivityProvider} from "../../providers/connectivity/connectivity";
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements OnInit{

  optionsNavigation:LaunchNavigatorOptions;
  apps:any = [];
  currentUser:any;
  list:any = [];
  map: any;
  infowindow: any;
  latitude: any;
  longitude: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  bounds = new google.maps.LatLngBounds();
  toolbar: any = 'list';
  localesList: any = [];
  setScroll:any;
  testArray:any = ["school", "gym", "church"];
  outerbounds = [ // covers the (mercator projection) world
    new google.maps.LatLng(85,180),
    new google.maps.LatLng(85,90),
    new google.maps.LatLng(85,0),
    new google.maps.LatLng(85,-90),
    new google.maps.LatLng(85,-180),
    new google.maps.LatLng(0,-180),
    new google.maps.LatLng(-85,-180),
    new google.maps.LatLng(-85,-90),
    new google.maps.LatLng(-85,0),
    new google.maps.LatLng(-85,90),
    new google.maps.LatLng(-85,180),
    new google.maps.LatLng(0,180),
    new google.maps.LatLng(85,180)];
  constructor(public navCtrl: NavController, public navParams: NavParams, public launchNavigator: LaunchNavigator,
              public geolocation: Geolocation, public connectivity: ConnectivityProvider) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  launch(item){
    console.log(item);
    this.launchNavigator.availableApps()
      .then( response => {
        Object.getOwnPropertyNames(response).forEach(function(val, idx, array) {
          // console.log(val + ' -> ' + response[val]);
          if(response[val] == true){
            console.log(val.toUpperCase());
            this.apps.push(this.launchNavigator.APP.val.toUpperCase());
          }
        });
      })
      .catch(err => console.log(err));

    this.optionsNavigation = {
      start: [this.latitude, this.longitude],
      appSelection: { dialogHeaderText: "Selecione uma Aplicação", list: this.apps, cancelButtonText: "Cancelar"}
    };

    this.launchNavigator.navigate(item.vicinity, this.optionsNavigation)
      .then(
        success => console.log('Launched navigator', success),
        error => console.log('Error launching navigator', error)
      );
  }

  ngOnInit() {
    this.getUserPosition().subscribe(
      data =>{
        console.log(data);
      },error => {
        console.log(error);
      },
      () => {
        console.log('on complete');
        this.getSelected();
      });
  }

  getUserPosition(): Observable<any>{
    return Observable.create(observer => {
      console.log('getUserPosition');
      this.options = {
        enableHighAccuracy: true
      };
      this.geolocation.getCurrentPosition(this.options)
        .then( pos => {
            this.currentPos = pos;
            this.latitude = pos.coords.latitude;
            this.longitude = pos.coords.longitude;
            observer.complete('getUserPosition Done');
            observer.next('next');
        })
        .catch( err => {
          console.log("error : " + err.message);
            observer.error('error occured');
        })
    })
  }

  initMap(type) {
    console.log("TYPE ####:", type);
    let pyrmont = {lat: this.latitude, lng: this.longitude};
    console.log(pyrmont);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 1,
      disableDefaultUI: true
    });

    this.infowindow = new google.maps.InfoWindow();
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: pyrmont,
      radius: 400,
      type: [type]
    }, (result, status) => {
      this.callback(result,status);
    });
    this.f();
  }

  //Plot user marker
  plotMarker(lat, lng) {
    console.log('plot marker');
    let placeLoc = ({lat: lat, lng: lng});
    let marker = new google.maps.Marker({
      map: this.map,
      animation:google.maps.Animation.DROP,
      position: placeLoc,
      label:'I',
      title: 'user location'
    });
    marker.setMap(this.map);

    let infowindow = new google.maps.InfoWindow({
      content:'user location'
    });
    marker.addListener('click', function () {
      infowindow.setContent('user location');
      infowindow.open(this.map, marker);
    });
  }

  lockScroll() {
    let x = false;
    if(this.toolbar == "map"){
      x = true;
    }

    if(x){
      this.setScroll = "no-scroll";
      console.log("MAP #####", this.map);
      this.map.setZoom(16.0);
    }else{
      this.setScroll = "scroll";
    }
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        if(results[i].hasOwnProperty('rating')){
          console.log(results[i]);
          this.createMarker(results[i]);
          this.localesList.push(results[i]);
        }else{
          console.log('location does not have rating');
        }
      }
    }
    if(this.localesList.length > 0){
      this.toolbar = 'list';
    }
  }

  //Plot place markers
  createMarker(place) {
    let placeLoc = ({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: placeLoc,
    });

    let infowindow = new google.maps.InfoWindow({
    });

    marker.addListener('click', function () {
      infowindow.setContent(place.name);
      infowindow.open(this.map, marker);
    });
  }
  f() {
    // Add the circle for this city to the map.
    let cityCircle = new google.maps.Circle({
      strokeColor: '#AFAFAF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#AFAFAF',
      fillOpacity: 0.35,
      map: this.map,
      paths: [this.outerbounds,this.drawCircle({lat: this.latitude, lng: this.longitude},0.21,-1)]
      // center: {lat: this.latitude, lng: this.longitude},
      // radius: Math.sqrt(15) * 100
    });
    cityCircle = new google.maps.Polygon(cityCircle);
    this.map.fitBounds(this.bounds);
  }

  drawCircle(point, radius, dir) {
    let d2r = Math.PI / 180;   // degrees to radians
    let r2d = 180 / Math.PI;   // radians to degrees
    let earthsradius = 3963; // 3963 is the radius of the earth in miles
    let points = 32;

    // find the raidus in lat/lon
    let rlat = (radius / earthsradius) * r2d;
    let rlng = rlat / Math.cos(point.lat * d2r);

    let extp: any = [];
    let start: any;
    let end: any;
    if (dir == 1)   {
      start = 0;
      end = points+1
    } // one extra here makes sure we connect the ends
    else {
      start = points+1;
      end = 0
    }
    for (let i=start; (dir==1 ? i < end : i > end); i=i+dir) {
      let theta = Math.PI * (i / (points/2));
      let ey = point.lng + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
      let ex = point.lat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
      extp.push(new google.maps.LatLng(ex, ey));
      this.bounds.extend(extp[extp.length-1]);
    }
    return extp;
  }

  getSelected() {
    let newArray:any = '';
    console.log('get Selected');
    let headersOptions = new HttpHeaders().set('Authorization', 'teste');
    this.connectivity.Get(environment.serverPath+'todo_list/to_use/'+this.currentUser.id, headersOptions).then( response => {
      this.list = response;
      this.list.forEach( item => {
        newArray+= item.kind;
      });
      newArray = newArray.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
      newArray = new Set(newArray);
      console.log("NEWARRAY%%%%%: ", newArray);
      this.testArray = newArray;
      setTimeout( () => {
        console.log("TESTARRAY: &&&&", this.testArray);
        if(this.testArray.size > 0) {
          this.testArray.forEach( item => {
            this.initMap(item);
            this.plotMarker(this.latitude, this.longitude);
          });
        }else {
          this.initMap('hindu_temple');
          this.plotMarker(this.latitude, this.longitude);
        }
        // this.plotMarker(this.longitude, this.longitude);
      },1000)
    }, err => {
      console.log(err);
    });
  }

}
