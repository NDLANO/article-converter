/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOMServerStream from 'react-dom/server';
import defined from 'defined';
import Glossary from 'ndla-ui/lib/Glossary';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';

export default function createConceptPlugin() {
  const fetchResource = (embed, headers, lang) =>
    fetchConcept(embed, headers, lang);

  const embedToHTML = (embed, locale) => {
    const { id, title: { title }, content: { content } } = embed.concept;

    const messages = {
      ariaLabel: t(locale, 'concept.showDescription'),
      close: t(locale, 'close'),
    };

    const copyright = defined(embed.concept.copyright, {});
    const authors = defined(copyright.authors, []).map(author => author.name);
    const license = defined(copyright.license, {}).license;

    embed.embed.replaceWith(
      ReactDOMServerStream.renderToStaticMarkup(
        <Glossary
          id={id}
          title={title}
          authors={authors}
          content={content}
          messages={messages}
          source={copyright.origin}
          license={license}>
          {embed.data.linkText}
        </Glossary>
      )
    );
  };

  return {
    resource: 'concept',
    fetchResource,
    embedToHTML,
  };
}
