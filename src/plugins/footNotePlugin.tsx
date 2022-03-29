/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EmbedType, Plugin } from '../interfaces';

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

export interface FootnoteEmbedType extends EmbedType<FootnoteEmbedData> {}

export interface FootnotePlugin
  extends Plugin<FootnoteEmbedType, FootnoteEmbedData, FootnoteMetaData> {
  resource: 'footnote';
}

export interface FootnoteMetaData extends Omit<FootnoteEmbedData, 'authors'> {
  ref: number;
  authors: string[];
}

export interface FootnoteEmbedData {
  resource: 'footnote';
  title: string;
  type: string;
  year: string;
  edition: string;
  publisher: string;
  authors: string;
}

export default function createFootnotePlugin(): FootnotePlugin {
  const metaDataCounter = new FootNoteCounter();
  const embedToHTMLCounter = new FootNoteCounter();

  const getMetaData = async (embed: FootnoteEmbedType) => {
    const footNoteEntryNum = metaDataCounter.getNextCount();

    const authors = (embed.data.authors as string).split(';');
    const year = embed.data.year.toString();

    return {
      ...embed.data,
      ref: footNoteEntryNum,
      authors,
      year,
    };
  };

  const embedToHTML = async () => {
    const footNoteEntryNum = embedToHTMLCounter.getNextCount();
    return {
      html: `<span id="ref${footNoteEntryNum}" class="c-footnotes__ref"><sup><a href="#note${footNoteEntryNum}" target="_self">[${footNoteEntryNum}]</a></sup></span>`,
    };
  };

  return {
    resource: 'footnote',
    getMetaData,
    embedToHTML,
  };
}
