import { IRequest } from "@shared/helpers/service/http/IRequest";
import { BaseConfig } from "../../basic/base-config";
import { requestTypes } from "@shared/helpers/service/http/http.requests";
import { HttpClientService } from "@shared/helpers/service/http/http.client.service";

export interface AutocompleteSearchConfig extends BaseConfig {
  mainInputFilterField: string,
  request?: IRequest,
  method?: requestTypes,
  httpClient?: HttpClientService
}

export const autocompleteSearchDefaultConfig: AutocompleteSearchConfig = {
  mainInputFilterField: '',
  errorTranslateMessage: 'AUTOCOMPLETE_SEARCH_ERROR',
  errorName: 'autocompleteSearchError',
  method: 'post',
};
