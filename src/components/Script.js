/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

const Script = ({ requiredLibraries }) => (
  <div>
    {requiredLibraries.map((library) =>
      <script key={library.url} className={library.name} src={library.url} />
    )}
  </div>
);

Script.propTypes = {
  requiredLibraries: PropTypes.array.isRequired,
};

export default Script;
