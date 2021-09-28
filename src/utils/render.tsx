/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { MissingRouterContext } from '@ndla/safelink';
import { i18nInstance } from '@ndla/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { LocaleType } from '../interfaces';

const I18nWrapper = ({
  locale,
  children,
}: {
  locale: LocaleType;
  children: React.ReactElement;
}) => {
  const { i18n } = useTranslation();
  i18n.language = locale;
  i18n.options.lng = locale;
  return children;
};

function renderInternal(
  renderFunc: (n: React.ReactElement) => string,
  component: React.ReactElement,
  locale: LocaleType,
) {
  return renderFunc(
    <I18nextProvider i18n={i18nInstance}>
      <StaticRouter>
        <MissingRouterContext.Provider value={true}>
          <I18nWrapper locale={locale}>{component}</I18nWrapper>
        </MissingRouterContext.Provider>
      </StaticRouter>
    </I18nextProvider>,
  );
}

export function render(component: React.ReactElement, locale: LocaleType = 'nb') {
  return renderInternal(renderToStaticMarkup, component, locale);
}

export function renderString(component: React.ReactElement, locale: LocaleType = 'nb') {
  return renderInternal(renderToString, component, locale);
}