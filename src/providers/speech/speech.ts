import {Injectable} from '@angular/core';
import {SpeechRecognition} from "@ionic-native/speech-recognition";

/*
  Generated class for the SpeechProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpeechProvider {

  constructor(public speech: SpeechRecognition) {
    // console.log('Hello SpeechProvider Provider');
  }

  async getSupportedLanguages(): Promise<Array<string>>{
    try {
      const languages = this.speech.getSupportedLanguages();
      console.log('languages:' + languages);
      return languages;
    }catch(e){
      console.error(e);
    }
  }

  async hasPermission(): Promise<boolean>{
    try{
      const permission = await this.speech.hasPermission();
      console.log('has permission: '+ permission);
      return permission;
    }catch(e){
      console.error(e);
    }
  }

  async getPermission(): Promise<void>{
    try {
      const permission = await this.speech.requestPermission();
      console.log('get permission:' + permission);
      return permission;
    }catch(e) {
      console.error(e);
    }
  }

  async isSpeechSuported(): Promise<Boolean> {
    const  isAvaible = await this.speech.isRecognitionAvailable();
    console.log('is avaible:' + isAvaible);
    return isAvaible;
  }
}
