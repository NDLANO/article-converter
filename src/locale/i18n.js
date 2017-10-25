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
    'reference.copy': 'Kopier referanse',
    'reference.copied': 'Kopiert!',
    'image.download': 'Last ned bilde',
    'image.rulesForUse': 'Regler for bruk av bildet',
    'image.reuse': 'Bruk bildet',
    'video.rulesForUse': 'Regler for bruk av videoen',
    'video.reuse': 'Bruk video',
    'concept.showDescription': 'Vis begrep beskrivelse',
    learnAboutOpenLicenses: 'Lær mer om åpne lisenser',
    source: 'Kilde',
  },
  en: {
    close: 'Close',
    'reference.copy': 'Copy reference',
    'reference.copied': 'Copied!',
    'image.download': 'Download image',
    'image.rulesForUse': 'Rules for use of image',
    'image.reuse': 'Use image',
    'video.rulesForUse': 'Rules for use of video',
    'video.reuse': 'Use video',
    'concept.showDescription': 'Show concept description',
    learnAboutOpenLicenses: 'Learn more about open licenses',
    source: 'Source',
  },
};

const t = (locale, id, value) => {
  const localeMessages = defined(messages[locale], messages.nb);
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

module.exports = t;
