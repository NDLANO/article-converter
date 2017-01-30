/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { asideReplacers } from '../transformers';


test('transformers/asideReplacers changes aside to accommodate frontend styling', () => {
  const content = `
  <section>
    <p>Lorem ipsum dolor sit amet...</p>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
  </section>
    <aside><h2>Test2</h2><div>Other stuff</div></aside>
    <p>Lorem ipsum dolor sit amet...</p>
  </section>`;

  const result = asideReplacers.reduce((html, f) => f(html), content);

  expect(result).toMatch('<aside class="c-aside u-1/3@desktop"><div class="c-aside__content"><h2>Test1</h2><div>Stuff</div></div><button class="c-button c-aside__button"></button></aside>');
  expect(result).toMatch('<aside class="c-aside u-1/3@desktop"><div class="c-aside__content"><h2>Test2</h2><div>Other stuff</div></div><button class="c-button c-aside__button"></button></aside>');
});
