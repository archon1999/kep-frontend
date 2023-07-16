import { Pipe, PipeTransform } from '@angular/core';
import { AttemptLangs } from '../../app/modules/problems/attempts.models';

let cache = {};

function getLangColor(lang: string){
    if(lang == AttemptLangs.CPP){
        return 'blue';
    } else if(lang == AttemptLangs.PYTHON){
        return 'success';
    } else if(lang == AttemptLangs.R){
        return 'primary';
    } else if(lang == AttemptLangs.HASKELL){
        return 'warning';
    } else if(lang == AttemptLangs.KEP){
        return 'danger';
    }
}

@Pipe({
  name: 'langColor'
})
export class LangColorPipe implements PipeTransform {
  
    transform(lang: string): string {
        if(!cache[lang]) cache[lang] = getLangColor(lang);
        return cache[lang];
    }

}
