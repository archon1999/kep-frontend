import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreConfigService } from 'core/services/config.service';
import { CoreConfig } from 'core/types';
import { SoundsService } from '@shared/services/sounds/sounds.service';
import { SuccessSoundEnum } from 'app/shared/services/sounds/success-sound.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  public menuLayout: string;

  public SuccessSoundEnum = SuccessSoundEnum;
  public successSound: string = this.soundsService.getSuccessSound();
  public successSounds = [
    {
      name: SuccessSoundEnum.Default,
      id: SuccessSoundEnum.Default,
    },
    {
      name: SuccessSoundEnum.RickRoll,
      id: SuccessSoundEnum.RickRoll,
    },
    {
      name: SuccessSoundEnum.NoSound,
      id: SuccessSoundEnum.NoSound,
    },
  ];

  public enableAnimation: string;

  @ViewChild('successAudio') successAudio: ElementRef<any>;

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
          enableAnimation: this.enableAnimation == 'enable',
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

}
