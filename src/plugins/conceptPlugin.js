/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import defined from 'defined';
import { Remarkable } from 'remarkable';
import Notion, {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogImage,
  NotionDialogLicenses,
} from '@ndla/notion';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';

export default function createConceptPlugin(options = {}) {
  const fetchResource = (embed, accessToken, language) =>
    fetchConcept(embed, accessToken, language, options);

  const getIframeProps = concept => {
    return {
      src: `https://liste.ndla.no/concepts/${concept.id}`,
    };
  };

  const getMetaData = embed => {
    const { concept } = embed;
    const iframeProps = getIframeProps(concept);
    return {
      title: concept.title.title,
      copyright: concept.copyright,
      src: iframeProps.src,
    };
  };

  const renderMarkdown = text => {
    const md = new Remarkable();
    md.inline.ruler.enable(['sub', 'sup']);
    const rendered = md.render(text);
    return (
      <Fragment>
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      </Fragment>
    );
  };

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
    const {
      id,
      title: { title },
      content: { content },
      metaImage,
    } = embed.concept;

    const copyright = defined(embed.concept.copyright, {});
    const authors = defined(copyright.creators, []).map(author => author.name);
    const license = defined(copyright.license, {}).license;
    const source = defined(embed.concept.source, '');
    return render(
      <Notion
        id={`notion_id_${id}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={title}
        content={
          <Fragment>
            <NotionDialogContent>
              {metaImage?.url && (
                <NotionDialogImage src={metaImage.url} alt={metaImage.alt} />
              )}
              <NotionDialogText>{renderMarkdown(content)}</NotionDialogText>
            </NotionDialogContent>
            <NotionDialogLicenses
              license={license}
              source={source}
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
    getMetaData,
    onError,
    fetchResource,
    embedToHTML,
  };
}
