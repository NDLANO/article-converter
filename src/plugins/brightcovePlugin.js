/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import ReactDOMServerStream from 'react-dom/server';
import { Figure, FigureDetails, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { fetchVideoMeta } from '../api/brightcove';
import t from '../locale/i18n';

export default function createBrightcovePlugin() {
  const fetchResource = embed => fetchVideoMeta(embed);

  const embedToHTML = (embed, locale) => {
    const { brightcove, data: { account, player, videoid, caption } } = embed;
    const authors = brightcove.copyright.authors;
    const license = brightcove.copyright.license.license;
    const licenseRights = getLicenseByAbbreviation(license, locale).rights;
    const licenseCopyString = `${license.includes('by')
      ? 'CC '
      : ''}${license}`.toUpperCase();
    const authorsCopyString = authors
      .filter(author => author.type !== 'Leverandør')
      .map(author => `${author.name}`)
      .join(', ');
    const copyString = `${licenseCopyString} ${authorsCopyString}`;

    const messages = {
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'video.rulesForUse'),
      learnAboutOpenLicenses: t(locale, 'learnAboutOpenLicenses'),
      source: t(locale, 'source'),
    };

    embed.embed.replaceWith(
      ReactDOMServerStream.renderToStaticMarkup(
        <Figure>
          <div
            style={{
              display: 'block',
              position: 'relative',
              maxWidth: '100%',
            }}>
            <div style={{ paddingTop: '56.25%' }}>
              <video
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0px',
                  bottom: '0px',
                  right: '0px',
                  left: '0px',
                }}
                data-video-id={videoid}
                data-account={account}
                data-player={player}
                data-embed="default"
                className="video-js"
                controls
              />
            </div>
          </div>
          <FigureCaption
            caption={caption}
            reuseLabel={t(locale, 'video.reuse')}
            licenseRights={licenseRights}
            authors={authors}
          />
          <FigureDetails
            licenseRights={licenseRights}
            authors={authors}
            messages={messages}>
            <Button
              outline
              className="c-licenseToggle__button"
              data-copied-title={t(locale, 'reference.copied')}
              data-copy-string={copyString}>
              {t(locale, 'reference.copy')}
            </Button>
          </FigureDetails>
        </Figure>
      )
    );
  };

  return {
    resource: 'brightcove',
    fetchResource,
    embedToHTML,
  };
}
