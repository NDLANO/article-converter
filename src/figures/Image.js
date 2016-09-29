/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import defined from 'defined';

import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';

const Image = ({ image, lang, ...rest }) => {
  const altText = alttextsI18N(image, lang, true);
  const caption = defined(captionI18N(image, lang, true), rest.caption);

  return (
    <figure className="article_figure">
      <img className="article_image" alt={altText} src={image.images.full.url} />
      {caption ? <figcaption className="article_caption">{caption}</figcaption> : ''}
    </figure>
  );
};

Image.propTypes = {
  image: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default Image;
