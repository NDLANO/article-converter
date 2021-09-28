/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EmbedType } from '../interfaces';

class FootNoteCounter {
  private count: number;
  constructor(initialCount: number = 0) {
    this.count = initialCount;
  }

  getNextCount() {
    this.count = this.count + 1;
    return this.count;
  }
}

export default function createFootnotePlugin() {
  const metaDataCounter = new FootNoteCounter();
  const embedToHTMLCounter = new FootNoteCounter();

  const getMetaData = (embed: EmbedType) => {
    const footNoteEntryNum = metaDataCounter.getNextCount();

    const authors = (embed.data.authors as string).split(';');
    const year = (embed.data.year as number).toString();

    return {
      ...embed.data,
      ref: footNoteEntryNum,
      authors,
      year,
    };
  };

  const embedToHTML = () => {
    const footNoteEntryNum = embedToHTMLCounter.getNextCount();
    return `<span id="ref${footNoteEntryNum}" class="c-footnotes__ref"><sup><a href="#note${footNoteEntryNum}" target="_self">[${footNoteEntryNum}]</a></sup></span>`;
  };

  return {
    resource: 'footnote',
    getMetaData,
    embedToHTML,
  };
}
