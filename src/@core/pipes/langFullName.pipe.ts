import { Pipe, PipeTransform } from '@angular/core';
import { AttemptLangs } from '../../app/modules/problems/attempts.models';

let cache = {};

function getLangFullNane(lang: string){
  if (lang == AttemptLangs.CPP) {
    return 'C++ 20';
  } else if (lang == AttemptLangs.PYTHON) {
    return 'Python 3.10';
  } else if (lang == AttemptLangs.R) {
    return 'R Lang 4.1';
  } else if (lang == AttemptLangs.HASKELL) {
    return 'Haskell 8';
  } else if(lang == AttemptLangs.KEP){
    return 'KEP Lang 0.99';
  } else if(lang == AttemptLangs.C){
    return 'C11';
  } else if(lang == AttemptLangs.KOTLIN){
    return 'Kotlin 1.8';
  } else if(lang == AttemptLangs.TEXT){
    return 'Text';
  } else if(lang == AttemptLangs.HTML){
    return 'HTML 5'
  } else if(lang == AttemptLangs.SQL){
    return 'SQL';
  } else if(lang == AttemptLangs.BASH){
    return 'Bash';
  } else if(lang == AttemptLangs.JS){
    return 'JavaScript';
  } else if(lang == AttemptLangs.PHP){
    return 'PHP 8.1';
  } else if(lang == AttemptLangs.CSHARP){
    return 'C# 11';
  } else if(lang == AttemptLangs.JAVA){
    return 'Java 11';
  }
}

@Pipe({
  name: 'langFullName'
})
export class LangFullNamePipe implements PipeTransform {

  transform(lang: string): string {
    if(!cache[lang]) cache[lang] = getLangFullNane(lang);
    return cache[lang];
  }

}
