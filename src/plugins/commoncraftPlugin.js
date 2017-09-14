/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createCommoncraftPlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    embed.embed.replaceWith(
      `<iframe id="cc-embed" src="${url}" width="${width}" height="${height}" frameborder="0" scrolling="false" ></iframe>`
    );
  };

  return {
    resource: 'commoncraft',
    embedToHTML,
  };
}
