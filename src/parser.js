import jsdom from 'jsdom';
import React from 'react';
import Figure from './components/Figure';
import { alttextsI18N } from './util/i18nFieldFinder';
import { renderToString } from 'react-dom/server';
function parseImage(element, image, lang) {
  const html = `
    <img class="img-${element.data('size')}_image" src="${image.images.full.url}"></img>
    <span class="figure_caption">${alttextsI18N(image, lang, true)}</span>
    `;
  return renderToString(<Figure html={html} />);
}
function parseBrightcove(element, video) {
  const html = `
  <div style="display: block; position: relative; max-width: 100%;">
    <div style="padding-top: 56.25%;">
	   <video style="width: 100%; height: 100%; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;"
	    data-video-id="${video.videoid}"
	    data-account="${video.account}"
	    data-player="${video.player}"
	    data-embed="default"
	    class="video-js" controls>
      </video>
	    <script src="//players.brightcove.net/${video.account}/${video.player}_default/index.min.js"></script>
      </div>
    </div>
    `;
  return renderToString(<Figure html={html} />);
}
function parseH5P(element, h5p) {
  const html = `
  <iframe src="${h5p.url}" width="400" height="300">

    `;
  return renderToString(<Figure html={html} />);
}


function parser(element, figure, lang) {
  switch (element.data('resource')) {
    case 'image':
      return parseImage(element, figure, lang);
    case 'brightcove':
      return parseBrightcove(element, figure);
    case 'h5p':
      return parseH5P(element, figure);
    case 'external':
      return undefined;
    default:
      return undefined;
  }
}

export function parseHtmlString(figures, content, lang) {
  if (!content) {
    return undefined;
  }
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: content,
      scripts: ['http://code.jquery.com/jquery.js'],
      done: (err, window) => {
        if (err) {
          reject(err);
        }
        const $ = window.$;
        $('figure').each((i, el) => {
          figures.forEach((figure) => {
            if (figure.id === $(el).data('id')) {
              $(el).replaceWith(parser($(el), figure.figure, lang));
            }
          });
        });
        resolve(window.document.documentElement.innerHTML);
      }
    });
  });
}
function createFigureObject(figure) {
  switch (figure.data('resource')) {
    case 'image':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), size: figure.data('size'), url: figure.data('url')});
    case 'brightcove':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), figure: {account: figure.data('account'), player: figure.data('player'), videoid: figure.data('videoid')} });
    case 'h5p':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), figure: {url: figure.data('url')}});
    default:
      return undefined;
  }
}

export function getFigures(content) {
  console.log(content);
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: content,
      scripts: ['http://code.jquery.com/jquery.js'],
      done: (err, window) => {
        if (err) {
          reject(err);
        }
        const $ = window.$;
        resolve($('figure').map((i, figure) => createFigureObject($(figure))).toArray());
      },
    });
  });
}
