/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Figure,
  FigureLicenseDialog,
  FigureCaption,
  FigureExpandButton,
  FigureBylineExpandButton,
} from '@ndla/ui/lib/Figure';
import Button, { StyledButton } from '@ndla/button';
import Image, { ImageLink } from '@ndla/ui/lib/Image';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import queryString from 'query-string';
import { errorSvgSrc, getCopyString, getLicenseCredits } from './pluginHelpers';
import { fetchImageResources } from '../api/imageApi';
import t from '../locale/i18n';
import { render } from '../utils/render';

const Anchor = StyledButton.withComponent('a');

const getFigureType = (size, align) => {
  if (isSmall(size) && align) {
    return `${size}-${align}`;
  }
  if (isSmall(size) && !align) {
    return size;
  }
  if (align) {
    return align;
  }
  return 'full';
};

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
    (data.lowerRightX &&
      data.lowerRightY &&
      data.upperLeftX &&
      data.upperLeftY) !== undefined
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

function isSmall(size) {
  return size === 'xsmall' || size === 'small';
}

function hideByline(size) {
  return size.endsWith('-hide-byline');
}

function ImageWrapper({ typeClass, src, crop, size, children, locale }) {
  if (isSmall(size)) {
    return (
      <>
        <FigureExpandButton
          typeClass={typeClass}
          messages={{
            zoomImageButtonLabel: t(
              locale,
              'license.images.itemImage.zoomImageButtonLabel'
            ),
            zoomOutImageButtonLabel: t(
              locale,
              'license.images.itemImage.zoomOutImageButtonLabel'
            ),
          }}
        />
        {children}
      </>
    );
  } else if (hideByline(size)) {
    return (
      <>
        <FigureBylineExpandButton
          typeClass={size}
          messages={{
            expandBylineButtonLabel: t(
              locale,
              'license.images.itemImage.expandByline'
            ),
            minimizeBylineButtonLabel: t(
              locale,
              'license.images.itemImage.minimizeByline'
            ),
          }}
        />
        {children}
      </>
    );
  }

  return (
    <ImageLink
      src={src}
      crop={crop}
      aria-label={t(locale, 'license.images.itemImage.ariaLabel')}>
      {children}
    </ImageLink>
  );
}

ImageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  typeClass: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  crop: PropTypes.shape({
    startX: PropTypes.number.isRequired,
    startY: PropTypes.number.isRequired,
    endX: PropTypes.number.isRequired,
    endY: PropTypes.number.isRequired,
  }),
};

const ImageActionButtons = ({ copyString, locale, license, src }) => {
  const buttons = [
    <Button
      key="copy"
      outline
      data-copied-title={t(locale, 'license.hasCopiedTitle')}
      data-copy-string={copyString}>
      {t(locale, 'license.copyTitle')}
    </Button>,
  ];
  if (license !== 'COPYRIGHTED') {
    buttons.push(
      <Anchor
        key="download"
        href={downloadUrl(src)}
        appearance="outline"
        download>
        {t(locale, 'image.download')}
      </Anchor>
    );
  }
  return buttons;
};

ImageActionButtons.propTypes = {
  copyString: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  license: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default function createImagePlugin(options = { concept: false }) {
  const fetchResource = (embed, accessToken, language) =>
    fetchImageResources(embed, accessToken, language);

  const getMetaData = (embed, locale) => {
    const { image } = embed;
    if (image) {
      const {
        title: { title },
        alttext: { alttext },
        copyright,
        imageUrl,
      } = image;
      const copyString = getCopyString(
        title,
        imageUrl,
        options.path,
        copyright,
        locale
      );
      return {
        title: title,
        altText: alttext,
        copyright: copyright,
        src: imageUrl,
        copyText: copyString,
      };
    }
  };

  const onError = (embed, locale) => {
    const {
      image,
      data: { align, size },
    } = embed;
    const figureType = getFigureType(size, align);
    const src = image && image.imageUrl ? image.imageUrl : errorSvgSrc;

    return render(
      <Figure type={figureType}>
        <div className="c-figure__img">
          <img alt={t(locale, 'image.error.url')} src={src} />
        </div>
        <figcaption>{t(locale, 'image.error.caption')}</figcaption>
      </Figure>
    );
  };

  const embedToHTML = (embed, locale) => {
    const {
      image: {
        copyright,
        imageUrl,
        title: { title },
        id,
        contentType,
      },
      data: { align, size, caption: embedCaption, alt: embedAlttext },
    } = embed;
    const {
      license: { license: licenseAbbreviation },
      origin,
    } = copyright;

    const authors = getLicenseCredits(copyright);

    const altText = embedAlttext || '';
    const caption = embedCaption;
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const figureType = getFigureType(size, align);
    const sizes = getSizes(size, align);

    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'license.images.rules'),
      learnAboutLicenses: t(locale, 'license.learnMore'),
      source: t(locale, 'source'),
      zoomImageButtonLabel: t(
        locale,
        'license.images.itemImage.zoomImageButtonLabel'
      ),
    };

    const focalPoint = getFocalPoint(embed.data);
    const crop = getCrop(embed.data);

    const contributors = getGroupedContributorDescriptionList(
      copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));

    const copyString = getCopyString(
      title,
      imageUrl,
      options.path,
      copyright,
      locale
    );
    const figureId = `figure-${id}`;
    return render(
      <Figure id={figureId} type={options.concept ? 'full-column' : figureType}>
        {({ typeClass }) => (
          <>
            <ImageWrapper
              src={imageUrl}
              crop={crop}
              size={size}
              typeClass={typeClass}
              locale={locale}>
              <Image
                focalPoint={focalPoint}
                contentType={contentType}
                crop={crop}
                sizes={sizes}
                alt={altText}
                src={imageUrl}
              />
            </ImageWrapper>
            <FigureCaption
              hideFigcaption={isSmall(size) || hideByline(size)}
              figureId={figureId}
              id={`${id}`}
              caption={caption}
              reuseLabel={t(locale, 'image.reuse')}
              licenseRights={license.rights}
              authors={
                authors.creators || authors.rightsholders || authors.processors
              }
              locale={locale}>
              <FigureLicenseDialog
                id={`${id}`}
                title={title}
                license={license}
                authors={contributors}
                origin={origin}
                locale={locale}
                messages={messages}>
                <ImageActionButtons
                  locale={locale}
                  copyString={copyString}
                  src={imageUrl}
                  license={licenseAbbreviation}
                />
              </FigureLicenseDialog>
            </FigureCaption>
          </>
        )}
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
