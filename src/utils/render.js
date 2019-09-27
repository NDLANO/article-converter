/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MissingRouterContext } from '@ndla/safelink';
import { messagesNB, messagesEN, messagesNN } from '@ndla/ui';
import IntlProvider, { formatNestedMessages } from '@ndla/i18n';

const messages = {
  nb: formatNestedMessages(messagesNB),
  nn: formatNestedMessages(messagesNN),
  en: formatNestedMessages(messagesEN),
};

export function render(component, locale = 'nb') {
  return renderToStaticMarkup(
    <IntlProvider messages={messages[locale] || messages.nb} locale={locale}>
      <MissingRouterContext.Provider value={true}>
        {component}
      </MissingRouterContext.Provider>
    </IntlProvider>
  );
}
