/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import httpStatus from 'http-status';
import { TransformedArticle } from '../interfaces';

export const htmlTemplate = (lang: string, title: string, article: TransformedArticle) => {
  const scripts = article.requiredLibraries
    .map((library) => `<script type="${library.mediaType}" src="${library.url}"></script>`)
    .join();

  const introduction =
    article.introduction !== undefined ? `<section>${article.introduction}</section>` : '';

  return `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    </head>
    <body>
      <h1>${title}</h1>
      ${introduction}
      ${article.content}
      ${scripts}
    </body>
  </html>`;
};

export const htmlErrorTemplate = (
  lang: string,
  {
    status,
    message,
    description,
    stacktrace,
  }: { status: keyof typeof httpStatus; message: string; description: string; stacktrace: string },
) => {
  const statusMsg = httpStatus[status];
  return `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Error</title>
    </head>
    <body>
      <h1>${status} ${statusMsg}</h1>
      <div><b>Message: </b>${message}</div>
      <div><b>Description: </b>${description}</div>
      <div>${stacktrace}</div>
    </body>
  </html>`;
};
