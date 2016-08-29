/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { alttextsI18N } from '../util/i18nFieldFinder';
const Image = ({image, lang}) => {
  const caption = alttextsI18N(image, lang, true);
  return (
    <figure>
      <img alt="presentation" src={image.images.full.url} />
      {caption ? <span className="figure_caption">{caption}</span> : ''}
    </figure>
  );
};

Image.propTypes = {
  image: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default Image;
