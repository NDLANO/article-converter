/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import defined from 'defined';
import { renderToStaticMarkup } from 'react-dom/server';
import { Figure, FigureDetails, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { fetchVideoMeta } from '../api/brightcove';
import t from '../locale/i18n';

export default function createBrightcovePlugin() {
  const fetchResource = embed => fetchVideoMeta(embed);

  const embedToHTML = (embed, locale) => {
    const { brightcove, data: { account, videoid, caption } } = embed;
    const authors = brightcove.copyright.authors;
    const license = brightcove.copyright.license.license;
    const height = defined(brightcove.sources[0].height, '480');
    const width = defined(brightcove.sources[0].width, '640');
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

    return renderToStaticMarkup(
      <Figure>
        <iframe
          title={`Video: ${brightcove.name}`}
          height={height}
          width={width}
          frameBorder="0"
          src={`https://players.brightcove.net/${account}/default_default/index.html?videoId=${videoid}`}
          allowFullScreen
        />
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
    );
  };

  return {
    resource: 'brightcove',
    fetchResource,
    embedToHTML,
  };
}
