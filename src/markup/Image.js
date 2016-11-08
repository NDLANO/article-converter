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

import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';

const Image = ({ image, align, lang, ...rest }) => {
  const altText = alttextsI18N(image, lang, true);
  const caption = defined(captionI18N(image, lang, true), rest.caption);
  const figureClassNames = classnames('article_figure', {
    'article_figure--float-right': align === 'right',
    'article_figure--float-left': align === 'left',
  });

  return (
    <figure className={figureClassNames}>
      <img className="article_image" alt={altText} src={image.imageUrl} />
      {caption ? <figcaption className="article_caption">{caption}</figcaption> : ''}
    </figure>
  );
};

Image.propTypes = {
  align: PropTypes.string,
  image: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default Image;
