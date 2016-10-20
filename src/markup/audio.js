/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { audioFilesI18N, titlesI18N } from '../utils/i18nFieldFinder';

export default (audio, lang) => {
  const title = titlesI18N(audio, lang, true);
  const audioFiles = audioFilesI18N(audio, lang, true);
  return `<figure class="article_audio"><audio controls type="${audioFiles.mimeType}" src="${audioFiles.url}"></audio><figcaption>${title}</figcaption></figure>`;
};
