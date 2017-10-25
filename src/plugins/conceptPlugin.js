/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOMServerStream from 'react-dom/server';
import Glossary from 'ndla-ui/lib/Glossary';
import { fetchConcept } from '../api/conceptApi';

export default function createConceptPlugin() {
  const fetchResource = (embed, headers) => fetchConcept(embed, headers);

  const embedToHTML = embed => {
    const {
      id,
      title: { title },
      content: { content },
      copyright,
    } = embed.concept;

    const messages = {
      ariaLabel: 'Vis begrep beskrivelse',
      close: 'Lukk',
    };

    embed.embed.replaceWith(
      ReactDOMServerStream.renderToStaticMarkup(
        <Glossary
          id={id}
          title={title}
          authors={copyright.authors.map(author => author.name)}
          content={content}
          messages={messages}
          source={copyright.origin}
          license={copyright.license.license}>
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
