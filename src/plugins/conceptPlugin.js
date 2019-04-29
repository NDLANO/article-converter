/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import defined from 'defined';
import Notion, {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
} from '@ndla/notion';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';

export default function createConceptPlugin() {
  const fetchResource = (embed, headers, lang) =>
    fetchConcept(embed, headers, lang);

  const onError = (embed, locale) => {
    const { contentId, linkText } = embed.data;

    return render(
      <Notion
        id={`notion_id_${contentId}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={t(locale, 'concept.error.title')}
        content={
          <NotionDialogContent>
            <NotionDialogText>
              {t(locale, 'concept.error.content')}
            </NotionDialogText>
          </NotionDialogContent>
        }>
        {linkText}
      </Notion>,
      locale
    );
  };

  const embedToHTML = (embed, locale) => {
    const { id, title, content } = embed.concept;
    const copyright = defined(embed.concept.copyright, {});
    const authors = defined(copyright.creators, []).map(author => author.name);
    const license = defined(copyright.license, {}).license;
    return render(
      <Notion
        id={`notion_id_${id}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={title}
        content={
          <Fragment>
            <NotionDialogContent>
              <NotionDialogText>{content}</NotionDialogText>
            </NotionDialogContent>
            <NotionDialogLicenses
              license={license}
              source={copyright.origin}
              authors={authors}
            />
          </Fragment>
        }>
        {embed.data.linkText}
      </Notion>,
      locale
    );
  };

  return {
    resource: 'concept',
    onError,
    fetchResource,
    embedToHTML,
  };
}
