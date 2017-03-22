/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import defined from 'defined';
import classnames from 'classnames';
import LicenseByline from 'ndla-ui/lib/license/LicenseByline';
import Icon from 'ndla-ui/lib/icons/Icon';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { uuid } from 'ndla-util';
import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';
import { fetchImageResources } from '../api/imageApi';

const { render } = require('rapscallion');

export const Image = ({ image, caption, altText }) => {
  const authors = image.copyright.authors;
  return (
    <figure className="c-figure">
      <button className="c-figure__close">X</button>
      <div className="c-figure__img">
        <img alt={altText} src={image.imageUrl} />
      </div>
      <figcaption>
        {caption ? <div className="c-figcaption__info">${caption}</div> : null}
        <div className="c-figure__byline">
          <button className="c-button c-button--outline c-figure__captionbtn"><Icon.OpenWindow /> Gjenbruk</button>
          <div className="c-figure__byline-licenselist">
            <LicenseByline license={getLicenseByAbbreviation(image.copyright.license.license)}>
              <span className="article_meta">{ authors.map(author => author.name).join(', ') }</span>
            </LicenseByline>
          </div>
        </div>
      </figcaption>
      <div className="c-figure__license" id="figmeta">
        <div className="u-expanded">
          <div className="c-licenseToggle__details">
            <LicenseByline license={getLicenseByAbbreviation(image.copyright.license.license)} />
            <ul className="c-figure__list">
              { authors.map(author => <li key={uuid()} className="o-list__item">{ `${author.type}: ${author.name}`}</li>) }
            </ul>
          </div>
          <div className="c-licenseToggle__ctablock">
            <button className="c-button c-button--small c-button--transparent c-licenseToggle__button" type="button"><Icon.Copy /> Kopier referanse</button>
            <button className="c-button c-button--small c-button--transparent c-licenseToggle__button" type="button"><Icon.Link /> Gå til kilde</button>
            <button className="c-button c-licenseToggle__button" type="button"><Icon.OpenWindow /> Vis bilde</button>
          </div>
        </div>
      </div>
    </figure>
); };

Image.propTypes = {
  image: PropTypes.object.isRequired,
  altText: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default function createImagePlugin() {
  const createEmbedObject = obj => (
    { id: parseInt(obj.id, 10), resource: obj.resource, align: obj.align, caption: obj.caption, size: obj.size, url: obj.url }
  );

  const fetchResource = embed => fetchImageResources(embed);

  const embedToHTML = (embed, lang) => {
    const { image, align, ...rest } = embed;
    const altText = alttextsI18N(image, lang, true);
    const caption = defined(captionI18N(image, lang, true), rest.caption);
    const figureClassNames = classnames('article_figure', {
      'article_figure--float-right': align === 'right',
      'article_figure--float-left': align === 'left',
    });

    const figcaption = caption ? `<figcaption>${caption}</figcaption>` : '';

    if (align === 'right' || align === 'left') {
      return `<figure class="${figureClassNames}"><img class="article_image" alt="${altText}" src="${image.imageUrl}"/>${figcaption}</figure>`;
    }

    return render(
      <Image image={image} altText={altText} caption={caption} />
    ).toPromise();
  };

  return {
    resource: 'image',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
