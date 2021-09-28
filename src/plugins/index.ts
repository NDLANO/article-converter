/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createNRKPlugin from './nrkPlugin';
// @ts-ignore
import createAudioPlugin from './audioPlugin';
// @ts-ignore
import createImagePlugin from './imagePlugin';
// @ts-ignore
import createBrightcovePlugin from './brightcovePlugin';
// @ts-ignore
import createH5pPlugin from './h5pPlugin';
import createExternalPlugin from './externalPlugin';
// @ts-ignore
import createContentLinkPlugin from './contentLinkPlugin';
import createErrorPlugin from './errorPlugin';
import createIframePlugin from './iframePlugin';
import createFootnotePlugin from './footNotePlugin';
// @ts-ignore
import createConceptPlugin from './conceptPlugin';
// @ts-ignore
import createRelatedContent from './relatedContentPlugin';
import createCodePlugin from './codePlugin';
import { EmbedType, LocaleType } from '../interfaces';

export {
  createNRKPlugin,
  createAudioPlugin,
  createImagePlugin,
  createBrightcovePlugin,
  createH5pPlugin,
  createExternalPlugin,
  createContentLinkPlugin,
  createErrorPlugin,
  createIframePlugin,
  createFootnotePlugin,
  createConceptPlugin,
  createRelatedContent,
  createCodePlugin,
};

export interface PluginOptions {
  concept?: boolean;
  isOembed?: boolean;
  subject?: string;
  filters?: string;
}

export interface EmbedMetaData extends Record<string, unknown> {
  ref?: number;
  authors?: string[];
  year?: string;
  title?: string;
  description?: string;
}

export interface Plugin<ET = EmbedType> {
  resource: string;
  embedToHTML: (embed: ET, lang: LocaleType) => Promise<string>;
  fetchResource?: (embed: EmbedType, accessToken: string, lang: LocaleType) => Promise<ET>;
  getMetaData?: (embed: ET, lang: LocaleType) => EmbedMetaData;
  onError?: (embed: ET, lang: LocaleType) => string;
}

const plugins = (options: PluginOptions): Plugin[] => [
  createNRKPlugin(),
  createAudioPlugin(options),
  createImagePlugin(options),
  createBrightcovePlugin(options),
  createH5pPlugin(options),
  createExternalPlugin(options),
  createContentLinkPlugin(options),
  createErrorPlugin(),
  createIframePlugin(),
  createFootnotePlugin(),
  createConceptPlugin(options),
  createRelatedContent(options),
  createCodePlugin(),
];

export default plugins;
