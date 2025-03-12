import { Component, ElementRef, ViewChild } from '@angular/core';
import { SoundsService } from '@shared/services/sounds/sounds.service';
import { SuccessSoundEnum, SuccessSoundList } from '@shared/services/sounds/enums/success-sound.enum';
import { HomeSoundEnum, HomeSoundList } from '@shared/services/sounds/enums/home-sound.enum';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';

// import themeToggleEffects from '@layout/components/navbar/theme-toggle-effects';

@Component({
  selector: 'system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
  standalone: false,
})
export class SystemComponent {

  public menuLayout: string;

  public SuccessSoundEnum = SuccessSoundEnum;
  public successSound: SuccessSoundEnum = this.soundsService.getSuccessSound();
  public successSoundList = SuccessSoundList;

  public HomeSoundEnum = HomeSoundEnum;
  public homeSound: HomeSoundEnum = this.soundsService.getHomeSound();
  public homeSoundList = HomeSoundList;

  public enableAnimation: string;

  // public themeToggleEffect = this.localStorageService.get('theme-toggle-effect') || 'polygon';
  // public themeToggleEffectList = Object.keys(themeToggleEffects);

  @ViewChild('successAudio') successAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('homeAudio') homeAudio: ElementRef<HTMLAudioElement>;

  constructor(
    public soundsService: SoundsService,
    public localStorageService: LocalStorageService,
  ) {
  }

  successSoundChange() {
    setTimeout(() => {
      this.soundsService.setSuccessSound(this.successSound);
      this.successAudio?.nativeElement?.play();
    }, 100);
  }

  homeSoundChange() {
    setTimeout(() => {
      this.soundsService.setHomeSound(this.homeSound);
      this.homeAudio?.nativeElement?.play();
    }, 100);
  }

  // themeToggleEffectChange() {
  //   setTimeout(() => {
  //     this.localStorageService.set('theme-toggle-effect', this.themeToggleEffect);
  //   }, 100);
  // }
}
