/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { uuid } from '@ndla/util';
import Aside from '@ndla/ui/lib/Aside';
import Table from '@ndla/ui/lib/Table';
import FactBox from '@ndla/ui/lib/FactBox';
import FileList from '@ndla/ui/lib/FileList';
import t from '../locale/i18n';
import { render } from './render';

export function createAside(props, children) {
  return render(
    <Aside
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
}

export function createFactbox(props, children) {
  return render(
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
  return render(<FileList {...props} id={id} />);
}

export function createTable(props, children, lang) {
  const id = process.env.NODE_ENV === 'unittest' ? 'testid' : uuid();
  return render(
    <Table
      id={id}
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
