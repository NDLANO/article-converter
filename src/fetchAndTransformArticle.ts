import cheerio from 'cheerio';
import { IArticleV2 } from '@ndla/types-article-api';
import { webpageReferenceApa7CopyString } from '@ndla/licenses';
import { fetchArticle } from './api/articleApi';
import { transform } from './transformers';
import config from './config';
import t from './locale/i18n';
import { ApiOptions, ResponseHeaders, TransformedArticle, TransformOptions } from './interfaces';

export async function transformArticle(
  article: IArticleV2,
  headers: ResponseHeaders,
  apiOptions: ApiOptions,
  options: TransformOptions = {},
): Promise<TransformedArticle> {
  const articleContent = article.content.content
    ? cheerio.load(article.content.content, {
        recognizeSelfClosing: true,
      })
    : undefined;

  const { html, embedMetaData, responseHeaders } = articleContent
    ? await transform(articleContent, headers, apiOptions, article.visualElement, options)
    : { html: undefined, embedMetaData: undefined, responseHeaders: undefined };

  const htmlString: string = html ?? '';

  const copyText: string = webpageReferenceApa7CopyString(
    article.title.title,
    undefined,
    article.published,
    `/article/${article.id}`,
    article.copyright,
    apiOptions.lang,
    config.ndlaFrontendDomain,
    (id: string) => t(apiOptions.lang, id),
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
    headerData: responseHeaders ?? {},
  };
}

export default async function fetchAndTransformArticle(
  articleId: string,
  apiOptions: ApiOptions,
  options = {},
): Promise<TransformedArticle> {
  const { article, responseHeaders } = await fetchArticle(articleId, apiOptions);
  return await transformArticle(article, responseHeaders, apiOptions, options);
}
