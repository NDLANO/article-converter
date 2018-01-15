/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const defined = require('defined');
const IntlMessageFormat = require('intl-messageformat');
const memoizeIntlConstructor = require('intl-format-cache');
const { formatMessage } = require('ndla-i18n');
const { contributorTypes } = require('ndla-licenses');

let getMessageFormat;

if (!getMessageFormat) {
  getMessageFormat = memoizeIntlConstructor(IntlMessageFormat);
}

const messages = {
  nb: {
    close: 'Lukk',
    title: 'Tittel',
    'reference.copy': 'Kopier referanse',
    'reference.copied': 'Kopiert!',
    'image.download': 'Last ned bilde',
    'image.rulesForUse': 'Regler for bruk av bildet',
    'image.reuse': 'Bruk bildet',
    'audio.download': 'Last ned lydklipp',
    'audio.rulesForUse': 'Regler for bruk av lydklipp',
    'audio.reuse': 'Bruk lydklipp',
    'video.rulesForUse': 'Regler for bruk av videoen',
    'video.reuse': 'Bruk video',
    'video.error':
      'Beklager, en feil oppsto ved lasting av videoen eller metadata om videoen.',
    'resource.error': 'Beklager, en del av innholdet kunne ikke vises.',
    'image.error.url': 'Feil ved lasting av bildet.',
    'audio.error.url': 'Feil ved lasting av lydklippet.',
    'image.error.caption': 'Beklager, en feil oppsto ved lasting av bildet.',
    'audio.error.caption': 'Beklager, en feil oppsto ved lasting av lydklipp.',
    'concept.showDescription': 'Vis begrep beskrivelse',
    'concept.error.title': 'En feil oppsto',
    'concept.error.content': 'Kunne ikke laste beskrivelsen av begrepet.',
    'external.error': 'En feil oppsto ved lasting av en ekstern ressurs.',
    learnAboutLicenses: 'Lær mer om åpne lisenser',
    source: 'Kilde',
    ...contributorTypes.nb,
  },
  en: {
    close: 'Close',
    title: 'Title',
    'reference.copy': 'Copy reference',
    'reference.copied': 'Copied!',
    'image.download': 'Download image',
    'image.rulesForUse': 'Rules for use of image',
    'image.reuse': 'Use image',
    'audio.download': 'Download audio',
    'audio.rulesForUse': 'Rules for use of audio',
    'audio.reuse': 'Use audio',
    'video.rulesForUse': 'Rules for use of video',
    'video.reuse': 'Use video',
    'video.error':
      'Sorry, an error occurd while loading the video or metadata about the video.',
    'resource.error': 'Sorry, a part of the content could not be shown.',
    'image.error.url': 'Error loading the image.',
    'audio.error.url': 'Error loading the audio.',
    'image.error.caption': 'Sorry, an error occurd while loading the image.',
    'audio.error.caption': 'Sorry, an error occurd while loading the audio.',
    'concept.showDescription': 'Show concept description',
    'concept.error.title': 'An error occurd',
    'concept.error.content': 'Could not load the description of the concept.',
    'external.error': 'An error occurd while loading an external resource.',
    learnAboutLicenses: 'Learn more about open licenses',
    source: 'Source',
    ...contributorTypes.en,
  },
};

const t = (locale, id, value) => {
  const localeMessages = defined(messages[locale], messages.nb);
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

module.exports = t;
