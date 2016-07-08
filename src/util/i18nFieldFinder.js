import defined from 'defined';

import createFieldByLanguageFinder, { findFallbackTranslation } from './createFieldByLanguageFinder';

export const titleI18N = createFieldByLanguageFinder('title');
export const titlesI18N = createFieldByLanguageFinder('titles', 'title');
export const contentI18N = createFieldByLanguageFinder('content');
export const tagsI18N = createFieldByLanguageFinder('tags');
export const alttextsI18N = createFieldByLanguageFinder('alttexts', 'alttext');

export function oembedContentI18N(learningPathStep, lang, withFallback = false) {
  const translations = defined(learningPathStep.embedContent, []);
  return defined(translations.find(d => d.language === lang), withFallback ? findFallbackTranslation(translations) : undefined);
}
