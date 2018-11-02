/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import Concept from 'ndla-ui/lib/Concept';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';

const messages = locale => ({
  ariaLabel: t(locale, 'concept.showDescription'),
  close: t(locale, 'close'),
});

export default function createConceptPlugin() {
  const fetchResource = (embed, headers, lang) =>
    fetchConcept(embed, headers, lang);

  const onError = (embed, locale) => {
    const { contentId, linkText } = embed.data;
    return render(
      <Concept
        id={contentId}
        authors={[]}
        title={t(locale, 'concept.error.title')}
        content={t(locale, 'concept.error.content')}
        messages={messages(locale)}>
        {linkText}
      </Concept>
    );
  };

  const embedToHTML = (embed, locale) => {
    const {
      id,
      title: { title },
      content: { content },
    } = embed.concept;

    const copyright = defined(embed.concept.copyright, {});
    const authors = defined(copyright.creators, []).map(author => author.name);
    const license = defined(copyright.license, {}).license;

    return render(
      <Concept
        id={id}
        title={title}
        authors={authors}
        content={content}
        messages={messages(locale)}
        source={copyright.origin}
        license={license}>
        {embed.data.linkText}
      </Concept>
    );
  };

  return {
    resource: 'concept',
    onError,
    fetchResource,
    embedToHTML,
  };
}
