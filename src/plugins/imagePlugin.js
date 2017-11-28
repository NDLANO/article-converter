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
import { Figure, FigureDetails, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import Image from 'ndla-ui/lib/Image';
import { fetchImageResources } from '../api/imageApi';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from 'ndla-licenses';
import t from '../locale/i18n';
import { CREATOR_TYPES } from '../constants';

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

  const embedToHTML = (embed, locale) => {
    const { image, data: { align, size, caption: embedCaption } } = embed;
    const src = encodeURI(image.imageUrl);
    const {
      authors,
      license: { license: licenseAbbreviation },
    } = image.copyright;
    const altText = image.alttext.alttext;
    const caption = embedCaption === '' ? image.caption.caption : embedCaption;
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const figureClassNames = classnames('c-figure', {
      'u-float-right': align === 'right' && size !== 'hoyrespalte',
      'u-float-left': align === 'left' && size !== 'hoyrespalte',
      'u-float-small-right': align === 'right' && size === 'hoyrespalte',
      'u-float-small-left': align === 'left' && size === 'hoyrespalte',
    });

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

    let creators = [];
    if (authors) {
      creators = authors.filter(author =>
        CREATOR_TYPES.find(type => author.type === type)
      );
    } else {
      creators = image.copyright.creators;
    }

    let contributors = [];
    if (authors) {
      contributors = authors;
    } else {
      contributors = getGroupedContributorDescriptionList(
        image.copyright,
        locale
      ).map(item => ({
        name: item.description,
        type: item.label,
      }));
    }

    let contributorsCopyString;
    if (authors) {
      contributorsCopyString = authors
        .filter(author => author.type !== 'Leverandør')
        .map(author => author.name)
        .join(', ');
    } else {
      contributorsCopyString = image.copyright.creators
        .map(author => author.name)
        .join(', ');
    }

    const copyString = `${licenseCopyString} ${contributorsCopyString}`;

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
          caption={caption}
          reuseLabel={t(locale, 'image.reuse')}
          licenseRights={license.rights}
          authors={creators}
        />
        <FigureDetails
          title={image.title.title}
          licenseRights={license.rights}
          licenseUrl={license.url}
          authors={contributors}
          origin={image.copyright.origin}
          messages={messages}>
          <Button
            outline
            className="c-licenseToggle__button"
            data-copied-title={t(locale, 'reference.copied')}
            data-copy-string={copyString}>
            {t(locale, 'reference.copy')}
          </Button>
          <a
            href={src}
            className="c-button c-button--outline c-licenseToggle__button"
            download>
            {t(locale, 'image.download')}
          </a>
        </FigureDetails>
      </Figure>
    );
  };

  return {
    resource: 'image',
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
