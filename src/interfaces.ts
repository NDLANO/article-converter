/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cheerio, Element } from 'cheerio';
import { ArticleApiArticle } from './api/articleApi';
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

export interface Plugin<E extends EmbedType> {
  resource: string;
  embedToHTML: (embed: E, lang: LocaleType) => Promise<string>;
  fetchResource?: (embed: EmbedType, accessToken: string, lang: LocaleType) => Promise<E>;
  getMetaData?: (embed: E, lang: LocaleType) => Promise<EmbedMetaData | undefined>;
  onError?: (embed: E, lang: LocaleType) => string;
}

export interface EmbedType {
  embed: Cheerio<Element>;
  data: Record<string, unknown>;
  status?: string;
}

export interface EmbedTypeWithPlugin<E extends EmbedType> extends EmbedType {
  plugin: Plugin<E>;
}

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

export type EmbedTypeUnion =
  | EmbedType
  | AudioEmbedType
  | BrightcoveEmbedType
  | ContentLinkEmbedType
  | OembedEmbedType
  | H5PEmbedType
  | ImageEmbedType
  | RelatedContentEmbedType
  | ConceptEmbedType;

export interface TransformOptions {
  concept?: boolean;
  draftConcept?: boolean;
  filters?: string;
  isOembed?: boolean;
  path?: string;
  previewH5p?: boolean;
  showVisualElement?: boolean;
  subject?: string;
  transform?: TransformFunction;
}

type TransformedFields = 'title' | 'content' | 'tags' | 'introduction' | 'metaDescription';
export interface TransformedArticle extends Omit<ArticleApiArticle, TransformedFields> {
  title: string;
  content: string;
  metaData: { copyText: string };
  tags: string[];
  introduction?: string;
  metaDescription: string;
}

export interface Author {
  name: string;
  type: string;
}
