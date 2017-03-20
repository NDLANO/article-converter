/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import httpStaus from 'http-status';

 export const htmlTemplate = (lang, title, article) => {
   const scripts = article.requiredLibraries.map(library =>
       `<script type="${library.mediaType}" src="${library.url}"></script>`
     ).join();

   return `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    </head>
    <body>
      <h1>${title}</h1>
      <section>
        ${article.introduction}
      </section>
      ${article.content}
      ${scripts}
    </body>
  </html>`;
 };

 export const htmlErrorTemplate = (lang, { status, message, description, stacktrace }) => {
   const statusMsg = httpStaus[status];
   return htmlTemplate(lang, `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
 };
