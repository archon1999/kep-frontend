import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from '@core/services/app-state.service';
import { TranslateService } from "@ngx-translate/core";
import { localeEn } from "./i18n/en";
import { localeRu } from "./i18n/ru";
import { localeUz } from "./i18n/uz";
import { CoreLoadingScreenService } from "@core/services/loading-screen.service";
import { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadConfettiPreset } from "@tsparticles/preset-confetti";
import { NgxParticlesModule } from "@tsparticles/angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxParticlesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  id = 'keppyConfetti';
  container?: Container;
  particlesOptions: ISourceOptions = {
    preset: 'confetti',
    duration: 10,
    "fullScreen": {
      "zIndex": 0
    },
    "particles": {
      "number": {
        "value": 0
      },
      "color": {
        "value": [
          "#00FFFC",
          "#FC00FF",
          "#fffc00"
        ]
      },
      "shape": {
        "type": [
          "circle",
          "square",
          "triangle",
          "polygon"
        ],
        "options": {
          "polygon": [
            {
              "sides": 5
            },
            {
              "sides": 6
            }
          ]
        }
      },
      "opacity": {
        "value": {
          "min": 0,
          "max": 1
        },
        "animation": {
          "enable": true,
          "speed": 2,
          "startValue": "max",
          "destroy": "min"
        }
      },
      "size": {
        "value": {
          "min": 2,
          "max": 4
        }
      },
      "links": {
        "enable": false
      },
      "life": {
        "duration": {
          "sync": true,
          "value": 5
        },
        "count": 1
      },
      "move": {
        "enable": true,
        "gravity": {
          "enable": true,
          "acceleration": 10
        },
        "speed": {
          "min": 10,
          "max": 20
        },
        "decay": 0.1,
        "direction": "none",
        "straight": false,
        "outModes": {
          "default": "destroy",
          "top": "none"
        }
      },
      "rotate": {
        "value": {
          "min": 0,
          "max": 360
        },
        "direction": "random",
        "move": true,
        "animation": {
          "enable": true,
          "speed": 60
        }
      },
      "tilt": {
        "direction": "random",
        "enable": true,
        "move": true,
        "value": {
          "min": 0,
          "max": 360
        },
        "animation": {
          "enable": true,
          "speed": 60
        }
      },
      "roll": {
        "darken": {
          "enable": true,
          "value": 25
        },
        "enable": true,
        "speed": {
          "min": 15,
          "max": 25
        }
      },
      "wobble": {
        "distance": 30,
        "enable": true,
        "move": true,
        "speed": {
          "min": -15,
          "max": 15
        }
      }
    },
    "emitters": {
      "life": {
        "count": 0,
        "duration": 0.1,
        "delay": 0.4
      },
      "rate": {
        "delay": 0.1,
        "quantity": 150
      },
      "size": {
        "width": 0,
        "height": 0
      }
    }
  };
  protected translateService = inject(TranslateService);
  protected coreLoadingService = inject(CoreLoadingScreenService);

  constructor(private appStateService: AppStateService) {
    this.translateService.setTranslation('en', localeEn);
    this.translateService.setTranslation('ru', localeRu);
    this.translateService.setTranslation('uz', localeUz);

    this.appStateService.state$.subscribe(
      (state) => {
        this.translateService.setDefaultLang(state.language);
      }
    )
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadConfettiPreset(engine);
  }

  particlesLoaded(container: Container): void {
    this.container = container;
  }
}
