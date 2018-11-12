import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ElementRef, Injectable, ViewChild} from '@angular/core';
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";
import {NotificationProvider} from "../notification/notification";
import {NavController, Platform} from "ionic-angular";
import {environment} from "../../environment";
import {ConnectivityProvider} from "../connectivity/connectivity";
import {Observable} from "rxjs";
declare var google;


@Injectable()
export class BackgroundGeolocationProvider {

  currentUser: any;
  list: any;
  newArray: any;
  headersOptions = new HttpHeaders().set('authorization', 'teste');
  currentLatitude:any;
  currentLongitude: any;
  newLongitude: any;
  newLatitude: any;
  constructor(public http: HttpClient, private notify: NotificationProvider, public platform: Platform, public connectivity: ConnectivityProvider,
  ) {
    // console.log('Hello BackgroundGeolocationProvider Provider');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  start(){
    console.log("BackGround Start ...");
    this.platform.ready().then( () => {
      console.log(this.configureBackgroundGeolocation());
      // console.log(this);
      this.getGeolocation().subscribe( response => {
        this.currentLatitude = response.coords.latitude;
        this.currentLongitude = response.coords.longitude;
        this.addGeofence(response.coords.latitude, response.coords.longitude);
        this.configureBackgroundGeolocation.bind(this);

        // let googelPath = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${response.coords.latitude},${response.coords.longitude}&radius=150&type=school&keyword=school&key=AIzaSyBbjVONh2KXV3hWmIV3JkOzb70f6XlmI_k`;
        // let param = new HttpParams().set('teste', googelPath);
        // // console.log("PATH ****: ", googelPath);
        // this.connectivity.getGoolge(environment.serverPath+'users/google_request', param)
        //   .then(response => {
        //     if(response.results.length > 0){
        //       response.results.forEach(local => {
        //         if(local.hasOwnProperty('rating')){
        //           this.notify.notification(JSON.parse(localStorage.getItem('currentUser')).username + ", encontramos algo próximo a você");
        //           return;
        //         }
        //       })
        //     }
        //     // console.log("GOOGLE_PATH: ",response);
        //   })
        //   .catch(err => {
        //     console.log("error: ", err);
        //   });
      });
    });
  }

  // addGeofence(lat, long){
  //   BackgroundGeolocation.addGeofence({
  //     identifier: "Home",
  //     radius: 150, //minimum 150
  //     latitude: -22.8535892,
  //     longitude: -47.0512208,
  //     notifyOnEntry: true,
  //     notifyOnExit: false,
  //     notifyOnDwell: true,
  //     loiteringDelay: 30000,  // 30 seconds
  //     extras: {               // Optional arbitrary meta-data
  //       zone_id: 1234
  //     }
  //   }).then((success) => {
  //     console.log('[addGeofence] success');
  //   }).catch((error) => {
  //     console.log('[addGeofence] FAILURE: ', error);
  //   });
  // }
  addGeofence(lat, long){
    BackgroundGeolocation.removeGeofence('Home');
    BackgroundGeolocation.addGeofence({
      identifier: "Home",
      radius: 200, //minimum 150
      latitude: lat,
      longitude: long,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 600000,  // 30 min 1800000
      extras: {               // Optional arbitrary meta-data
        zone_id: 1234
      },
    }).then((success) => {
      console.log('[addGeofence] success');
    }).catch((error) => {
      console.log('[addGeofence] FAILURE: ', error);
    });
  }


  configureBackgroundGeolocation() {
    BackgroundGeolocation.onLocation(this.onLocation.bind(this));
    BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
    BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
    BackgroundGeolocation.onGeofence(this.onGeofence.bind(this));
    BackgroundGeolocation.onHttp(this.onHttp.bind(this));
    BackgroundGeolocation.onEnabledChange(this.onEnabledChange.bind(this));
    BackgroundGeolocation.onConnectivityChange(this.onConnectivityChange.bind(this));
    // BackgroundGeolocation.onHeartbeat(this.onHeartBeat.bind(this));

    BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      // heartbeatInterval: 60,
      // url: 'http://your.server.com/locations',
      autoSync: true,
      // params: {
      //   foo: 'bar'
      // }
    }, (state) => {
      console.log("STATE:", state);
      // Note:  the SDK persists its own state -- it will auto-start itself after being terminated
      // in the enabled-state when configured with stopOnTerminate: false.
      // - The #onEnabledChange event has fired.
      // - The #onConnectivityChange event has fired.
      // - The #onProviderChange has fired (so you can learn the current state of location-services).

      if (!state.enabled) {
        console.log("!STATE.ENABLED");
        // 3. Start the plugin.  In practice, you won't actually be starting the plugin in the #ready callback
        // like this.  More likely, you'll respond to some app or UI which event triggers tracking.  "Starting an order"
        // or "beginning a workout", for example.
        BackgroundGeolocation.start();
      } else {
        console.log("ELSE");
        // If configured with stopOnTerminate: false, the plugin has already begun tracking now.
        // - The #onMotionChange location has been requested.  It will be arriving some time in the near future.
      }
    });
  }


  // onHeartBeat(event: HeartbeatEvent) {
  //   console.log('[heartBeat] - ', event)
  // }

  //pega se se locomoveu
  onLocation(location:Location) {
    // console.log('[location] -', location);
    // this.notify.notification('LOCATION');
  }

  //pega inicio de movimento e o final
  onMotionChange(event:MotionChangeEvent) {
    console.log('[motionchange] -', event.isMoving, event.location);
    // this.notification('MOTIONCHANGE');

  }

  //pega mudança de atividades no celular e se o user esta apé ou de carro
  onActivityChange(event:MotionActivityEvent) {
    // console.log('[activitychange] -', event.activity, event.confidence);
    // this.notification('ACTIVYTICHANGE');
    if(event.activity == 'on_foot'){
      this.getGeolocation().subscribe(newlocation => {
        this.newLongitude = newlocation.coords.longitude;
        this.newLatitude = newlocation.coords.latitude;
        this.getDistanceFromLatLonInKm(
          {lat: this.currentLatitude, lng: this.currentLongitude},
          {lat: this.newLatitude, lng: this.newLongitude}
        ).subscribe( distance => {
            console.log("DISTANCE  ON_FOOT: ", distance);
            if(distance >= 500){
              this.getGeolocation().subscribe( geolocation => {
                console.log("GEOLOCATION 500: ", geolocation);
                this.currentLatitude = geolocation.coords.latitude;
                this.currentLongitude = geolocation.coords.longitude;
                this.connectivity.Get(environment.serverPath + 'todo_list/to_use/' + JSON.parse(localStorage.getItem('currentUser')).id, this.headersOptions).then( response => {
                  this.list = response;
                  this.list.forEach(item => {
                    this.newArray += item.kind;
                  });
                  if(this.newArray.length > 0){
                    this.newArray = this.newArray.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                    this.newArray = new Set(this.newArray);
                    setTimeout( () => {
                      this.newArray.forEach(item => {
                        let googelPath = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geolocation.coords.latitude},${geolocation.coords.longitude}&radius=150&type=${item}&keyword=${item}&key=AIzaSyBbjVONh2KXV3hWmIV3JkOzb70f6XlmI_k`;
                        let param = new HttpParams().set('teste', googelPath);
                        this.connectivity.getGoolge(environment.serverPath+'users/google_request', param)
                          .then(response => {
                            if(response.results.length > 0){
                              response.results.forEach(local => {
                                if(local.hasOwnProperty('rating')){
                                  this.notify.notification(JSON.parse(localStorage.getItem('currentUser')).username + "encontramos algo próximo a você");
                                  return;
                                }
                              })
                            }
                          })
                          .catch(err => {
                            console.log("error: ", err);
                          });
                      });
                    });
                  }
                });
              }, error => console.log('error: ', error))
            }
          },
          err => {
            console.log("error:", err);
          });
      });
    }else if(event.activity == 'in_vehicle'){
      this.getDistanceFromLatLonInKm(
        {lat: this.currentLatitude, lng: this.currentLongitude},
        {lat: event.coords.latitude, lng: event.coords.longitude}
      ).subscribe( distance => {
          if(distance >= 2500){
            console.log("DISTANCE IN_VEHICLE: ", distance);
            this.getGeolocation().subscribe( geolocation => {
              console.log("GEOLOCATION 2500: ", geolocation);
              this.currentLatitude = geolocation.coords.latitude;
              this.currentLongitude = geolocation.coords.longitude;
              this.connectivity.Get(environment.serverPath + 'todo_list/to_use/' + JSON.parse(localStorage.getItem('currentUser')).id, this.headersOptions).then(response => {
                // console.log("TO_USE: ", response);
                this.list = response;
                this.list.forEach(item => {
                  this.newArray += item.kind;
                });
                // console.log("NEW ARRAY:", this.newArray);
                if (this.newArray.length > 0) {
                  this.newArray = this.newArray.split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                  });
                  this.newArray = new Set(this.newArray);
                  setTimeout(() => {
                    this.newArray.forEach(item => {
                      let googelPath = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geolocation.coords.latitude},${geolocation.coords.longitude}&radius=150&type=${item}&keyword=${item}&key=AIzaSyBbjVONh2KXV3hWmIV3JkOzb70f6XlmI_k`;
                      let param = new HttpParams().set('teste', googelPath);
                      // console.log("PATH ****: ", googelPath);
                      this.connectivity.getGoolge(environment.serverPath + 'users/google_request', param)
                        .then(response => {
                          if (response.results.length > 0) {
                            response.results.forEach(local => {
                              if (local.hasOwnProperty('rating')) {
                                this.notify.notification(JSON.parse(localStorage.getItem('currentUser')).username + "encontramos algo próximo a você");
                                return;
                              }
                            })
                          }
                        })
                        .catch(err => console.log("error: ", err));
                    });
                  });
                }
              });
            }, error => console.log("error:", error) );
          }
        },
        err => console.log("error:", err));
    }
  }

  // //pega a ssaida do usuario em um perimetro definido
  // onGeofence(event:GeofenceEvent) {
  //   console.log('[geofence] -', event.action, event.identifier, event.location);
  //   this.notify.notification('GEOFENCE ');
  // }

  //pega a ssaida do usuario em um perimetro definido
  onGeofence(event:GeofenceEvent) {
    let geolocation: any;
    console.log('[geofence] -', event.action, event.identifier, event.location);
    // this.notify.notification('GEOFENCE ');
    if(event.action == 'EXIT'){
      this.getGeolocation().subscribe( response => {
        console.log("GEOLOCATION RESP: ", response);
        geolocation = response;
        this.addGeofence(geolocation.coords.latitude, geolocation.coords.longitude);
        console.log("CURRENT USER: ", this.currentUser);
        this.connectivity.Get(environment.serverPath+'todo_list/to_use/' + JSON.parse(localStorage.getItem('currentUser')).id, this.headersOptions).then( response => {
          // console.log("TO_USE: ", response);
          this.list = response;
          this.list.forEach(item => {
            this.newArray += item.kind;
          });
          // console.log("NEW ARRAY:", this.newArray);
          if(this.newArray.length > 0){
            this.newArray = this.newArray.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
            this.newArray = new Set(this.newArray);
            setTimeout( () => {
              this.newArray.forEach(item => {
                let googelPath = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geolocation.coords.latitude},${geolocation.coords.longitude}&radius=150&type=${item}&keyword=${item}&key=AIzaSyBbjVONh2KXV3hWmIV3JkOzb70f6XlmI_k`;
                let param = new HttpParams().set('teste', googelPath);
                // console.log("PATH ****: ", googelPath);
                this.connectivity.getGoolge(environment.serverPath+'users/google_request', param)
                  .then(response => {
                    if(response.results.length > 0){
                      response.results.forEach(local => {
                        if(local.hasOwnProperty('rating')){
                          this.notify.notification(JSON.parse(localStorage.getItem('currentUser')).username + "encontramos algo próximo a você");
                          return;
                        }
                      })
                    }
                  })
                  .catch(err => {
                    console.log("error: ", err);
                  });
              });
            });
          }
        });
        this.newArray = [];
      });
    }
  }

  getGeolocation(): Observable<any>{
    return new Observable( observer => {
      BackgroundGeolocation.getCurrentPosition()
        .then( response => {
          console.log("Geolocaiton: ", response);
          observer.next(response);
        })
        .catch( err => {
          console.log("err:" , err);
          observer.error(err);
        })
    })
  }

  onHttp(event:HttpEvent) {
    console.log('[http] -', event.success, event.status, event.responseText);
  }

  onEnabledChange(enabled:boolean) {
    console.log('[enabledchange] - enabled? ', enabled);
  }

  onConnectivityChange(event:ConnectivityChangeEvent) {
    console.log('[connectivitychange] - connected?', event.connected);
    // this.notification('CONNECTIVITYCHANGE');
  }

  stop(){
    BackgroundGeolocation.stop()
  }


  getDistanceFromLatLonInKm(position1, position2):Observable<any> {
    return new Observable( observer => {
      var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(position2.lat - position1.lat),
        dLng = deg2rad(position2.lng - position1.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(deg2rad(position1.lat))
          * Math.cos(deg2rad(position1.lat))
          * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      observer.next( ((R * c *1000).toFixed()) );
    })
  }

  /* this.latitude = 0; this.longitude = 0;
    if currentPosition >= 500
      this.latitude = novo; this.longitude = novo;

  */
  // this.getDistanceFromLatLonInKm(
  //   {lat: -23.522490, lng: -46.736600},
  //   {lat: -23.4446654, lng: -46.5319316}
  // ));

  // console.log(distancia);
}
