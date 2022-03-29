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
import { Plugin, EmbedType } from '../interfaces';

export interface CodeEmbedType extends EmbedType<CodeEmbedData> {}

export interface CodePlugin extends Plugin<CodeEmbedType, CodeEmbedData> {
  resource: 'code-block';
}

export interface CodeEmbedData {
  resource: 'code-block';
  codeFormat: string;
  codeContent: string;
  title?: string;
}

export default function createCodePlugin(): CodePlugin {
  const embedToHTML = async (embed: CodeEmbedType) => {
    const { title, codeContent, codeFormat } = embed.data;
    return {
      html: renderString(
        <figure className="c-figure">
          <Codeblock title={title} code={he.decode(codeContent)} format={codeFormat} showCopy />
        </figure>,
      ),
    };
  };

  return { resource: 'code-block', embedToHTML };
}
