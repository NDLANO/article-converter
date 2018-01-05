/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import classnames from 'classnames';
import { Figure, FigureLicenseDialog, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import Image from 'ndla-ui/lib/Image';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from 'ndla-licenses';
import { errorSvgSrc } from './pluginHelpers';
import { fetchImageResources } from '../api/imageApi';
import t from '../locale/i18n';

const getFigureClassnames = (size, align) =>
  classnames('c-figure', {
    'u-float-right': align === 'right' && size !== 'hoyrespalte',
    'u-float-left': align === 'left' && size !== 'hoyrespalte',
    'u-float-small-right': align === 'right' && size === 'hoyrespalte',
    'u-float-small-left': align === 'left' && size === 'hoyrespalte',
  });

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
    const { image, data: { align, size } } = embed;
    const figureClassNames = getFigureClassnames(size, align);
    const src =
      image && image.imageUrl ? encodeURI(image.imageUrl) : errorSvgSrc;

    return renderToStaticMarkup(
      <Figure className={figureClassNames}>
        <div className="c-figure__img">
          <img alt={t(locale, 'image.error.url')} src={src} />
        </div>
        <figcaption>{t(locale, 'image.error.caption')}</figcaption>
      </Figure>
    );
  };

  const embedToHTML = (embed, locale) => {
    const { image, data: { align, size, caption: embedCaption } } = embed;
    const src = encodeURI(image.imageUrl);
    const {
      creators,
      license: { license: licenseAbbreviation },
    } = image.copyright;
    const altText = image.alttext.alttext;
    const caption = embedCaption === '' ? image.caption.caption : embedCaption;
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const figureClassNames = getFigureClassnames(size, align);

    const sizes = align
      ? '(min-width: 1024px) 512px, (min-width: 768px) 350px, 100vw'
      : '(min-width: 1024px) 1024px, 100vw';

    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'image.rulesForUse'),
      learnAboutLicenses: t(locale, 'learnAboutLicenses'),
      source: t(locale, 'source'),
    };

    const focalPoint = getFocalPoint(embed.data);
    const crop = getCrop(embed.data);
    const licenseCopyString = `${
      licenseAbbreviation.toLowerCase().includes('by') ? 'CC ' : ''
    }${licenseAbbreviation}`.toUpperCase();

    const contributors = getGroupedContributorDescriptionList(
      image.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));

    const contributorsCopyString = creators
      .map(creator => {
        const type = t(locale, `${creator.type.toLowerCase()}`);
        return `${type}: ${creator.name}`;
      })
      .join('\n');

    const copyString = `${licenseCopyString} ${contributorsCopyString}`;
    const figureLicenseDialogId = `image-${image.id.toString()}`;
    return renderToStaticMarkup(
      <Figure className={figureClassNames}>
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
        <FigureCaption
          id={figureLicenseDialogId}
          caption={caption}
          reuseLabel={t(locale, 'image.reuse')}
          licenseRights={license.rights}
          authors={creators}
        />
        <FigureLicenseDialog
          id={figureLicenseDialogId}
          title={image.title.title}
          licenseRights={license.rights}
          licenseUrl={license.url}
          authors={contributors}
          origin={image.copyright.origin}
          messages={messages}>
          <Button
            outline
            data-copied-title={t(locale, 'reference.copied')}
            data-copy-string={copyString}>
            {t(locale, 'reference.copy')}
          </Button>
          <a href={src} className="c-button c-button--outline" download>
            {t(locale, 'image.download')}
          </a>
        </FigureLicenseDialog>
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
