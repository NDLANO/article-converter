/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { availableLocales } from './localeConstants';

export const isValidLocale = localeAbbreviation => availableLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation) => {
  const locale = availableLocales.find(l => l.abbreviation === localeAbbreviation);
  return locale ? locale.abbreviation : 'nb'; // Defaults to nb if not found
};
