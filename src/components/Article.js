/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { titlesI18N } from '../util/i18nFieldFinder';
import Script from './Script';

const Article = ({ data, parsedArticle, lang }) => (
  <div>
    <h1>{titlesI18N(data, lang, true)}</h1>
    <div dangerouslySetInnerHTML={{ __html: parsedArticle }} />
    {data.requiredLibraries ? <Script requiredLibraries={data.requiredLibraries} /> : ''}
  </div>
);


Article.propTypes = {
  data: PropTypes.object.isRequired,
  parsedArticle: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

export default Article;
