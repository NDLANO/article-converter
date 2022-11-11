/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18nInstance } from '@ndla/ui';
import { LocaleType } from '../interfaces';

const t = (locale: LocaleType, id: string) => {
  return i18nInstance.t(id, { lng: locale });
};

export default t;
