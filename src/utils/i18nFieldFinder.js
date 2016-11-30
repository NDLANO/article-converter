/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createFieldByLanguageFinder, createObjectByLanguageFinder } from './createFieldByLanguageFinder';

export const titleI18N = createFieldByLanguageFinder('title');
export const contentI18N = createFieldByLanguageFinder('content');
export const footNotesI18N = createFieldByLanguageFinder('content', 'footNotes');
export const tagsI18N = createFieldByLanguageFinder('tags');
export const introductionI18N = createObjectByLanguageFinder('introduction');
export const audioFilesI18N = createObjectByLanguageFinder('audioFiles');
export const alttextsI18N = createFieldByLanguageFinder('alttexts', 'alttext');
export const captionI18N = createFieldByLanguageFinder('captions', 'caption');
export const titlesI18N = createFieldByLanguageFinder('titles', 'title');
