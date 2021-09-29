/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createNRKPlugin from './nrkPlugin';
import createAudioPlugin, { AudioPlugin } from './audioPlugin';
import createImagePlugin, { ImagePlugin } from './imagePlugin';
import createBrightcovePlugin, { BrightcovePlugin } from './brightcovePlugin';
import createH5pPlugin, { H5PPlugin } from './h5pPlugin';
import createExternalPlugin, { OembedPlugin } from './externalPlugin';
import createContentLinkPlugin, { ContentLinkPlugin } from './contentLinkPlugin';
import createErrorPlugin from './errorPlugin';
import createIframePlugin from './iframePlugin';
import createFootnotePlugin from './footNotePlugin';
import createConceptPlugin, { ConceptPlugin } from './conceptPlugin';
import createRelatedContent, { RelatedContentPlugin } from './relatedContentPlugin';
import createCodePlugin from './codePlugin';
import { EmbedType, LocaleType, TransformOptions } from '../interfaces';

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

export interface EmbedMetaData extends Record<string, unknown> {
  ref?: number;
  authors?: string[];
  year?: string;
  title?: string;
  description?: string;
}

export interface Plugin<ET extends EmbedType = EmbedType> {
  resource: string;
  embedToHTML: (embed: ET, lang: LocaleType) => Promise<string>;
  fetchResource?: (embed: EmbedType, accessToken: string, lang: LocaleType) => Promise<ET>;
  getMetaData?: (embed: ET, lang: LocaleType) => Promise<EmbedMetaData | undefined>;
  onError?: (embed: ET, lang: LocaleType) => string;
}

export type PluginUnion =
  | Plugin
  | AudioPlugin
  | BrightcovePlugin
  | ContentLinkPlugin
  | OembedPlugin
  | H5PPlugin
  | ImagePlugin
  | RelatedContentPlugin
  | ConceptPlugin;

const plugins = (options: TransformOptions): PluginUnion[] => [
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
