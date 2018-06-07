/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { uuid } from 'ndla-util';
import Aside from 'ndla-ui/lib/Aside';
import Table from 'ndla-ui/lib/Table';
import FactBox from 'ndla-ui/lib/FactBox';
import t from '../locale/i18n';

export function createAside(props, children) {
  return renderToStaticMarkup(
    <Aside
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
}

export function createFactbox(props, children) {
  return renderToStaticMarkup(
    <FactBox
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
}

export function createTable(props, children, lang) {
  return renderToStaticMarkup(
    <Table
      id={uuid()}
      messages={{
        dialogCloseButton: t(lang, 'close'),
        expandButtonLabel: t(lang, 'expandButton'),
      }}
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
}
