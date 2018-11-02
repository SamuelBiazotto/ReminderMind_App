import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import {Platform} from "ionic-angular";

@Injectable()
export class BackgroundGeolocationProvider {

  constructor(public http: HttpClient, private notify: NotificationProvider, public platform: Platform) {
    console.log('Hello BackgroundGeolocationProvider Provider');
  }

  start(){
    console.log("BackGround Start ...");
    this.platform.ready().then( () => {
      console.log(this.configureBackgroundGeolocation());
      // console.log(this);
      this.addGeofence(-22.8535892, -47.0512208);
      this.configureBackgroundGeolocation.bind(this);
    });
  }

  addGeofence(lat, long){
    BackgroundGeolocation.addGeofence({
      identifier: "Home",
      radius: 150, //minimum 150
      latitude: -22.8535892,
      longitude: -47.0512208,
      notifyOnEntry: true,
      notifyOnExit: false,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
      extras: {               // Optional arbitrary meta-data
        zone_id: 1234
      }
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
    BackgroundGeolocation.onHeartbeat(this.onHeartBeat.bind(this));

    BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      heartbeatInterval: 1,
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


  onHeartBeat(event: HeartbeatEvent) {
    console.log('[heartBeat] - ', event)
  }

  //pega se se locomoveu
  onLocation(location:Location) {
    console.log('[location] -', location);
    this.notify.notification('LOCATION');
  }

  //pega inicio de movimento e o final
  onMotionChange(event:MotionChangeEvent) {
    console.log('[motionchange] -', event.isMoving, event.location);
    // this.notification('MOTIONCHANGE');

  }

  //pega mudança de atividades no celular e se o user esta apé ou de carro
  onActivityChange(event:MotionActivityEvent) {
    console.log('[activitychange] -', event.activity, event.confidence);
    // this.notification('ACTIVYTICHANGE');

  }

  //pega a ssaida do usuario em um perimetro definido
  onGeofence(event:GeofenceEvent) {
    console.log('[geofence] -', event.action, event.identifier, event.location);
    this.notify.notification('GEOFENCE ');
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
}
