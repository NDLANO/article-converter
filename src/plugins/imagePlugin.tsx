/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import styled from '@emotion/styled';
import {
  Figure,
  FigureLicenseDialog,
  FigureCaption,
  FigureExpandButton,
  FigureBylineExpandButton,
  FigureType,
} from '@ndla/ui/lib/Figure';
// @ts-ignore
import Button, { StyledButton } from '@ndla/button';
// @ts-ignore
import Image, { ImageLink } from '@ndla/ui/lib/Image';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
  figureApa7CopyString,
} from '@ndla/licenses';
import queryString from 'query-string';
import { isNumber } from 'lodash';
import { errorSvgSrc, getLicenseCredits } from './pluginHelpers';
import { fetchImageResources, ImageApiCopyright, ImageApiType } from '../api/imageApi';
import t from '../locale/i18n';
import { render } from '../utils/render';
import {
  Plugin,
  EmbedType,
  LocaleType,
  TransformOptions,
  EmbedToHTMLReturnObj,
  SimpleEmbedType,
} from '../interfaces';
import config from '../config';

const Anchor = StyledButton.withComponent('a');

const StyledSpan = styled.span`
  font-style: italic;
  color: grey;
`;

const getFigureType = (size?: string, align?: string): FigureType => {
  if (size && isSmall(size) && align && isAlign(align)) {
    return `${size}-${align}`;
  }
  if (size && isSmall(size) && !align) {
    return size as FigureType;
  }
  if (align && isAlign(align)) {
    return align;
  }
  return 'full';
};

const getSizes = (size?: string, align?: string) => {
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

const getFocalPoint = (data: ImageEmbedData) => {
  if (isNumber(data.focalX) && isNumber(data.focalY)) {
    return { x: data.focalX, y: data.focalY };
  }
  return undefined;
};

const getCrop = (data: ImageEmbedData) => {
  if (
    isNumber(data.lowerRightX) &&
    isNumber(data.lowerRightY) &&
    isNumber(data.upperLeftX) &&
    isNumber(data.upperLeftY)
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

const downloadUrl = (imageSrc: string) => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

function isSmall(size?: string): size is 'xsmall' | 'small' {
  return size === 'xsmall' || size === 'small';
}

function isAlign(align?: string): align is 'left' | 'right' {
  return align === 'left' || align === 'right';
}

function hideByline(size?: string): boolean {
  return !!size && size.endsWith('-hide-byline');
}

interface ImageWrapperProps {
  src: string;
  children: React.ReactNode;
  locale: LocaleType;
  crop?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  size?: string;
}

function ImageWrapper({ src, crop, size, children, locale }: ImageWrapperProps) {
  if (isSmall(size) || hideByline(size)) {
    return <>{children}</>;
  }

  return (
    <ImageLink src={src} crop={crop} aria-label={t(locale, 'license.images.itemImage.ariaLabel')}>
      {children}
    </ImageLink>
  );
}

ImageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  src: PropTypes.string.isRequired,
  crop: PropTypes.shape({
    startX: PropTypes.number.isRequired,
    startY: PropTypes.number.isRequired,
    endX: PropTypes.number.isRequired,
    endY: PropTypes.number.isRequired,
  }),
};

interface ImageActionButtonsProps {
  copyString: string;
  locale: LocaleType;
  license: string;
  src: string;
}

export const ImageActionButtons = ({
  copyString,
  locale,
  license,
  src,
}: ImageActionButtonsProps) => {
  if (license === 'COPYRIGHTED') {
    return null;
  }
  return (
    <>
      <Button
        key="copy"
        outline
        data-copied-title={t(locale, 'license.hasCopiedTitle')}
        data-copy-string={copyString}>
        {t(locale, 'license.copyTitle')}
      </Button>
      <Anchor key="download" href={downloadUrl(src)} appearance="outline" download>
        {t(locale, 'image.download')}
      </Anchor>
    </>
  );
};

ImageActionButtons.propTypes = {
  copyString: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  license: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export interface ImageEmbedType extends EmbedType<ImageEmbedData> {
  image: ImageApiType;
}

export interface ImageEmbedData {
  resource: 'image';
  resourceId: string;
  size?: string;
  align?: string;
  alt: string;
  caption?: string;
  url?: string;
  focalX?: string;
  focalY?: string;
  lowerRightY?: string;
  lowerRightX?: string;
  upperLeftY?: string;
  upperLeftX?: string;
  metaData?: any;
}

export interface ImagePlugin extends Plugin<ImageEmbedType, ImageEmbedData> {
  resource: 'image';
}

export interface ImageMetaData {
  title: string;
  altText: string;
  copyright: ImageApiCopyright;
  src: string;
  copyText: string;
}

export const messages = (locale: LocaleType) => ({
  title: t(locale, 'title'),
  close: t(locale, 'close'),
  rulesForUse: t(locale, 'license.images.rules'),
  learnAboutLicenses: t(locale, 'license.learnMore'),
  source: t(locale, 'source'),
  zoomImageButtonLabel: t(locale, 'license.images.itemImage.zoomImageButtonLabel'),
});

export default function createImagePlugin(
  options: TransformOptions = { concept: false },
): ImagePlugin {
  const fetchResource = (
    embed: SimpleEmbedType<ImageEmbedData>,
    accessToken: string,
    language: LocaleType,
  ) => {
    const resolve = async () => {
      const image = await fetchImageResources(embed.data.url || '', accessToken, language);
      return {
        ...embed,
        image,
      };
    };
    return resolve();
  };

  const getMetaData = async (embed: ImageEmbedType, locale: LocaleType) => {
    const { image } = embed;
    if (image) {
      const {
        title: { title },
        alttext: { alttext },
        copyright,
        imageUrl,
      } = image;
      const copyString = figureApa7CopyString(
        title,
        undefined,
        imageUrl,
        options.shortPath || options.path,
        copyright,
        copyright.license.license,
        config.ndlaFrontendDomain,
        (id: string) => t(locale, id),
        locale,
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

  const onError = (embed: ImageEmbedType, locale: LocaleType) => {
    const { image, data } = embed;
    const { align, size } = data;
    const figureType = getFigureType(size, align);
    const src = image && image.imageUrl ? image.imageUrl : errorSvgSrc;

    return render(
      <Figure type={figureType}>
        <div className="c-figure__img">
          <img alt={t(locale, 'image.error.url')} src={src} />
        </div>
        <figcaption>{t(locale, 'image.error.caption')}</figcaption>
      </Figure>,
    );
  };

  const embedToHTML = async (
    embed: ImageEmbedType,
    locale: LocaleType,
  ): Promise<EmbedToHTMLReturnObj> => {
    const {
      image: {
        copyright,
        imageUrl,
        title: { title },
        id,
        contentType,
      },
      data,
    } = embed;
    const {
      license: { license: licenseAbbreviation },
      origin,
    } = copyright;

    const { align, size, caption: embedCaption, alt: embedAlttext } = data;

    const authors = getLicenseCredits(copyright);

    const altText = embedAlttext || '';
    const caption = embedCaption || '';
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const figureType = getFigureType(size, align);
    const sizes = getSizes(size, align);

    const focalPoint = getFocalPoint(embed.data);
    const crop = getCrop(embed.data);

    const contributors = getGroupedContributorDescriptionList(copyright, locale).map((item) => ({
      name: item.description,
      type: item.label,
    }));

    const copyString = figureApa7CopyString(
      title,
      undefined,
      imageUrl,
      options.shortPath || options.path,
      copyright,
      copyright.license.license,
      config.ndlaFrontendDomain,
      (id: string) => t(locale, id),
      locale,
    );
    const unique = uniqueId();
    const figureId = `figure-${unique}-${id}`;

    const ExpandButton = ({ size, typeClass }: { size?: string; typeClass: string }) => {
      if (isSmall(size)) {
        return (
          <FigureExpandButton
            typeClass={typeClass}
            messages={{
              zoomImageButtonLabel: t(locale, 'license.images.itemImage.zoomImageButtonLabel'),
              zoomOutImageButtonLabel: t(
                locale,
                'license.images.itemImage.zoomOutImageButtonLabel',
              ),
            }}
          />
        );
      } else if (hideByline(size)) {
        return (
          <FigureBylineExpandButton
            typeClass={size ?? ''}
            messages={{
              expandBylineButtonLabel: t(locale, 'license.images.itemImage.expandByline'),
              minimizeBylineButtonLabel: t(locale, 'license.images.itemImage.minimizeByline'),
            }}
          />
        );
      }
      return null;
    };

    const { creators, rightsholders, processors } = authors;
    const captionAuthors =
      creators.length || rightsholders.length ? [...creators, ...rightsholders] : processors;

    const altTextSpan = options.previewAlt ? (
      <StyledSpan>{`Alt: ${altText}`}</StyledSpan>
    ) : undefined;

    return {
      html: render(
        <Figure id={figureId} type={options.concept ? 'full-column' : figureType}>
          {({ typeClass }: { typeClass: string }) => (
            <>
              <ImageWrapper src={imageUrl} crop={crop} size={size} locale={locale}>
                <Image
                  focalPoint={focalPoint}
                  contentType={contentType}
                  crop={crop}
                  sizes={sizes}
                  alt={altText}
                  src={imageUrl}
                  expandButton={<ExpandButton size={size} typeClass={typeClass} />}
                />
              </ImageWrapper>
              {altTextSpan}
              <FigureCaption
                hideFigcaption={isSmall(size) || hideByline(size)}
                figureId={figureId}
                id={figureId}
                caption={caption}
                reuseLabel={t(locale, 'image.reuse')}
                licenseRights={license.rights}
                authors={captionAuthors}
                locale={locale}>
                <FigureLicenseDialog
                  id={figureId}
                  title={title}
                  license={license}
                  authors={contributors}
                  origin={origin}
                  locale={locale}
                  messages={messages(locale)}>
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
        </Figure>,
      ),
    };
  };

  return {
    resource: 'image',
    onError,
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
