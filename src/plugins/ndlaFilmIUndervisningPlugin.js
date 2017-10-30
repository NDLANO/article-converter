/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createNdlaFilmIUndervisningPlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    return `<iframe src="${url}" style="border: none;" frameborder="0" width="${width}" height="${height}" allowfullscreen></iframe>`;
  };

  return {
    resource: 'ndla-filmiundervisning',
    embedToHTML,
  };
}
