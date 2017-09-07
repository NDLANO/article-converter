/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createNdlaFilmIUndervisningPlugin() {
  const embedToHTML = embed => {
    const { data: { url, width, height }} = embed.data;
    embed.embed.replaceWith(
       `<iframe src="${url}" style="border: none;" frameBorder="0" width="${width}" height="${height}" allowfullscreen></iframe>`
    );
  };

  return {
    resource: 'ndla-filmiundervisning',
    embedToHTML,
  };
}
