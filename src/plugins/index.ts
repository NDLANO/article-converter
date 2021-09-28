/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-ignore
import createNRKPlugin from './nrkPlugin';
// @ts-ignore
import createAudioPlugin from './audioPlugin';
// @ts-ignore
import createImagePlugin from './imagePlugin';
// @ts-ignore
import createBrightcovePlugin from './brightcovePlugin';
// @ts-ignore
import createH5pPlugin from './h5pPlugin';
// @ts-ignore
import createExternalPlugin from './externalPlugin';
// @ts-ignore
import createContentLinkPlugin from './contentLinkPlugin';
// @ts-ignore
import createErrorPlugin from './errorPlugin';
// @ts-ignore
import createIframePlugin from './iframePlugin';
// @ts-ignore
import createFootnotePlugin from './footNotePlugin';
// @ts-ignore
import createConceptPlugin from './conceptPlugin';
// @ts-ignore
import createRelatedContent from './relatedContentPlugin';
// @ts-ignore
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

interface PluginOptions {}

export interface EmbedMetaData extends Record<string, unknown> {
  ref?: number;
  authors?: string[];
  year?: string;
  title?: string;
  description?: string;
}

export interface Plugin {
  resource: string;

  fetchResource: (embed: EmbedType, accessToken?: string, lang?: LocaleType) => EmbedType;
  embedToHTML: (embed: EmbedType, lang: LocaleType) => string;
  getMetaData?: (embed: EmbedType, lang: LocaleType) => EmbedMetaData;
  onError?: (embed: EmbedType, lang: LocaleType) => string;
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
