/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getFirstNonEmptyLicenseCredits, makeIframe, wrapInFigure } from '../pluginHelpers';

test('wrapInFigure', () => {
  expect(wrapInFigure('<div></div>')).toMatchSnapshot();
  expect(wrapInFigure('<div></div>', false)).toMatchSnapshot();
});

test('makeIframe', () => {
  expect(makeIframe('https://youtube.com', '400', '600')).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', 400, 600)).toMatchSnapshot();
  expect(
    makeIframe('https://youtube.com', '400px', '600px', 'https://youtube.com'),
  ).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', '400 px', '600 px', 'Youtube')).toMatchSnapshot();
});

test('getFirstNonEmptyLicenseCredits returns an empty array if no values exist', () => {
  const emptyLicense = { creators: [], rightsholders: [], processors: [] };
  expect(getFirstNonEmptyLicenseCredits(emptyLicense)).toEqual([]);
});

test('getFirstNonEmptyLicenseCredits returns the first non-empty array in a license object', () => {
  const creator1 = { name: 'crea tor', type: 'creator' };
  const creator2 = { name: 'crea tor too', type: 'creator' };
  const rightsholder = { name: 'Right holder', type: 'rightsholder' };
  const processor = { name: 'test2', type: 'processor' };
  const licenseWithFirst = { creators: [creator1], rightsholders: [], processors: [] };
  const licenseWithLast = { creators: [], rightsholders: [], processors: [processor] };
  const licenseWithAll = {
    creators: [creator1, creator2],
    rightsholders: [rightsholder],
    processors: [processor],
  };
  expect(getFirstNonEmptyLicenseCredits(licenseWithFirst)).toEqual([creator1]);
  expect(getFirstNonEmptyLicenseCredits(licenseWithLast)).toEqual([processor]);
  expect(getFirstNonEmptyLicenseCredits(licenseWithAll)).toEqual([creator1, creator2]);
});
