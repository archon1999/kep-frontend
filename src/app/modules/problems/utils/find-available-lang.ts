import { AttemptLangs } from '../constants';
import { AvailableLanguage } from '../models/problems.models';

export function findAvailableLang(availableLanguages: Array<AvailableLanguage>, lang: AttemptLangs): AvailableLanguage | null {
    return availableLanguages.find(availableLang => availableLang.lang == lang);
}
