/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cheerio, Element } from 'cheerio';
import { Plugin } from './plugins';
import { ArticleApiArticle } from './api/articleApi';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export interface EmbedType {
  embed: Cheerio<Element>;
  data: Record<string, unknown>;
  plugin?: Plugin;
  image?: any;
  status?: string;
}

export interface TransformOptions {
  showVisualElement?: boolean;
  concept?: boolean;
  path?: string;
  draftConcept?: boolean;
  previewH5p?: boolean;
  isOembed?: boolean;
}

type TransformedFields =
  | 'title'
  | 'content'
  | 'tags'
  | 'introduction'
  | 'metaDescription';
export interface TransformedArticle
  extends Omit<ArticleApiArticle, TransformedFields> {
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
