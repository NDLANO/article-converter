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

  const getMetaData = (embed, context) => {
    const footNoteEntryNum = metaDataCounter.getNextCount();

    return {
      ...context,
      [`ref_${footNoteEntryNum}`]: {
        ...embed.data,
        authors: embed.data.authors.split(';'),
        resource: undefined,
      },
    };
  };

  const embedToHTML = (embed, _, context) => {
    const footNoteEntryNum = embedToHTMLCounter.getNextCount();

    embed.embed.replaceWith(
      `<a href="#ref_${footNoteEntryNum}_cite" name="ref_${footNoteEntryNum}_sup"><sup>${footNoteEntryNum}</sup></a>`
    );

    return {
      ...context,
      [`ref_${footNoteEntryNum}`]: {
        ...embed.data,
        authors: embed.data.authors.split(';'),
        resource: undefined,
      },
    };
  };

  return {
    resource: 'footnote',
    getMetaData,
    embedToHTML,
  };
}
