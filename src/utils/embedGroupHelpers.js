/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import RelatedArticleList from '@ndla/ui/lib/RelatedArticleList';
import { render } from './render';
import t from '../locale/i18n';

export function createRelatedArticleList(props, children) {
  const { locale } = props;
  if (children && children.length > 0) {
    return render(
      <RelatedArticleList
        {...props}
        messages={{
          title: t(locale, 'related.title'),
          showMore: t(locale, 'related.showMore'),
          showLess: t(locale, 'related.showLess'),
        }}
        dangerouslySetInnerHTML={{
          __html: children,
        }}
      />
    );
  }
}
