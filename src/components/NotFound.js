import React, { PropTypes } from 'react';

const NotFound = ({errorMessage}) => (
  <div>
    <p>{errorMessage ? `${errorMessage.status} - ${errorMessage.message}` : ''}
    </p>
  </div>
);
NotFound.propTypes = {
  errorMessage: PropTypes.object
};
export default NotFound;
