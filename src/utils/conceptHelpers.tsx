import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import { ConceptNotion } from '@ndla/ui';
import { NotionVisualElementType } from '@ndla/ui/lib/Notion/NotionVisualElement';
import cheerio from 'cheerio';
import React from 'react';
import { LocaleType, TransformOptions } from '../interfaces';
import { getEmbedsFromHtml } from '../parser';
import createPlugins from '../plugins';
import { getEmbedsResources } from '../transformers';

interface ConceptBlockProps {
  concept: IConcept | IConceptSummary;
  visualElement: NotionVisualElementType | undefined;
}

export const ConceptBlock = ({ concept, visualElement }: ConceptBlockProps) => {
  const image = concept.metaImage && {
    alt: concept.metaImage.alt,
    src: concept.metaImage.url,
  };

  return (
    <ConceptNotion
      concept={{
        ...concept,
        text: concept.content?.content ?? '',
        title: concept.title?.title ?? '',
        image,
        visualElement,
      }}
      disableScripts={true}
    />
  );
};

export const transformVisualElement = async (
  visualElement: string | undefined,
  accessToken: string,
  language: LocaleType,
  feideToken: string,
  options: TransformOptions,
): Promise<NotionVisualElementType | undefined> => {
  if (!visualElement) {
    return;
  }
  const plugins = createPlugins(options);
  const embeds = await getEmbedsFromHtml(cheerio.load(visualElement));
  const embedsWithResources = await getEmbedsResources(
    embeds,
    accessToken,
    feideToken,
    language,
    plugins,
  );
  const embed = embedsWithResources[0];

  if ('image' in embed) {
    const { image } = embed;
    return {
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
    return {
      resource: data.resource,
      url: data.url,
      title: data.url,
    };
  }

  if ('brightcove' in embed) {
    const { brightcove } = embed;

    return {
      resource: 'brightcove',
      url: brightcove.link?.url,
      title: brightcove.name,
      copyright: brightcove.copyright,
    };
  }

  if (embed.data.resource === 'h5p') {
    const { data } = embed;
    return {
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
  return;
};
