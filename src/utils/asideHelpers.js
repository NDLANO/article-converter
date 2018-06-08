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
import FactBox from 'ndla-ui/lib/FactBox';
import FileList from 'ndla-ui/lib/FileList';

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

export function createFileList(props) {
  const id = process.env.NODE_ENV === 'unittest' ? 'testid' : uuid();
  return renderToStaticMarkup(<FileList {...props} id={id} />);
}
