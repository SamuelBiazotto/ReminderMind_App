import {Component, OnInit} from '@angular/core';
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
import {MapPage} from "../map/map";
import {ListPage} from "../list/list";
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {SpeechProvider} from "../../providers/speech/speech";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  speechList: Array<string> = [];
  currentUser:any;

  constructor(public navCtrl: NavController, public backgroundGeolocation: BackgroundGeolocationProvider, public speech: SpeechRecognition,
              public speechProvider: SpeechProvider) {

    this.backgroundGeolocation.start();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
  }

  ngOnInit(){
    this.speechProvider.isSpeechSuported();
    this.speechProvider.getPermission();
    this.speechProvider.hasPermission();
    this.speechProvider.getSupportedLanguages();
  }

  sendMap() {
    this.navCtrl.push(MapPage);
  }

  sendList() {
    this.navCtrl.push(ListPage);
  }

}
