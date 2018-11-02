import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
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
import {LocalNotifications} from "@ionic-native/local-notifications";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform, private localNotifications: LocalNotifications) {

    platform.ready().then( () => {
      console.log(this.configureBackgroundGeolocation());
      console.log(this);
      this.configureBackgroundGeolocation.bind(this);

    });


  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: 'Single ILocalNotification',
  //
  //     // sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
  //     data: { secret: key }
  //   });
  }
  notification(message){
    this.localNotifications.requestPermission().then((permission) => {
      console.log("permission: ", permission);
      if(permission == true) {
        console.log("PERMISSION == TRUE")
        this.localNotifications.schedule({
          id: 1,
          text: message,
          title:"TITLE",
          vibrate: true,
          priority: 1,
          // sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
          data: { secret: 'key' }
        });
      }
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

    BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      url: 'http://your.server.com/locations',
      autoSync: true,
      params: {
        foo: 'bar'
      }
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

  onLocation(location:Location) {
    console.log('[location] -', location);
    this.notification('LOCATION');
  }
  onMotionChange(event:MotionChangeEvent) {
    console.log('[motionchange] -', event.isMoving, event.location);
    this.notification('MOTIONCHANGE');

  }
  onActivityChange(event:MotionActivityEvent) {
    console.log('[activitychange] -', event.activity, event.confidence);
    this.notification('ACTIVYTICHANGE');

  }
  onGeofence(event:GeofenceEvent) {
    console.log('[geofence] -', event.action, event.identifier, event.location);
  }
  onHttp(event:HttpEvent) {
    console.log('[http] -', event.success, event.status, event.responseText);
  }
  onEnabledChange(enabled:boolean) {
    console.log('[enabledchange] - enabled? ', enabled);
  }
  onConnectivityChange(event:ConnectivityChangeEvent) {
    console.log('[connectivitychange] - connected?', event.connected);
    this.notification('CONNECTIVITYCHANGE');
  }
}
