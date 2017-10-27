/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createPreziPlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    return `<iframe id="iframe_container" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="${width}" height="${height}" src="${url}"></iframe>`;
  };

  return {
    resource: 'prezi',
    embedToHTML,
  };
}
