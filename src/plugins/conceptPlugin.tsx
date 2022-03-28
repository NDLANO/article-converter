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
import Notion, { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import { ConceptNotion } from '@ndla/ui';
import { IConcept, ICopyright } from '@ndla/types-concept-api';
import { breakpoints, mq } from '@ndla/core';
import { uniqueId } from 'lodash';
import { css } from '@emotion/core';
import { fetchConcept } from '../api/conceptApi';
import createPlugins from '.';
import t from '../locale/i18n';
import { render } from '../utils/render';
import config from '../config';
import { EmbedType, LocaleType, TransformOptions, Plugin, SimpleEmbedType } from '../interfaces';
import { getEmbedsFromHtml } from '../parser';
import { getEmbedsResources } from '../transformers';

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

export interface ConceptEmbedType extends EmbedType<ConceptEmbedData> {
  concept: IConcept;
}

export type ConceptEmbedData = {
  resource: 'concept';
  contentId: string;
  type: 'block' | 'inline';
  linkText: string;
};

export interface TransformedConceptEmbedType extends ConceptEmbedType {
  transformedVisualElement?: any; // TODO: Any må bort
}

export interface ConceptPlugin extends Plugin<TransformedConceptEmbedType, ConceptEmbedData> {
  resource: 'concept';
}

export interface ConceptMetaData {
  title: string | undefined;
  copyright: ICopyright | undefined;
  src: string;
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

const renderBlock = (embed: TransformedConceptEmbedType, locale: LocaleType) => {
  const { concept } = embed;

  const image = concept.metaImage && {
    alt: concept.metaImage.alt,
    src: concept.metaImage.url,
  };
  const visualElementEmbed = embed.transformedVisualElement && {};
  return render(
    <div>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept.content?.content ?? '',
          title: concept.title?.title ?? '',
          image,
          visualElement: visualElementEmbed,
        }}
      />
    </div>,
    locale,
  );
};

export default function createConceptPlugin(options: TransformOptions = {}): ConceptPlugin {
  const getAndResolveConcept = async (
    embed: SimpleEmbedType<ConceptEmbedData>,
    accessToken: string,
    language: LocaleType,
    feideToken: string,
  ): Promise<TransformedConceptEmbedType> => {
    const concept = await fetchConcept(embed, accessToken, language, options);
    if (concept.concept.visualElement) {
      const plugins = createPlugins(options);
      const embeds = await getEmbedsFromHtml(
        cheerio.load(concept.concept.visualElement.visualElement),
      );
      const embedsWithResources = await getEmbedsResources(
        embeds,
        accessToken,
        feideToken,
        language,
        plugins,
      );
      const embed = embedsWithResources[0];
      let transformedVisualElement;
      const { data } = embed;

      // if ('image' in embed) {
      //   const { image } = embed;
      //   transformedVisualElement = {
      //     resource: 'image',
      //     title: image.title.title,
      //     url: image.metaUrl,
      //     copyright: image.copyright,
      //     image: {
      //       src: image.imageUrl,
      //       alt: image.alttext.alttext,
      //     },
      //   };
      // }
      // if ('brightcove' in embed) {
      //   const { brightcove } = embed;
      //   transformedVisualElement = {
      //     resource: 'brightcove',
      //     url: brightcove.link?.url,
      //     title: brightcove.name,
      //   };
      // }
      // return { ...concept, transformedVisualElement };
    }
    return concept;
  };

  const fetchResource = (
    embed: SimpleEmbedType<ConceptEmbedData>,
    accessToken: string,
    language: LocaleType,
    feideToken: string,
  ): Promise<TransformedConceptEmbedType> => {
    return getAndResolveConcept(embed, accessToken, language, feideToken);
  };

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

  const embedToHTML = async (embed: TransformedConceptEmbedType, locale: LocaleType) => {
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
        html: renderBlock(embed, locale),
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
