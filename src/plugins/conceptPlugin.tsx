/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import cheerio from 'cheerio';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
// @ts-ignore
import Notion, {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
  NotionHeaderWithoutExitButton,
} from '@ndla/notion';
import { IConcept } from '@ndla/types-concept-api';
import { breakpoints, mq, spacing } from '@ndla/core';
import { uniqueId } from 'lodash';
import { css } from '@emotion/core';
import { fetchConcept } from '../api/conceptApi';
import t from '../locale/i18n';
import { render } from '../utils/render';
import config from '../config';
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

const StyledNotionHeaderWrapper = styled.div`
  div {
    margin: ${spacing.normal} 0 ${spacing.small};
  }
`;

export interface ConceptEmbedType extends EmbedType {
  concept: IConcept;
}

export interface ConceptPlugin extends Plugin<ConceptEmbedType> {
  resource: 'concept';
}

const renderMarkdown = (text: string) => {
  const md = new Remarkable();
  md.inline.ruler.enable(['sub', 'sup']);
  const rendered = md.render(text);
  return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
};

const renderInline = (
  embed: ConceptEmbedType,
  transformedHTML: string | null | undefined,
  locale: LocaleType,
) => {
  const {
    data: { linkText },
    concept,
  } = embed;

  const id = uniqueId();
  const children = typeof linkText === 'string' ? linkText : undefined;

  const copyright = concept.copyright;
  const authors = (copyright?.creators ?? []).map((author) => author.name);
  const license = copyright?.license?.license;
  const source = concept.source ?? '';
  return render(
    <Notion
      id={`notion_id_${id}_${locale}`}
      ariaLabel={t(locale, 'concept.showDescription')}
      title={concept.title?.title ?? ''}
      customCSS={customNotionStyle}
      content={
        <>
          <NotionDialogContent>
            {transformedHTML && <StyledDiv dangerouslySetInnerHTML={{ __html: transformedHTML }} />}
            <NotionDialogText>{renderMarkdown(concept.content?.content ?? '')}</NotionDialogText>
          </NotionDialogContent>
          <NotionDialogLicenses
            license={license}
            source={renderMarkdown(source)}
            authors={authors}
          />
        </>
      }>
      {children}
    </Notion>,
    locale,
  );
};

const renderBlock = (
  embed: ConceptEmbedType,
  transformedHTML: string | null | undefined,
  locale: LocaleType,
) => {
  const { concept } = embed;

  const copyright = concept.copyright;
  const authors = (copyright?.creators ?? []).map((author) => author.name);
  const license = copyright?.license?.license;
  const source = concept.source ?? '';
  return render(
    <div>
      <StyledNotionHeaderWrapper>
        <NotionHeaderWithoutExitButton title={concept.title?.title ?? ''} />
      </StyledNotionHeaderWrapper>
      <NotionDialogContent>
        {transformedHTML && <StyledDiv dangerouslySetInnerHTML={{ __html: transformedHTML }} />}
        <NotionDialogText>{renderMarkdown(concept.content?.content ?? '')}</NotionDialogText>
      </NotionDialogContent>
      <NotionDialogLicenses license={license} source={renderMarkdown(source)} authors={authors} />
    </div>,
    locale,
  );
};

export default function createConceptPlugin(options: TransformOptions = {}): ConceptPlugin {
  const fetchResource = (embed: EmbedType, accessToken: string, language: LocaleType) =>
    fetchConcept(embed, accessToken, language, options);

  const getEmbedSrc = (concept: IConcept) =>
    `${config.listingFrontendDomain}/concepts/${concept.id}`;

  const getMetaData = async (embed: ConceptEmbedType, locale: LocaleType) => {
    const { concept } = embed;
    if (concept) {
      return {
        title: concept.title?.title,
        copyright: concept.copyright,
        src: getEmbedSrc(concept),
      };
    }
  };

  const onError = (embed: ConceptEmbedType, locale: LocaleType) => {
    const { contentId, linkText } = embed.data;

    const children = typeof linkText === 'string' ? linkText : undefined;
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
        {children}
      </Notion>,
      locale,
    );
  };

  const embedToHTML = async (embed: ConceptEmbedType, locale: LocaleType) => {
    const visualElement = embed.concept.visualElement ?? {
      visualElement: '',
    };

    const transformed = await options.transform?.(
      cheerio.load(visualElement.visualElement),
      {},
      locale,
      '',
      '',
      undefined,
      { concept: true },
    );

    const responseHeaders = transformed?.responseHeaders ? [transformed.responseHeaders] : [];

    if (embed.data.type === 'block') {
      return {
        responseHeaders,
        html: renderBlock(embed, transformed?.html, locale),
      };
    }

    return {
      responseHeaders,
      html: renderInline(embed, transformed?.html, locale),
    };
  };

  return {
    resource: 'concept',
    getMetaData,
    onError,
    fetchResource,
    embedToHTML,
  };
}
