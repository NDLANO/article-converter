import cheerio from 'cheerio';
import { fetchArticle } from './api/articleApi';
import { transform } from './transformers';
import config from './config';
import { getCopyString } from './plugins/pluginHelpers';

export async function transformArticle(
  article,
  lang,
  accessToken,
  options = {}
) {
  const articleContent = article.content.content
    ? cheerio.load(article.content.content, {
        recognizeSelfClosing: true,
      })
    : undefined;
  const { html, embedMetaData } = articleContent
    ? await transform(
        articleContent,
        lang,
        accessToken,
        article.visualElement,
        options
      )
    : {};
  const copyText = getCopyString(
    article.title.title,
    config.ndlaFrontendDomain,
    options.path,
    article.copyright,
    lang
  );

  return {
    ...article,
    content: html || '',
    metaData: { ...embedMetaData, copyText } || '',
    title: article.title.title || '',
    tags: article.tags ? article.tags.tags : [],
    introduction: article.introduction
      ? article.introduction.introduction
      : undefined,
    metaDescription: article.metaDescription
      ? article.metaDescription.metaDescription
      : '',
  };
}

export default async function fetchAndTransformArticle(
  articleId,
  lang,
  accessToken,
  options = {}
) {
  const article = await fetchArticle(articleId, accessToken, lang);
  const transformedArticle = await transformArticle(
    article,
    lang,
    accessToken,
    options
  );
  return transformedArticle;
}
