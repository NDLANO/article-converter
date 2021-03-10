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

export default function createCodePlugin(options = {}) {
  const embedToHTML = embed => {
    const { title, codeContent, codeFormat } = embed.data;
    return renderString(
      <figure className="c-figure">
        <Codeblock
          title={title}
          code={he.decode(codeContent)}
          format={codeFormat}
          showCopy
        />
      </figure>
    );
  };

  return { resource: 'code-block', embedToHTML };
}
