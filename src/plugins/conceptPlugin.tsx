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
import { NotionVisualElementType } from '@ndla/ui/lib/Notion/NotionVisualElement';
import { IConcept, ICopyright } from '@ndla/types-concept-api';
import { breakpoints, mq } from '@ndla/core';
import { uniqueId } from 'lodash';
import { css } from '@emotion/core';
import { fetchConcept } from '../api/conceptApi';
import createPlugins from '.';
import t from '../locale/i18n';
import { render } from '../utils/render';
import config from '../config';
import { ApiOptions, Embed, LocaleType, TransformOptions, Plugin, PlainEmbed } from '../interfaces';
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

export interface ConceptEmbed extends Embed<ConceptEmbedData> {
  concept: IConcept;
}

export type ConceptEmbedData = {
  resource: 'concept';
  contentId: string;
  type: 'block' | 'inline';
  linkText: string;
};

export interface TransformedConceptEmbedType extends ConceptEmbed {
  transformedVisualElement?: NotionVisualElementType;
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
  embed: ConceptEmbed,
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

  return render(
    <div>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept.content?.content ?? '',
          title: concept.title?.title ?? '',
          image,
          visualElement: embed.transformedVisualElement,
        }}
        disableScripts={true}
      />
    </div>,
    locale,
  );
};

export default function createConceptPlugin(options: TransformOptions = {}): ConceptPlugin {
  const getAndResolveConcept = async (
    embed: PlainEmbed<ConceptEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<TransformedConceptEmbedType> => {
    const concept = await fetchConcept(embed, apiOptions, options);
    if (concept.concept.visualElement) {
      const plugins = createPlugins(options);
      const embeds = await getEmbedsFromHtml(
        cheerio.load(concept.concept.visualElement.visualElement),
      );
      const embedsWithResources = await getEmbedsResources(embeds, apiOptions, plugins);
      const embed = embedsWithResources[0];
      let transformedVisualElement: NotionVisualElementType | undefined;

      if ('image' in embed) {
        const { image } = embed;
        transformedVisualElement = {
          resource: 'image',
          title: image.title.title,
          url: image.metaUrl,
          copyright: image.copyright,
          image: {
            src: image.imageUrl,
            alt: image.alttext.alttext,
          },
        };
      }

      if (embed.data.resource === 'external') {
        const { data } = embed;
        transformedVisualElement = {
          resource: data.resource,
          url: data.url,
          title: data.url,
        };
      }

      if ('brightcove' in embed) {
        const { brightcove } = embed;

        transformedVisualElement = {
          resource: 'brightcove',
          url: brightcove.link?.url,
          title: brightcove.name,
          copyright: brightcove.copyright,
        };
      }

      if (embed.data.resource === 'h5p') {
        const { data } = embed;
        transformedVisualElement = {
          resource: data.resource,
          url: data.url,
          title: data.title,
          copyright:
            'h5pLicenseInformation' in embed
              ? {
                  creators: embed.h5pLicenseInformation?.h5p.authors.map((author) => ({
                    type: author.role,
                    name: author.name,
                  })),
                }
              : undefined,
        };
      }
      return { ...concept, transformedVisualElement };
    }
    return concept;
  };

  const fetchResource = (
    embed: PlainEmbed<ConceptEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<TransformedConceptEmbedType> => {
    return getAndResolveConcept(embed, apiOptions);
  };

  const getEmbedSrc = (concept: IConcept) =>
    `${config.listingFrontendDomain}/concepts/${concept.id}`;

  const getMetaData = async (embed: ConceptEmbed, locale: LocaleType) => {
    const { concept } = embed;
    if (concept) {
      return {
        title: concept.title?.title,
        copyright: concept.copyright,
        src: getEmbedSrc(concept),
      };
    }
  };

  const onError = (embed: ConceptEmbed, locale: LocaleType) => {
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
      {
        lang: locale,
        accessToken: '',
        feideToken: '',
      },
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
