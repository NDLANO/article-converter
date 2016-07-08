import { availableLocales } from './localeConstants';

export const isValidLocale = (localeAbbreviation) => availableLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation) => {
  const locale = availableLocales.find(l => l.abbreviation === localeAbbreviation);
  return locale ? locale.abbreviation : 'nb'; // Defaults to nb if not found
};
