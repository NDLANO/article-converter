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
import {
  Figure,
  FigureLicenseDialog,
  FigureCaption,
} from '@ndla/ui/lib/Figure';
import Button, { StyledButton } from '@ndla/button';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { get } from 'lodash/fp';
import { fetchVideoMeta } from '../api/brightcove';
import t from '../locale/i18n';
import {
  getCopyString,
  getLicenseCredits,
  makeIframeString,
} from './pluginHelpers';
import { render } from '../utils/render';

const Anchor = StyledButton.withComponent('a');

export default function createBrightcovePlugin(options = { concept: false }) {
  const fetchResource = embed => fetchVideoMeta(embed);

  const getIframeProps = (
    { account, videoid, player = 'default' },
    sources
  ) => {
    const source =
      sources
        .filter(s => s.width && s.height)
        .sort((a, b) => a.height < b.height)[0] || {};
    return {
      src: `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
      height: defined(source.height, '480'),
      width: defined(source.width, '640'),
    };
  };

  const getMetaData = (embed, locale, metaOptions) => {
    const { brightcove, data } = embed;
    if (brightcove) {
      const mp4s = brightcove.sources
        .filter(source => source.container === 'MP4' && source.src)
        .sort((a, b) => b.size - a.size);
      const iframeProps = getIframeProps(data, brightcove.sources);
      const { name, description, copyright, published_at } = brightcove;
      const copyString = getCopyString(
        name,
        iframeProps.src,
        metaOptions?.path,
        copyright,
        locale
      );
      return {
        title: name,
        description: description,
        copyright: copyright,
        cover: get('images.poster.src', brightcove),
        download: mp4s[0] ? mp4s[0].src : undefined,
        src: iframeProps.src,
        iframe: iframeProps,
        uploadDate: published_at,
        copyText: copyString,
      };
    }
  };

  const onError = (embed, locale) => {
    const { data } = embed;
    const { videoid } = data;

    return render(
      <Figure type={options.concept ? 'full-column' : 'full'} resizeIframe>
        <iframe
          title={`Video: ${videoid || ''}`}
          aria-label={`Video: ${videoid || ''}`}
          frameBorder="0"
          {...getIframeProps(data, [])}
          allowFullScreen
        />
        <figcaption>{t(locale, 'video.error')}</figcaption>
      </Figure>
    );
  };

  const embedToHTML = (embed, locale, htmlOptions) => {
    const { brightcove, data } = embed;
    const { caption } = data;
    const {
      license: { license: licenseAbbreviation },
    } = brightcove.copyright;

    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const authors = getLicenseCredits(brightcove.copyright);

    const contributors = getGroupedContributorDescriptionList(
      brightcove.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));

    const { src, height, width } = getIframeProps(data, brightcove.sources);

    const { download } = getMetaData(embed);

    const copyString = getCopyString(
      brightcove.name,
      src,
      htmlOptions?.path,
      brightcove.copyright,
      locale
    );

    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'license.video.rules'),
      learnAboutLicenses: t(locale, 'license.learnMore'),
      source: t(locale, 'source'),
    };

    const id = brightcove.reference_id
      ? brightcove.reference_id
      : brightcove.id;
    const figureId = `figure-${id}`;

    return render(
      <Figure
        id={figureId}
        type={options.concept ? 'full-column' : 'full'}
        resizeIframe>
        <iframe
          title={`Video: ${brightcove.name}`}
          aria-label={`Video: ${brightcove.name}`}
          frameBorder="0"
          {...getIframeProps(data, brightcove.sources)}
          allowFullScreen
        />
        <FigureCaption
          figureId={figureId}
          id={id}
          locale={locale}
          caption={caption}
          reuseLabel={t(locale, 'video.reuse')}
          licenseRights={license.rights}
          authors={
            authors.creators || authors.rightsholders || authors.processors
          }
        />
        <FigureLicenseDialog
          id={id}
          title={brightcove.name}
          locale={locale}
          license={license}
          authors={contributors}
          messages={messages}>
          <Button
            outline
            data-copied-title={t(locale, 'license.hasCopiedTitle')}
            data-copy-string={copyString}>
            {t(locale, 'license.copyTitle')}
          </Button>
          {licenseAbbreviation !== 'COPYRIGHTED' && (
            <Anchor
              key="download"
              href={download}
              appearance="outline"
              download>
              {t(locale, 'video.download')}
            </Anchor>
          )}
          <Button
            outline
            data-copied-title={t(locale, 'license.hasCopiedTitle')}
            data-copy-string={makeIframeString(
              src,
              height,
              width,
              brightcove.name
            )}>
            {t(locale, 'license.embed')}
          </Button>
        </FigureLicenseDialog>
      </Figure>
    );
  };

  return {
    onError,
    resource: 'brightcove',
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
