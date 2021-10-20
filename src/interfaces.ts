/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cheerio, Element } from 'cheerio';
import { ArticleApiType } from './api/articleApi';
import { TransformFunction } from './transformers';
import { AudioPlugin } from './plugins/audioPlugin';
import { ContentLinkPlugin } from './plugins/contentLinkPlugin';
import { BrightcovePlugin } from './plugins/brightcovePlugin';
import { OembedPlugin } from './plugins/externalPlugin';
import { H5PPlugin } from './plugins/h5pPlugin';
import { ImagePlugin } from './plugins/imagePlugin';
import { RelatedContentPlugin } from './plugins/relatedContentPlugin';
import { ConceptPlugin } from './plugins/conceptPlugin';

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
export interface TransformedArticle extends Omit<ArticleApiType, TransformedFields> {
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