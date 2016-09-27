/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import httpStaus from 'http-status';

 export const htmlResponse = (lang, body) =>
  `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    </head>
    <body>${body}</body>
  </html>`;

 export const htmlErrorResponse = (lang, { status, message, description, stacktrace }) => {
   const statusMsg = httpStaus[status];
   return htmlResponse(lang, `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
 };
