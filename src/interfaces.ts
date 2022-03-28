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
import { AudioEmbedData, AudioEmbedType, AudioMetaData, AudioPlugin } from './plugins/audioPlugin';
import {
  ContentLinkEmbedData,
  ContentLinkEmbedType,
  ContentLinkPlugin,
} from './plugins/contentLinkPlugin';
import {
  BrightcoveEmbedData,
  BrightcoveEmbedType,
  BrightcoveMetaData,
  BrightcovePlugin,
} from './plugins/brightcovePlugin';
import { OembedEmbedData, OembedEmbedType, OembedPlugin } from './plugins/externalPlugin';
import { H5pEmbedData, H5PEmbedType, H5PMetaData, H5PPlugin } from './plugins/h5pPlugin';
import { ImageEmbedData, ImageEmbedType, ImageMetaData, ImagePlugin } from './plugins/imagePlugin';
import {
  RelatedContentEmbedData,
  RelatedContentEmbedType,
  RelatedContentPlugin,
} from './plugins/relatedContentPlugin';
import {
  ConceptEmbedData,
  ConceptEmbedType,
  ConceptMetaData,
  ConceptPlugin,
} from './plugins/conceptPlugin';
import { NRKEmbedData, NRKEmbedType, NRKPlugin } from './plugins/nrkPlugin';
import { IframeEmbedData, IframeEmbedType, IframePlugin } from './plugins/iframePlugin';
import { FootnoteEmbedData, FootnoteMetaData, FootnotePlugin } from './plugins/footNotePlugin';
import { ErrorEmbedData, ErrorEmbedType, ErrorPlugin } from './plugins/errorPlugin';
import { CodeEmbedData, CodeEmbedType, CodePlugin } from './plugins/codePlugin';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export type EmbedMetaData =
  | AudioMetaData
  | BrightcoveMetaData
  | ConceptMetaData
  | H5PMetaData
  | ImageMetaData
  | FootnoteMetaData;

export type ResponseHeaders = Record<string, string>;
export type EmbedToHTMLReturnObj = {
  html: string;
  responseHeaders?: ResponseHeaders[];
};

export interface Plugin<E extends EmbedUnion, D extends EmbedData, M = EmbedMetaData> {
  resource: string;
  embedToHTML: (embed: E, lang: LocaleType) => Promise<EmbedToHTMLReturnObj>;
  fetchResource?: (
    embed: SimpleEmbedType<D>,
    accessToken: string,
    lang: LocaleType,
    feideToken: string,
  ) => Promise<EmbedUnion>;
  getMetaData?: (embed: E, lang: LocaleType) => Promise<M | undefined>;
  onError?: (embed: E, lang: LocaleType) => string;
}

export interface EmbedType<T> extends SimpleEmbedType<T> {
  embed: Cheerio<Element>;
  responseHeaders?: ResponseHeaders;
  data: T;
}

export type EmbedData =
  | AudioEmbedData
  | BrightcoveEmbedData
  | ContentLinkEmbedData
  | OembedEmbedData
  | H5pEmbedData
  | ImageEmbedData
  | RelatedContentEmbedData
  | ConceptEmbedData
  | NRKEmbedData
  | IframeEmbedData
  | ErrorEmbedData
  | CodeEmbedData
  | FootnoteEmbedData;

export interface SimpleEmbedType<T> {
  embed: Cheerio<Element>;
  status?: string;
  data: T;
}

export type EmbedUnion =
  | SimpleEmbedType<EmbedData>
  | AudioEmbedType
  | BrightcoveEmbedType
  | ContentLinkEmbedType
  | OembedEmbedType
  | H5PEmbedType
  | ImageEmbedType
  | RelatedContentEmbedType
  | ConceptEmbedType
  | NRKEmbedType
  | IframeEmbedType
  | ErrorEmbedType
  | CodeEmbedType;

export type PluginUnion =
  | AudioPlugin
  | BrightcovePlugin
  | ContentLinkPlugin
  | OembedPlugin
  | H5PPlugin
  | ImagePlugin
  | RelatedContentPlugin
  | ConceptPlugin
  | NRKPlugin
  | IframePlugin
  | FootnotePlugin
  | ErrorPlugin
  | CodePlugin;

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
