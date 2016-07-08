import React, { PropTypes } from 'react';
const Script = ({requiredLibraries}) => (
  <div>
    {requiredLibraries.map((library) =>
      <script className={library.name} src={library.url} />
    )}
  </div>
);

Script.propTypes = {
  requiredLibraries: PropTypes.array.isRequired,
};

export default Script;
