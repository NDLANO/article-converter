/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

const Brightcove = ({ video }) => {
  const outerDivStyle = {
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
  };
  const innerDivStyle = {
    paddingTop: '56.25%',
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
    <figure>
      <div style={outerDivStyle}>
        <div style={innerDivStyle}>
          <iframe
            style={iframeStyle}
            src={`//players.brightcove.net/${video.account}/${video.player}_default/index.html?videoId=${video.videoid}`}
            allowFullScreen
            webkitallowfullscreen
            mozallowfullscreen
          />
        </div>
      </div>
    </figure>
  );
};

Brightcove.propTypes = {
  video: PropTypes.object.isRequired,
};

export default Brightcove;
