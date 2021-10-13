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
// @ts-ignore
import Table from '@ndla/ui/lib/Table';
// @ts-ignore
import FactBox from '@ndla/ui/lib/FactBox';
// @ts-ignore
import FileList from '@ndla/ui/lib/FileList';
// @ts-ignore
import { Figure } from '@ndla/ui/lib/Figure';
import t from '../locale/i18n';
import { render } from './render';
import { LocaleType } from '../interfaces';

export function createAside(
  props: {
    children?: React.ReactNode;
    narrowScreen?: boolean;
    wideScreen?: boolean;
  },
  children: string,
) {
  return render(
    <Aside
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />,
  );
}

export function createFactbox(props: {}, children: string) {
  return render(
    <FactBox
      {...props}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />,
  );
}

export function createFileSection(
  files: { title: string; formats: { url: string; fileType: string; tooltip: string }[] }[],
  pdfs: { title: string; formats: { url: string }[] }[],
  heading: string,
) {
  const filelistId = process.env.NODE_ENV === 'unittest' ? 'testid' : uuid();
  const figureId = process.env.NODE_ENV === 'unittest' ? 'testid' : uuid();
  return render(
    <>
      {files.length > 0 && <FileList files={files} heading={heading} id={filelistId} />}
      {pdfs.map((pdf, index) => (
        <Figure key={`${index}-${figureId}`} id={`${index}-${figureId}`}>
          <h2>{pdf.title}</h2>
          <iframe title={pdf.title} height="1050" src={pdf.formats[0].url} />
        </Figure>
      ))}
    </>,
  );
}

export function createTable(props: {}, children: string, lang: LocaleType) {
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
    />,
  );
}
