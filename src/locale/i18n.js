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
    'reference.copy': 'Kopier referanse',
    'reference.copied': 'Kopiert!',
    'image.download': 'Last ned bilde',
    'image.reuse': 'Bruk bildet',
    'video.reuse': 'Bruk video',
  },
  en: {
    'reference.copy': 'Copy reference',
    'reference.copied': 'Copied!',
    'image.download': 'Download image',
    'image.reuse': 'Use image',
    'video.reuse': 'Use video',
  },
};

const t = (locale, id, value) => {
  const localeMessages = defined(messages[locale], messages.nb);
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

module.exports = t;
