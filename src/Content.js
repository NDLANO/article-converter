import React, { PropTypes } from 'react';

const Content = ({data, parsedContent}) => (
  <div className="content">
    <h1>{data.titles[0].title}</h1>
    <div dangerouslySetInnerHTML={{__html: parsedContent}} />
  </div>
);

Content.propTypes = {
  data: PropTypes.object.isRequired,
  parsedContent: PropTypes.string.isRequired
};

export default Content;
