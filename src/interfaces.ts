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
import { TransformFunction } from './transformers';

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;
export type LocaleType = typeof LOCALE_VALUES[number];

export type EmbedType = {
  embed: Cheerio<Element>;
  data: Record<string, unknown>;
  plugin?: Plugin;
  status?: string;
};

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
