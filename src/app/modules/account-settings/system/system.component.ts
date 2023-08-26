import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { SoundsService } from '../../../shared/services/sounds/sounds.service';
import { SuccessSoundEnum } from 'app/shared/services/sounds/success-sound.enum';

@Component({
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
  ]

  @ViewChild('successAudio') successAudio: ElementRef<any>;

  constructor(
    public coreConfigService: CoreConfigService,
    public soundsService: SoundsService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().subscribe(
      (config: CoreConfig) => {
        this.menuLayout = config.layout.type;
      }
    )
  }

  changeMenuLayout(){
    setTimeout(() => {
      this.coreConfigService.setConfig({
        layout: {
          type: this.menuLayout,
        }
      })
    }, 500)
  }

  successSoundChange(){
    setTimeout(() => {
      this.soundsService.setSuccessSound(this.successSound);
      this.successAudio?.nativeElement?.play();
    }, 100);
  }

}
