import React, { PropTypes } from 'react';
import { titlesI18N } from '../util/i18nFieldFinder';
import Script from './Script';
const Content = ({data, parsedContent, lang}) => (
  <div className="content">
    <h1>{titlesI18N(data, lang, true)}</h1>
    <div dangerouslySetInnerHTML={{__html: parsedContent}} />
    {data.requiredLibraries ? <Script requiredLibraries={data.requiredLibraries} /> : ''}
  </div>
);


Content.propTypes = {
  data: PropTypes.object.isRequired,
  parsedContent: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default Content;
