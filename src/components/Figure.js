import React, { PropTypes } from 'react';
const Figure = ({html}) => (
  <figure dangerouslySetInnerHTML={{__html: html}} />
);

Figure.propTypes = {
  html: PropTypes.string.isRequired,
};

export default Figure;
