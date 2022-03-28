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
import { AudioEmbedType, AudioMetaData, AudioPlugin } from './plugins/audioPlugin';
import { ContentLinkEmbedType, ContentLinkPlugin } from './plugins/contentLinkPlugin';
import {
  BrightcoveEmbedType,
  BrightcoveMetaData,
  BrightcovePlugin,
} from './plugins/brightcovePlugin';
import { OembedEmbedType, OembedPlugin } from './plugins/externalPlugin';
import { H5PEmbedType, H5PMetaData, H5PPlugin } from './plugins/h5pPlugin';
import { ImageEmbedType, ImageMetaData, ImagePlugin } from './plugins/imagePlugin';
import { RelatedContentEmbedType, RelatedContentPlugin } from './plugins/relatedContentPlugin';
import { ConceptEmbedType, ConceptMetaData, ConceptPlugin } from './plugins/conceptPlugin';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export type EmbedMetaData =
  | AudioMetaData
  | BrightcoveMetaData
  | ConceptMetaData
  | H5PMetaData
  | ImageMetaData;

export type ResponseHeaders = Record<string, string>;
export type EmbedToHTMLReturnObj = {
  html: string;
  responseHeaders?: ResponseHeaders[];
};

export interface Plugin<E extends EmbedType, M = EmbedMetaData> {
  resource: string;
  embedToHTML: (embed: E, lang: LocaleType) => Promise<EmbedToHTMLReturnObj>;
  fetchResource?: (
    embed: EmbedType,
    accessToken: string,
    lang: LocaleType,
    feideToken: string,
  ) => Promise<E>;
  getMetaData?: (embed: E, lang: LocaleType) => Promise<M | undefined>;
  onError?: (embed: E, lang: LocaleType) => string;
}

export interface BaseEmbedType {
  embed: Cheerio<Element>;
  status?: string;
  responseHeaders?: ResponseHeaders;
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
  | ConceptEmbedType
  | EmbedType;

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
