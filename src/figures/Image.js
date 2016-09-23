/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

import { alttextsI18N, captionI18N } from '../util/i18nFieldFinder';

const Image = ({ image, lang }) => {
  const altText = alttextsI18N(image, lang, true);
  const caption = captionI18N(image, lang, true);
  return (
    <figure className="article_figure">
      <img className="article_image" alt={altText} src={image.images.full.url} />
      {caption ? <span className="article_caption">{caption}</span> : ''}
    </figure>
  );
};

Image.propTypes = {
  image: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default Image;
