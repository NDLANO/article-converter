/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import cheerio from 'cheerio';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import Notion, {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
} from '@ndla/notion';
import { breakpoints, mq } from '@ndla/core';
import { css } from '@emotion/core';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';
import { transform } from '../transformers';
import config from '../config';

const StyledDiv = styled.div`
  width: 100%;
`;

const customNotionStyle = css`
  left: 0;
  margin-left: 0;
  width: 100%;

  ${mq.range({ until: breakpoints.mobileWide })} {
    left: 0;
    margin-left: 0;
    width: 100%;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    left: 0;
    margin-left: 0;
    width: 100%;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    left: 0;
    margin-left: 0;
    width: 100%;
  }
`;

export default function createConceptPlugin(options = {}) {
  const fetchResource = (embed, accessToken, language) =>
    fetchConcept(embed, accessToken, language, options);

  const getEmbedSrc = concept =>
    `${config.listingFrontendDomain}/concepts/${concept.id}`;

  const getMetaData = embed => {
    const { concept } = embed;
    if (concept) {
      return {
        title: concept.title.title,
        copyright: concept.copyright,
        src: getEmbedSrc(concept),
      };
    }
  };

  const renderMarkdown = text => {
    const md = new Remarkable();
    md.inline.ruler.enable(['sub', 'sup']);
    const rendered = md.render(text);
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
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

  const embedToHTML = async (embed, locale) => {
    const {
      id,
      title: { title },
      content: { content },
    } = embed.concept;

    const visualElement = defined(embed.concept.visualElement, {
      visualElement: '',
    });
    const copyright = defined(embed.concept.copyright, {});
    const authors = defined(copyright.creators, []).map(author => author.name);
    const license = defined(copyright.license, {}).license;
    const source = defined(embed.concept.source, '');

    const transformed = await transform(
      cheerio.load(visualElement.visualElement),
      locale,
      '',
      undefined,
      { concept: true }
    );
    return render(
      <Notion
        id={`notion_id_${id}_${locale}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={title}
        customCSS={customNotionStyle}
        content={
          <>
            <NotionDialogContent>
              {transformed.html && (
                <StyledDiv
                  dangerouslySetInnerHTML={{ __html: transformed.html }}
                />
              )}
              <NotionDialogText>{renderMarkdown(content)}</NotionDialogText>
            </NotionDialogContent>
            <NotionDialogLicenses
              license={license}
              source={source}
              authors={authors}
            />
          </>
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
