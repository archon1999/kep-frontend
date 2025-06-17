import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';
import { SuccessSoundEnum } from './enums/success-sound.enum';
import { HomeSoundEnum, HomeSoundList } from '@shared/services/sounds/enums/home-sound.enum';
import { randomChoice } from '@shared/utils/random';

const SUCCESS_SOUND_KEY = 'success-sound';
const WRONG_SOUND_KEY = 'wrong-sound';
const HOME_SOUND_KEY = 'home-sound';

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  constructor(public localStorageService: LocalStorageService) {}

  setSuccessSound(sound: SuccessSoundEnum) {
    this.localStorageService.set(SUCCESS_SOUND_KEY, sound);
  }

  getSuccessSound() {
    return this.localStorageService.get(SUCCESS_SOUND_KEY) || SuccessSoundEnum.Default;
  }

  getSuccessSoundSrc() {
    return `assets/audio/success/${this.getSuccessSound()}.mp3`;
  }

  setHomeSound(sound: HomeSoundEnum) {
    this.localStorageService.set(HOME_SOUND_KEY, sound);
  }

  getHomeSound() {
    return this.localStorageService.get(HOME_SOUND_KEY) || HomeSoundEnum.NoSound;
  }

  getHomeSoundSrc() {
    let homeSound = this.getHomeSound();
    if (homeSound === HomeSoundEnum.Random) {
      homeSound = randomChoice(HomeSoundList);
    }
    return `assets/audio/home/${homeSound}.aac`;
  }

}
