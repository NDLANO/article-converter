/*
 * Part of NDLA article-converter.
 * Copyright (C) 2017 NDLA
 *
 * See LICENSE
 */

export default function createKhanAcademyPlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    embed.embed.replaceWith(
      `<figure><iframe src="${url}" width="${width}" height="${height}" scrolling="no" frameborder="no" align="center"></iframe></figure>`
    );
  };

  return {
    resource: 'khan-academy',
    embedToHTML,
  };
}
