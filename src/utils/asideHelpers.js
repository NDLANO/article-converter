/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Aside from 'ndla-ui/lib/Aside';
import FactBox from 'ndla-ui/lib/FactBox';

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
