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
import {NotificationProvider} from "../../providers/notification/notification";
import {BackgroundGeolocationProvider} from "../../providers/background-geolocation/background-geolocation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public backgroundGeolocation: BackgroundGeolocationProvider) {
  this.backgroundGeolocation.start();
  }

}
