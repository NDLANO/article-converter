/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Codeblock } from '@ndla/ui';
import { renderString } from '../utils/render';

export default function createCodePlugin(options = {}) {
  const embedToHTML = embed => {
    const { codeContent, codeFormat } = embed.data;
    return renderString(<Codeblock code={codeContent} format={codeFormat} />);
  };

  return {
    resource: 'code-block',
    embedToHTML,
  };
}
