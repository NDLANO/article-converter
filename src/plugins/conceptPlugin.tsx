/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Notion, { NotionDialogContent, NotionDialogLicenses, NotionDialogText } from '@ndla/notion';
import { IConcept, ICopyright } from '@ndla/types-concept-api';
import type { NotionVisualElementType } from '@ndla/ui';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { Remarkable } from 'remarkable';
import parse from 'html-react-parser';
import { fetchConcept } from '../api/conceptApi';
import config from '../config';
import { ApiOptions, Embed, LocaleType, PlainEmbed, Plugin, TransformOptions } from '../interfaces';
import { ConceptBlock, transformVisualElement } from '../utils/conceptHelpers';
import { render } from '../utils/render';
import { parseHtml } from '../utils/htmlParser';

const StyledDiv = styled.div`
  width: 100%;
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
  return parse(md.render(text));
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
      title={concept.title?.title ?? ''}
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

  return render(
    <div>
      <ConceptBlock concept={concept} visualElement={embed.transformedVisualElement} fullWidth />
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
    const visualElement = concept.concept.visualElement?.visualElement;
    if (visualElement) {
      const transformedVisualElement = await transformVisualElement(
        visualElement,
        apiOptions,
        options,
      );

      if (!transformedVisualElement) {
        return concept;
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
    // Concept not found, just display the text
    const { linkText } = embed.data;
    return linkText;
  };

  const embedToHTML = async (embed: TransformedConceptEmbedType, locale: LocaleType) => {
    const visualElement = embed.concept.visualElement ?? {
      visualElement: '',
    };

    const transformed = await options.transform?.(
      parseHtml(visualElement.visualElement),
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
