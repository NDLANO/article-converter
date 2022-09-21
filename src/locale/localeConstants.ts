/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LocaleType } from '../interfaces';

type LocaleObject = {
  name: string;
  abbreviation: LocaleType;
};
export const NB: LocaleObject = { name: 'Bokmål', abbreviation: 'nb' };
export const NN: LocaleObject = { name: 'Nynorsk', abbreviation: 'nn' };
export const EN: LocaleObject = { name: 'English', abbreviation: 'en' };
export const SE: LocaleObject = { name: 'Davvisámegiella', abbreviation: 'se' };

export const availableLocales = [NB, NN, EN, SE];
export const preferredLocales = [NB, NN, EN, SE];
