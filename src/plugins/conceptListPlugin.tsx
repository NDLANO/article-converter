/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { IConceptSummary } from '@ndla/types-concept-api';
import { NotionVisualElementType } from '@ndla/ui/lib/Notion/NotionVisualElement';
import styled from '@emotion/styled';
import { Figure } from '@ndla/ui';
import { fetchConcepts } from '../api/conceptApi';
import { ApiOptions, Embed, LocaleType, PlainEmbed, Plugin, TransformOptions } from '../interfaces';
import { render } from '../utils/render';
import { ConceptBlock, transformVisualElement } from '../utils/conceptHelpers';

export interface ConceptListEmbed extends Embed<ConceptListEmbedData> {
  concepts: IConceptSummary[];
}

export interface TransformedConceptListEmbedType extends ConceptListEmbed {
  transformedConcepts: (IConceptSummary & { transformedVisualElement?: NotionVisualElementType })[];
}

export type ConceptListEmbedData = {
  resource: 'concept-list';
  tag: string;
  title: string;
};

export interface ConceptListPlugin
  extends Plugin<TransformedConceptListEmbedType, ConceptListEmbedData> {
  resource: 'concept-list';
}

const ConceptList = styled.div`
  & > figure:first-of-type {
    margin-top: 32px;
  }
  & li {
    display: block;
  }
`;

const renderConceptList = (embed: TransformedConceptListEmbedType, locale: LocaleType) => {
  const { transformedConcepts } = embed;

  return render(
    <Figure type="full" resizeIframe>
      {embed.data.title && <h2>{embed.data.title}</h2>}
      <ConceptList className="c-concept-list">
        <ul>
          {transformedConcepts.map((concept) => (
            <li>
              <ConceptBlock
                key={concept.id}
                concept={concept}
                visualElement={concept.transformedVisualElement}
              />
            </li>
          ))}
        </ul>
      </ConceptList>
    </Figure>,
    locale,
  );
};

export default function createConceptListPlugin(options: TransformOptions = {}): ConceptListPlugin {
  const getAndResolveConcepts = async (
    embed: PlainEmbed<ConceptListEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<TransformedConceptListEmbedType> => {
    const conceptListEmbed = await fetchConcepts(embed, apiOptions);

    const concepts = conceptListEmbed.concepts;

    const transformedConcepts = await Promise.all(
      concepts.map(async (concept) => {
        const visualElement = concept.visualElement?.visualElement;

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
      }),
    );
    return { ...conceptListEmbed, transformedConcepts };
  };

  const fetchResource = (
    embed: PlainEmbed<ConceptListEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<TransformedConceptListEmbedType> => {
    return getAndResolveConcepts(embed, apiOptions);
  };

  const embedToHTML = async (embed: TransformedConceptListEmbedType, locale: LocaleType) => {
    return { html: renderConceptList(embed, locale) };
  };

  return { resource: 'concept-list', fetchResource, embedToHTML };
}
