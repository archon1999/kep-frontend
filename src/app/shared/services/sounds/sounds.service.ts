import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../storages/local-storage.service';
import { SuccessSoundEnum } from './success-sound.enum';

const SUCCESS_SOUND_KEY = 'success-sound';
const WRONG_SOUND_KEY = 'wrong-sound';

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  constructor(public localStorageService: LocalStorageService) { }

  setSuccessSound(sound: string){
    this.localStorageService.set(SUCCESS_SOUND_KEY, sound);
  }

  getSuccessSound(){
    return this.localStorageService.get(SUCCESS_SOUND_KEY) || SuccessSoundEnum.Default;
  }

}
