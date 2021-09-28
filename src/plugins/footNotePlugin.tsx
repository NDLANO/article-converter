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

  const getMetaData = (embed) => {
    const footNoteEntryNum = metaDataCounter.getNextCount();

    return {
      ...embed.data,
      ref: footNoteEntryNum,
      authors: embed.data.authors.split(';'),
      year: embed.data.year.toString(),
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
