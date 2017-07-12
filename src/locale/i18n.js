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
    'image.howToReference': 'Slik skal du referere til dette bildet',
    'image.reuse': 'Bruk bildet',
    'video.rulesForUse': 'Regler for bruk av videoen',
    'video.howToReference': 'Slik skal du referere til denne videoen',
    'video.reuse': 'Bruk video',
  },
  en: {
    close: 'Close',
    'reference.copy': 'Copy reference',
    'reference.copied': 'Copied!',
    'image.download': 'Download image',
    'image.rulesForUse': 'Rules for use of image',
    'image.howToReference': 'How to reference this image',
    'image.reuse': 'Use image',
    'video.rulesForUse': 'Rules for use of video',
    'video.howToReference': 'How to reference this video',
    'video.reuse': 'Use video',
  },
};

const t = (locale, id, value) => {
  const localeMessages = defined(messages[locale], messages.nb);
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

module.exports = t;
