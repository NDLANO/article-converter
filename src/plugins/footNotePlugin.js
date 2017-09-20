/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function createFootnotePlugin() {
  const embedToHTML = (embed, _, context) => {
    const footNoteEntryNum = Object.keys(context).length + 1;

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
    embedToHTML,
  };
}
