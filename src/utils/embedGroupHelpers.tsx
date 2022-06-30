/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
// @ts-ignore
import { RelatedArticleList } from '@ndla/ui';
import { render } from './render';
import t from '../locale/i18n';
import { LocaleType } from '../interfaces';

export function createRelatedArticleList(
  props: {
    locale: LocaleType;
    articleCount: number;
  },
  children: string,
) {
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
      />,
    );
  }
}
