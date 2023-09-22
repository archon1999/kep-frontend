import { FormControl, AsyncValidatorFn } from "@angular/forms";
import { AutocompleteSearchConfig, autocompleteSearchDefaultConfig } from "./autocomplete-search.config";
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export function autocompleteSearchValidator(config: AutocompleteSearchConfig): AsyncValidatorFn {
  return (control: FormControl) => {
    config = {
      ...autocompleteSearchDefaultConfig,
      ...config,
    }    

    config.request.body[config.mainInputFilterField] = control.value;
    return config.httpClient.request(config.request, config.method).pipe(
      map((data: any) => {
        console.log(data?.content.length);
        if(data?.content.length == 0){
          return {}
        }
        return null;
      })
    )
  }
}
