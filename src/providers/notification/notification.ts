import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications";

@Injectable()
export class NotificationProvider {

  constructor(public http: HttpClient, public localNotifications: LocalNotifications) {
    console.log('Hello NotificationProvider Provider');
  }

  notification(message) {
    this.localNotifications.requestPermission().then((permission) => {
      if (permission == true) {
        this.localNotifications.schedule({
          id: 1,
          text: message,
          title: "Atenção",
          vibrate: true,
          priority: 1,
          sound: 'file://sound.mp3', /*isAndroid? 'file://sound.mp3': 'file://beep.caf',*/
          icon: 'file://assets/imgs/logo.png',
          smallIcon: 'file://assets/imgs/logo',
          // data: {secret: 'key'}
        });
      }
    });
  }
}
