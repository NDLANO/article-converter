/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
const Html = ({component}) => {
  return (
    <html lang="en-us">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic,300|Signika:400,600,300,700" />
        <link rel="shortcut icon" href="/article-oembed/assets/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {component}
      </body>
    </html>
  );
};

Html.propTypes = {
  component: PropTypes.object.isRequired,
};

export default Html;
