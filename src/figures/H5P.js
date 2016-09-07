/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

const H5P = ({ h5p }) => {
  const outerDivStyle = {
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
  };
  const innerDivStyle = {
    paddingTop: '100%',
  };
  const iframeStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
  };
  return (
    <div style={outerDivStyle}>
      <div style={innerDivStyle}>
        <figure>
          <iframe style={iframeStyle} src={h5p.url} />
        </figure>
      </div>
    </div>
  );
};

H5P.propTypes = {
  h5p: PropTypes.object.isRequired,
};

export default H5P;
