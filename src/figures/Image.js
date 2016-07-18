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
