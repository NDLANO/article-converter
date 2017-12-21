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
    'video.rulesForUse': 'Regler for bruk av videoen',
    'video.reuse': 'Bruk video',
    'video.error':
      'Beklager, en feil oppsto ved lasting av videoen eller metadata om videoen.',
    'concept.showDescription': 'Vis begrep beskrivelse',
    learnAboutLicenses: 'Lær mer om åpne lisenser',
    source: 'Kilde',
  },
  en: {
    close: 'Close',
    title: 'Title',
    'reference.copy': 'Copy reference',
    'reference.copied': 'Copied!',
    'image.download': 'Download image',
    'image.rulesForUse': 'Rules for use of image',
    'image.reuse': 'Use image',
    'video.rulesForUse': 'Rules for use of video',
    'video.reuse': 'Use video',
    'video.error':
      'Sorry, an error occurd while loading the video or metadata about the video.',
    'concept.showDescription': 'Show concept description',
    learnAboutLicenses: 'Learn more about open licenses',
    source: 'Source',
  },
};

const t = (locale, id, value) => {
  const localeMessages = defined(messages[locale], messages.nb);
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

module.exports = t;
