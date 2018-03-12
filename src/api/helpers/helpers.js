import cheerio from 'cheerio';
import { fetchArticle } from '../articleApi';
import { transform } from '../../transformers';

async function fetchAndTransformArticle(articleId, lang, accessToken) {
  const article = await fetchArticle(articleId, accessToken, lang);
  const articleContent = cheerio.load(article.content.content);
  const { html, embedMetaData } = await transform(
    articleContent,
    lang,
    accessToken,
    article.visualElement
  );

  return {
    ...article,
    content: html,
    metaData: embedMetaData,
    title: article.title.title,
    tags: article.tags.tags,
    introduction: article.introduction
      ? article.introduction.introduction
      : undefined,
    metaDescription: article.metaDescription.metaDescription,
  };
}

export { fetchAndTransformArticle };
