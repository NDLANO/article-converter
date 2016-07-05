import React, { PropTypes } from 'react';

const Content = ({data}) => (
  <div>
    <p>{data.titles[0].title}</p>
    <div dangerouslySetInnerHTML={{__html: data.content[0].content}} />
  </div>
);

Content.propTypes = {
  data: PropTypes.object.isRequired
};

export default Content;
