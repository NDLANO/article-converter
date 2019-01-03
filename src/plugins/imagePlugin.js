/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Figure,
  FigureLicenseDialog,
  FigureCaption,
  FigureFullscreenDialog,
} from '@ndla/ui/lib/Figure';
import Button from '@ndla/button/lib/Button';
import Image from '@ndla/ui/lib/Image';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import queryString from 'query-string';
import {
  errorSvgSrc,
  getCopyString,
  getLicenenseCredits,
} from './pluginHelpers';
import { fetchImageResources } from '../api/imageApi';
import t from '../locale/i18n';
import { render } from '../utils/render';

const getFigureClassnames = (size, align) =>
  classnames('c-figure', {
    'u-float-right': align === 'right' && size !== 'small',
    'u-float-left': align === 'left' && size !== 'small',
    'u-float-small-right': align === 'right' && size === 'small',
    'u-float-small-left': align === 'left' && size === 'small',
    'u-float-xsmall-right': align === 'right' && size === 'xsmall',
    'u-float-xsmall-left': align === 'left' && size === 'xsmall',
  });

const getSizes = (size, align) => {
  if (align && size === 'full') {
    return '(min-width: 1024px) 512px, (min-width: 768px) 350px, 100vw';
  }
  if (align && size === 'small') {
    return '(min-width: 1024px) 350px, (min-width: 768px) 180px, 100vw';
  }
  if (align && size === 'xsmall') {
    return '(min-width: 1024px) 180px, (min-width: 768px) 180px, 100vw';
  }
  return '(min-width: 1024px) 1024px, 100vw';
};

const getFocalPoint = data => {
  if (data.focalX && data.focalY) {
    return { x: data.focalX, y: data.focalY };
  }
  return undefined;
};

const getCrop = data => {
  if (
    data.lowerRightX &&
    data.lowerRightY &&
    data.upperLeftX &&
    data.upperLeftY
  ) {
    return {
      startX: data.lowerRightX,
      startY: data.lowerRightY,
      endX: data.upperLeftX,
      endY: data.upperLeftY,
    };
  }
  return undefined;
};

const downloadUrl = imageSrc => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

const ImageActionButtons = ({ locale, src, copyString }) => [
  <Button
    key="copy"
    outline
    data-copied-title={t(locale, 'reference.copied')}
    data-copy-string={copyString}>
    {t(locale, 'reference.copy')}
  </Button>,
  <a
    key="download"
    href={downloadUrl(src)}
    className="c-button c-button--outline"
    download>
    {t(locale, 'image.download')}
  </a>,
];

ImageActionButtons.propTypes = {
  locale: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  copyString: PropTypes.string.isRequired,
};

export default function createImagePlugin() {
  const fetchResource = (embed, headers) => fetchImageResources(embed, headers);

  const getMetaData = embed => {
    const { image } = embed;
    return {
      title: image.title.title,
      altText: image.alttext.alttext,
      copyright: image.copyright,
      src: image.imageUrl,
    };
  };

  const onError = (embed, locale) => {
    const {
      image,
      data: { align, size },
    } = embed;
    const figureClassNames = getFigureClassnames(size, align);
    const src =
      image && image.imageUrl ? encodeURI(image.imageUrl) : errorSvgSrc;

    return render(
      <Figure className={figureClassNames}>
        <div className="c-figure__img">
          <img alt={t(locale, 'image.error.url')} src={src} />
        </div>
        <figcaption>{t(locale, 'image.error.caption')}</figcaption>
      </Figure>
    );
  };

  const embedToHTML = (embed, locale) => {
    const {
      image,
      data: { align, size, caption: embedCaption, alt: embedAlttext },
    } = embed;
    const src = encodeURI(image.imageUrl);
    const {
      license: { license: licenseAbbreviation },
    } = image.copyright;

    const authors = getLicenenseCredits(image.copyright);

    const altText = embedAlttext || image.alttext.alttext;
    const caption = embedCaption || image.caption.caption;
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const figureClassNames = getFigureClassnames(size, align);
    const sizes = getSizes(size, align);

    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'image.rulesForUse'),
      learnAboutLicenses: t(locale, 'learnAboutLicenses'),
      source: t(locale, 'source'),
      zoomImageButtonLabel: t(locale, 'image.zoom'),
    };

    const focalPoint = getFocalPoint(embed.data);
    const crop = getCrop(embed.data);

    const contributors = getGroupedContributorDescriptionList(
      image.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));
    const copyString = getCopyString(licenseAbbreviation, authors, locale);
    const figureId = `figure-${image.id}`;
    const figureFullscreenDialogId = `fs-${image.id.toString()}`;

    return render(
      <Figure id={figureId} className={figureClassNames}>
        <Button
          key="button"
          data-dialog-trigger-id={figureFullscreenDialogId}
          data-dialog-source-id={figureId}
          stripped
          aria-label={t(locale, 'image.largeSize')}
          className="u-fullw">
          <div className="c-figure__img">
            <Image
              focalPoint={focalPoint}
              contentType={image.contentType}
              crop={crop}
              sizes={sizes}
              alt={altText}
              src={`${src}`}
            />
          </div>
        </Button>
        {size !== 'xsmall' && (
          <FigureCaption
            figureId={figureId}
            id={`${image.id}`}
            caption={caption}
            reuseLabel={t(locale, 'image.reuse')}
            licenseRights={license.rights}
            authors={authors}
            locale={locale}
          />
        )}
        <FigureLicenseDialog
          id={`${image.id}`}
          title={image.title.title}
          license={license}
          authors={contributors}
          origin={image.copyright.origin}
          locale={locale}
          messages={messages}>
          <ImageActionButtons
            locale={locale}
            copyString={copyString}
            src={src}
          />
        </FigureLicenseDialog>
        <FigureFullscreenDialog
          id={figureFullscreenDialogId}
          title={image.title.title}
          license={license}
          caption={caption}
          locale={locale}
          reuseLabel={t(locale, 'image.reuse')}
          authors={contributors}
          actionButtons={
            <ImageActionButtons
              locale={locale}
              copyString={copyString}
              src={src}
            />
          }
          messages={messages}
          origin={image.copyright.origin}>
          <Image
            contentType={image.contentType}
            sizes="100vw"
            alt={altText}
            src={`${src}`}
          />
        </FigureFullscreenDialog>
      </Figure>
    );
  };

  return {
    resource: 'image',
    onError,
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
