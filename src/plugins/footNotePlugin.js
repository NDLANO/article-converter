/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function FootNoteCounter(initialCount = 0) {
  this.count = initialCount;

  FootNoteCounter.prototype.getNextCount = function getNextCount() {
    this.count = this.count + 1;
    return this.count;
  };
}

export default function createFootnotePlugin() {
  const metaDataCounter = new FootNoteCounter();
  const embedToHTMLCounter = new FootNoteCounter();

  const getMetaData = embed => {
    const footNoteEntryNum = metaDataCounter.getNextCount();

    return {
      [`ref_${footNoteEntryNum}`]: {
        ...embed.data,
        authors: embed.data.authors.split(';'),
        resource: undefined,
      },
    };
  };

  const embedToHTML = () => {
    const footNoteEntryNum = embedToHTMLCounter.getNextCount();

    return `<a href="#ref_${footNoteEntryNum}_cite" name="ref_${footNoteEntryNum}_sup"><sup>${footNoteEntryNum}</sup></a>`;
  };

  return {
    resource: 'footnote',
    getMetaData,
    embedToHTML,
  };
}
