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
import { EmbedType } from '../interfaces';
import { Plugin } from './index';

export default function createCodePlugin(): Plugin {
  const embedToHTML = async (embed: EmbedType) => {
    const { title, codeContent, codeFormat } = embed.data as Record<string, string>;
    return renderString(
      <figure className="c-figure">
        <Codeblock title={title} code={he.decode(codeContent)} format={codeFormat} showCopy />
      </figure>,
    );
  };

  return { resource: 'code-block', embedToHTML };
}
