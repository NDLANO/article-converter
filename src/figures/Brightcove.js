import React, { PropTypes } from 'react';
const Brightcove = ({video}) => {
  const outerDivStyle = {
    display: 'block',
    position: 'relative',
    maxWidth: '100%'
  };
  const innerDivStyle = {
    paddingTop: '56.25%'
  };
  const videoStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0'
  };
  return (
    <figure>
      <div style={outerDivStyle}>
        <div style={innerDivStyle}>
          <video
            style={videoStyle}
            data-video-id={video.videoid}
            data-account={video.account}
            data-player={video.player}
            data-embed="default"
            className="video-js" controls
          >
          </video>
          <script src={`//players.brightcove.net/${video.account}/${video.player}_default/index.min.js`} />
        </div>
      </div>
    </figure>
  );
};

Brightcove.propTypes = {
  video: PropTypes.object.isRequired,
};

export default Brightcove;
