/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import prettier from 'prettier';

// Use prettier to format html for better diffing. N.B. prettier html formating is currently experimental
export const prettify = (content) => prettier.format(`${content}`, { parser: 'html' });
