import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import type { NotionVisualElementType } from '@ndla/ui';
import { ConceptNotion } from '@ndla/ui';
import cheerio from 'cheerio';
import React from 'react';
import { ApiOptions, TransformOptions } from '../interfaces';
import { getEmbedsFromHtml } from '../parser';
import createPlugins from '../plugins';
import { getEmbedsResources } from '../transformers';

interface ConceptBlockProps {
  concept: IConcept | IConceptSummary;
  visualElement: NotionVisualElementType | undefined;
  fullWidth?: boolean;
}

const getType = (type: string | undefined) => {
  if (type === 'brightcove') {
    return 'video';
  }
  if (
    type === 'image' ||
    type === 'external' ||
    type === 'iframe' ||
    type === 'h5p' ||
    type === 'video'
  ) {
    return type;
  }
  return undefined;
};

export const ConceptBlock = ({ concept, visualElement, fullWidth }: ConceptBlockProps) => {
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
      hideIconsAndAuthors
      figureType={fullWidth ? 'full' : undefined}
      type={getType(visualElement?.resource)}
      disableScripts={true}
    />
  );
};

export const transformVisualElement = async (
  visualElement: string | undefined,
  apiOptions: ApiOptions,
  options: TransformOptions,
): Promise<NotionVisualElementType | undefined> => {
  if (!visualElement) {
    return;
  }
  const plugins = createPlugins(options);
  const embeds = await getEmbedsFromHtml(cheerio.load(visualElement));
  const embedsWithResources = await getEmbedsResources(embeds, apiOptions, plugins);
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

  if (embed.data.resource === 'external' || embed.data.resource === 'iframe') {
    const { data } = embed;
    return {
      resource: data.resource,
      url: data.url,
      title: data.url,
    };
  }

  if ('brightcove' in embed) {
    const { brightcove } = embed;
    const { account, player, videoid } = embed.data;

    return {
      resource: 'brightcove',
      url: `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
      title: brightcove.name,
      copyright: brightcove.copyright,
    };
  }

  if (embed.data.resource === 'h5p') {
    const { data } = embed;
    const licenseInfo =
      'h5pLicenseInformation' in embed ? embed.h5pLicenseInformation?.h5p : undefined;
    return {
      resource: data.resource,
      url: data.url,
      title: data.title,
      copyright: licenseInfo
        ? {
            creators: licenseInfo.authors.map((author) => ({
              type: author.role,
              name: author.name,
            })),
          }
        : undefined,
    };
  }
  return;
};
