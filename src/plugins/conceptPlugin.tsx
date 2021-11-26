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
// @ts-ignore
import Notion, { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import { breakpoints, mq } from '@ndla/core';
import { css } from '@emotion/core';
import { ConceptApiType, fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';
import config from '../config';
import { getCopyString } from './pluginHelpers';
import { EmbedType, LocaleType, TransformOptions, Plugin } from '../interfaces';

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

export interface ConceptEmbedType extends EmbedType {
  concept: ConceptApiType;
}

export interface ConceptPlugin extends Plugin<ConceptEmbedType> {
  resource: 'concept';
}

export default function createConceptPlugin(options: TransformOptions = {}): ConceptPlugin {
  const fetchResource = (embed: EmbedType, accessToken: string, language: LocaleType) =>
    fetchConcept(embed, accessToken, language, options);

  const getEmbedSrc = (concept: ConceptApiType) =>
    `${config.listingFrontendDomain}/concepts/${concept.id}`;

  const getMetaData = async (embed: ConceptEmbedType, locale: LocaleType) => {
    const { concept } = embed;
    if (concept) {
      const { title, copyright, source } = concept;
      const copyString = getCopyString(title?.title, source, options.path, copyright, locale);
      return {
        title: concept.title?.title,
        copyright: concept.copyright,
        src: getEmbedSrc(concept),
        copyText: copyString,
      };
    }
  };

  const renderMarkdown = (text: string) => {
    const md = new Remarkable();
    md.inline.ruler.enable(['sub', 'sup']);
    const rendered = md.render(text);
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  const onError = (embed: ConceptEmbedType, locale: LocaleType) => {
    const { contentId, linkText } = embed.data;
    return render(
      <Notion
        id={`notion_id_${contentId}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={t(locale, 'concept.error.title')}
        content={
          <NotionDialogContent>
            <NotionDialogText>{t(locale, 'concept.error.content')}</NotionDialogText>
          </NotionDialogContent>
        }>
        {linkText}
      </Notion>,
      locale,
    );
  };

  const embedToHTML = async (embed: ConceptEmbedType, locale: LocaleType) => {
    const concept = embed.concept;

    const visualElement = defined(embed.concept.visualElement, {
      visualElement: '',
    });
    const copyright = concept.copyright;
    const authors = (copyright?.creators ?? []).map((author) => author.name);
    const license = copyright?.license?.license;
    const source = concept.source ?? '';

    const transformed = await options.transform?.(
      cheerio.load(visualElement.visualElement),
      {}, // TODO: This might need to be returned as well?
      locale,
      '',
      '',
      undefined,
      { concept: true },
    );
    return render(
      <Notion
        id={`notion_id_${concept.id}_${locale}`}
        ariaLabel={t(locale, 'concept.showDescription')}
        title={concept.title?.title}
        customCSS={customNotionStyle}
        content={
          <>
            <NotionDialogContent>
              {transformed?.html && (
                <StyledDiv dangerouslySetInnerHTML={{ __html: transformed.html }} />
              )}
              <NotionDialogText>{renderMarkdown(concept.content?.content ?? '')}</NotionDialogText>
            </NotionDialogContent>
            <NotionDialogLicenses license={license} source={source} authors={authors} />
          </>
        }>
        {embed.data.linkText}
      </Notion>,
      locale,
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
