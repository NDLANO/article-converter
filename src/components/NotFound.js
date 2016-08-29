/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
