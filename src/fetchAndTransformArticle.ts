import cheerio from 'cheerio';
import { IArticleV2 } from '@ndla/types-article-api';
import { fetchArticle } from './api/articleApi';
import { transform } from './transformers';
import config from './config';
import { getCopyString } from './plugins/pluginHelpers';
import { LocaleType, TransformedArticle, TransformOptions } from './interfaces';

export async function transformArticle(
  article: IArticleV2,
  lang: LocaleType,
  accessToken: string,
  feideToken: string,
  options: TransformOptions = {},
): Promise<TransformedArticle> {
  const articleContent = article.content.content
    ? cheerio.load(article.content.content, {
        recognizeSelfClosing: true,
      })
    : undefined;

  const { html, embedMetaData } = articleContent
    ? await transform(articleContent, lang, accessToken, feideToken, article.visualElement, options)
    : { html: undefined, embedMetaData: undefined };

  const htmlString: string = html ?? '';

  const copyText: string = getCopyString(
    article.title.title,
    config.ndlaFrontendDomain,
    options.path,
    article.copyright,
    lang,
  );
  const hasContent = article.articleType === 'standard' || cheerio.load(htmlString).text() !== '';

  return {
    ...article,
    content: hasContent ? htmlString : '',
    metaData: { ...embedMetaData, copyText } || '',
    title: article.title.title || '',
    tags: article.tags ? article.tags.tags : [],
    introduction: article.introduction ? article.introduction.introduction : undefined,
    metaDescription: article.metaDescription ? article.metaDescription.metaDescription : '',
  };
}

export default async function fetchAndTransformArticle(
  articleId: string,
  lang: LocaleType,
  accessToken: string,
  feideToken: string,
  options = {},
): Promise<TransformedArticle> {
  const article = await fetchArticle(articleId, accessToken, feideToken, lang);
  return await transformArticle(article, lang, accessToken, feideToken, options);
}
