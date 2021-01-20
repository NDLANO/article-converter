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
} from '@ndla/ui/lib/Figure';
import Button, { StyledButton } from '@ndla/button';
import Image, { ImageLink } from '@ndla/ui/lib/Image';
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

const ImageActionButtons = ({ locale, src, copyString }) => [
  <Button
    key="copy"
    outline
    data-copied-title={t(locale, 'license.hasCopiedTitle')}
    data-copy-string={copyString}>
    {t(locale, 'license.copyTitle')}
  </Button>,
  <Anchor key="download" href={downloadUrl(src)} appearance="outline" download>
    {t(locale, 'image.download')}
  </Anchor>,
];

ImageActionButtons.propTypes = {
  locale: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  copyString: PropTypes.string.isRequired,
};

export default function createImagePlugin(options = { concept: false }) {
  const fetchResource = (embed, accessToken, language) =>
    fetchImageResources(embed, accessToken, language);

  const getMetaData = embed => {
    const { image } = embed;
    if (image) {
      return {
        title: image.title.title,
        altText: image.alttext.alttext,
        copyright: image.copyright,
        src: image.imageUrl,
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
      image,
      data: { align, size, caption: embedCaption, alt: embedAlttext },
    } = embed;
    const {
      license: { license: licenseAbbreviation },
    } = image.copyright;

    const authors = getLicenenseCredits(image.copyright);

    const altText = embedAlttext || '';
    const caption = embedCaption || '';
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
      image.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));
    const copyString = getCopyString(licenseAbbreviation, authors, locale);
    const figureId = `figure-${image.id}`;
    return render(
      <Figure id={figureId} type={options.concept ? 'full-column' : figureType}>
        {({ typeClass }) => (
          <>
            <ImageWrapper
              src={image.imageUrl}
              crop={crop}
              size={size}
              typeClass={typeClass}
              locale={locale}>
              <Image
                focalPoint={focalPoint}
                contentType={image.contentType}
                crop={crop}
                sizes={sizes}
                alt={altText}
                src={image.imageUrl}
              />
            </ImageWrapper>
            <FigureCaption
              hideFigcaption={isSmall(size)}
              figureId={figureId}
              id={`${image.id}`}
              caption={caption}
              reuseLabel={t(locale, 'image.reuse')}
              licenseRights={license.rights}
              authors={authors}
              locale={locale}>
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
                  src={image.imageUrl}
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
