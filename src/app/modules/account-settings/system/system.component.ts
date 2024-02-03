import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { SoundsService } from '@shared/services/sounds/sounds.service';
import { SuccessSoundEnum, SuccessSoundList } from '@shared/services/sounds/enums/success-sound.enum';
import { HomeSoundEnum, HomeSoundList } from '@shared/services/sounds/enums/home-sound.enum';

@Component({
  selector: 'system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  public menuLayout: string;

  public SuccessSoundEnum = SuccessSoundEnum;
  public successSound: SuccessSoundEnum = this.soundsService.getSuccessSound();
  public successSoundList = SuccessSoundList;

  public HomeSoundEnum = HomeSoundEnum;
  public homeSound: HomeSoundEnum = this.soundsService.getHomeSound();
  public homeSoundList = HomeSoundList;

  public enableAnimation: string;

  @ViewChild('successAudio') successAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('homeAudio') homeAudio: ElementRef<HTMLAudioElement>;

  constructor(
    public coreConfigService: CoreConfigService,
    public soundsService: SoundsService,
  ) {
  }

  ngOnInit(): void {
    this.coreConfigService.getConfig().subscribe(
      (config: CoreConfig) => {
        this.menuLayout = config.layout.type;
        this.enableAnimation = config.layout.enableAnimation ? 'enable' : 'disable';
      }
    );
  }

  changeMenuLayout() {
    setTimeout(() => {
      this.coreConfigService.setConfig({
        layout: {
          type: this.menuLayout,
        }
      });
    }, 500);
  }

  changeEnableAnimation() {
    setTimeout(() => {
      this.coreConfigService.setConfig({
        layout: {
          enableAnimation: this.enableAnimation === 'enable',
        }
      });
    }, 500);
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

}
