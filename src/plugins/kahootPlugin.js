/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createKahootPlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    return `<iframe src="${url}" width="${width}" height="${height}" name="iframe1" scrolling="no" frameborder="no" align="center"></iframe>`;
  };

  return {
    resource: 'kahoot',
    embedToHTML,
  };
}
