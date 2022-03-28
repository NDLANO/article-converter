/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cheerio, Element } from 'cheerio';
import { IArticleV2 } from '@ndla/types-article-api';
import { TransformFunction } from './transformers';
import { AudioEmbedType, AudioPlugin } from './plugins/audioPlugin';
import { ContentLinkEmbedType, ContentLinkPlugin } from './plugins/contentLinkPlugin';
import { BrightcoveEmbedType, BrightcovePlugin } from './plugins/brightcovePlugin';
import { OembedEmbedType, OembedPlugin } from './plugins/externalPlugin';
import { H5PEmbedType, H5PPlugin } from './plugins/h5pPlugin';
import { ImageEmbedType, ImagePlugin } from './plugins/imagePlugin';
import { RelatedContentEmbedType, RelatedContentPlugin } from './plugins/relatedContentPlugin';
import { ConceptEmbedType, ConceptPlugin } from './plugins/conceptPlugin';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export interface EmbedMetaData extends Record<string, unknown> {
  ref?: number;
  authors?: string[];
  year?: string;
  title?: string;
  description?: string;
}

export type ResponseHeaders = Record<string, string>;
export type EmbedToHTMLReturnObj = {
  html: string;
  responseHeaders?: ResponseHeaders[];
};

export interface Plugin<E extends EmbedType> {
  resource: string;
  embedToHTML: (embed: E, lang: LocaleType) => Promise<EmbedToHTMLReturnObj>;
  fetchResource?: (
    embed: EmbedType,
    accessToken: string,
    lang: LocaleType,
    feideToken: string,
  ) => Promise<E>;
  getMetaData?: (embed: E, lang: LocaleType) => Promise<EmbedMetaData | undefined>;
  onError?: (embed: E, lang: LocaleType) => string;
}

export interface EmbedType {
  embed: Cheerio<Element>;
  data: Record<string, unknown>;
  status?: string;
  responseHeaders?: ResponseHeaders;
}

export type EmbedUnion =
  | AudioEmbedType
  | BrightcoveEmbedType
  | ContentLinkEmbedType
  | OembedEmbedType
  | H5PEmbedType
  | ImageEmbedType
  | RelatedContentEmbedType
  | ConceptEmbedType;

export type PluginUnion =
  | Plugin<EmbedType>
  | AudioPlugin
  | BrightcovePlugin
  | ContentLinkPlugin
  | OembedPlugin
  | H5PPlugin
  | ImagePlugin
  | RelatedContentPlugin
  | ConceptPlugin;

export interface TransformOptions {
  absoluteUrl?: boolean;
  concept?: boolean;
  draftConcept?: boolean;
  isOembed?: boolean;
  path?: string;
  shortPath?: string;
  previewH5p?: boolean;
  previewAlt?: boolean;
  showVisualElement?: boolean;
  subject?: string;
  transform?: TransformFunction;
}

type TransformedFields = 'title' | 'content' | 'tags' | 'introduction' | 'metaDescription';
export interface TransformedArticle extends Omit<IArticleV2, TransformedFields> {
  title: string;
  content: string;
  metaData: { copyText: string };
  tags: string[];
  introduction?: string;
  metaDescription: string;
  headerData: Record<string, string>;
}

export interface Author {
  name: string;
  type: string;
}
