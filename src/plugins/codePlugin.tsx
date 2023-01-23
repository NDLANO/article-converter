/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import he from 'he';
import { Codeblock } from '@ndla/code';
import { renderString } from '../utils/render';
import { Plugin, Embed, TransformOptions } from '../interfaces';

export interface CodeEmbed extends Embed<CodeEmbedData> {}

export interface CodePlugin extends Plugin<CodeEmbed, CodeEmbedData> {
  resource: 'code-block';
}

export interface CodeEmbedData {
  resource: 'code-block';
  codeFormat: string;
  codeContent: string;
  title?: string;
}

export default function createCodePlugin({ lang }: TransformOptions): CodePlugin {
  const embedToHTML = async (embed: CodeEmbed) => {
    const { title, codeContent, codeFormat } = embed.data;
    return {
      html: renderString(
        <figure className="c-figure">
          <Codeblock title={title} code={he.decode(codeContent)} format={codeFormat} showCopy />
        </figure>,
        lang,
      ),
    };
  };

  return { resource: 'code-block', embedToHTML };
}
