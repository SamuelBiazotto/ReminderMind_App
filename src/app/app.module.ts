import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import {MyApp} from './app.component';
// import { TabsPage } from '../pages/tabs/tabs';
// import { AboutPage } from '../pages/about/about';
// import { ContactPage } from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
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
import {NotificationProvider} from '../providers/notification/notification';
import {BackgroundGeolocationProvider} from '../providers/background-geolocation/background-geolocation';
import {HttpClientModule} from "@angular/common/http";
import {LoginPage} from "../pages/login/login";
import {MapPage} from "../pages/map/map";
import {RegisterPage} from "../pages/register/register";
import {ListPage} from "../pages/list/list";
import {NewListPage} from "../pages/new-list/new-list";
import {ConnectivityProvider} from '../providers/connectivity/connectivity';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {SpeechProvider} from '../providers/speech/speech';
import {LaunchNavigator} from "@ionic-native/launch-navigator";
import {Geolocation} from "@ionic-native/geolocation"


@NgModule({
  declarations: [
    MyApp,
    // AboutPage,
    // ContactPage,
    // TabsPage
    HomePage,
    LoginPage,
    MapPage,
    RegisterPage,
    ListPage,
    NewListPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // AboutPage,
    // ContactPage,
    // TabsPage
    HomePage,
    LoginPage,
    MapPage,
    RegisterPage,
    ListPage,
    NewListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationProvider,
    BackgroundGeolocationProvider,
    ConnectivityProvider,
    SpeechRecognition,
    SpeechProvider,
    Geolocation,
    LaunchNavigator,
  ]
})
export class AppModule {}
