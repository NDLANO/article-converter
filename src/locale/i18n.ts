/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import IntlMessageFormat from 'intl-messageformat';
import memoizeIntlConstructor from 'intl-format-cache';
import {
  messagesNB,
  messagesEN,
  messagesNN,
  messagesSE,
  formatNestedMessages,
  formatMessage,
} from '@ndla/ui';
import { LocaleType } from '../interfaces';

let getMessageFormat: any;

if (!getMessageFormat) {
  getMessageFormat = memoizeIntlConstructor(IntlMessageFormat);
}

interface FormattedMessages {
  [key: string]: string;
}

const messages: Record<LocaleType, FormattedMessages> = {
  nb: formatNestedMessages(messagesNB),
  nn: formatNestedMessages(messagesNN),
  en: formatNestedMessages(messagesEN),
  se: formatNestedMessages(messagesSE),
};

const t = (locale: LocaleType, id: string, value?: { [key: string]: any }) => {
  const localeMessages = messages[locale] ?? messages.nb;
  return formatMessage(locale, localeMessages, getMessageFormat, id, value);
};

export default t;
