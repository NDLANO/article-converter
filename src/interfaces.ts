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
import { AudioEmbedData, AudioEmbed, AudioMetaData, AudioPlugin } from './plugins/audioPlugin';
import {
  ContentLinkEmbedData,
  ContentLinkEmbed,
  ContentLinkPlugin,
} from './plugins/contentLinkPlugin';
import {
  BrightcoveEmbedData,
  BrightcoveEmbed,
  BrightcoveMetaData,
  BrightcovePlugin,
} from './plugins/brightcovePlugin';
import { OembedEmbedData, OembedEmbed, OembedPlugin } from './plugins/externalPlugin';
import { H5pEmbedData, H5PEmbed, H5PMetaData, H5PPlugin } from './plugins/h5pPlugin';
import { ImageEmbedData, ImageEmbed, ImageMetaData, ImagePlugin } from './plugins/imagePlugin';
import {
  RelatedContentEmbedData,
  RelatedContentEmbed,
  RelatedContentPlugin,
} from './plugins/relatedContentPlugin';
import {
  ConceptEmbedData,
  ConceptEmbed,
  ConceptMetaData,
  ConceptPlugin,
} from './plugins/conceptPlugin';
import { NRKEmbedData, NRKEmbed, NRKPlugin } from './plugins/nrkPlugin';
import { IframeEmbedData, IframeEmbed, IframePlugin } from './plugins/iframePlugin';
import {
  FootnoteEmbedData,
  FootnoteEmbed,
  FootnoteMetaData,
  FootnotePlugin,
} from './plugins/footNotePlugin';
import { ErrorEmbedData, ErrorEmbed, ErrorPlugin } from './plugins/errorPlugin';
import { CodeEmbedData, CodeEmbed, CodePlugin } from './plugins/codePlugin';
import {
  ConceptListEmbed,
  ConceptListEmbedData,
  ConceptListPlugin,
} from './plugins/conceptListPlugin';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export type ResponseHeaders = Record<string, string>;
export type EmbedToHTMLReturnObj = {
  html: string;
  responseHeaders?: ResponseHeaders[];
};

type EmbedMetaData =
  | AudioMetaData
  | BrightcoveMetaData
  | ConceptMetaData
  | H5PMetaData
  | ImageMetaData
  | FootnoteMetaData;

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
  | FootnoteEmbedData
  | ConceptListEmbedData;

export interface PlainEmbed<T = EmbedData> {
  embed: Cheerio<Element>;
  status?: string;
  data: T;
}
export interface Embed<T> extends PlainEmbed<T> {
  responseHeaders?: ResponseHeaders;
}

export type AnyEmbed =
  | PlainEmbed
  | AudioEmbed
  | BrightcoveEmbed
  | ContentLinkEmbed
  | OembedEmbed
  | H5PEmbed
  | ImageEmbed
  | RelatedContentEmbed
  | ConceptEmbed
  | NRKEmbed
  | IframeEmbed
  | ErrorEmbed
  | CodeEmbed
  | FootnoteEmbed
  | ConceptListEmbed;

export interface Plugin<E extends AnyEmbed, D extends EmbedData, M = EmbedMetaData> {
  resource: string;
  embedToHTML: (embed: E, lang: LocaleType) => Promise<EmbedToHTMLReturnObj>;
  fetchResource?: (embed: PlainEmbed<D>, apiOptions: ApiOptions) => Promise<E>;
  getMetaData?: (embed: E, lang: LocaleType) => Promise<M | undefined>;
  onError?: (embed: E, lang: LocaleType) => string;
}

export type AnyPlugin =
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
  | CodePlugin
  | ConceptListPlugin;

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

export interface ApiOptions {
  lang: LocaleType;
  accessToken: string;
  feideToken: string;
  versionHash?: string;
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
