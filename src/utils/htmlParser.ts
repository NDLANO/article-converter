import { CheerioAPI, load } from 'cheerio';

export const parseHtml = (html: string): CheerioAPI => {
  return load(html, {
    xmlMode: false,
    decodeEntities: false,
  });
};
