/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { tagReplacers, transform } from '../transformers';

test('transformers/tagReplacers changes aside to accommodate frontend styling', () => {
  const content = cheerio.load(`
  <section>
    <p>Lorem ipsum dolor sit amet...</p>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
  </section>
    <aside><h2>Test2</h2><div>Other stuff</div></aside>
    <p>Lorem ipsum dolor sit amet...</p>
  </section>`);

  tagReplacers.forEach(tagReplacer => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch(
    '<aside class="c-aside c-aside--float expanded"><div class="c-aside__content"><h2>Test1</h2><div>Stuff</div></div></aside>'
  );
  expect(result).toMatch(
    '<aside class="c-aside c-aside--float expanded"><div class="c-aside__content"><h2>Test2</h2><div>Other stuff</div></div></aside>'
  );
});

test('transformers/tagReplacers changes ol to accommodate frontend styling', () => {
  const content = cheerio.load(`
  <section>
    <ol data-type='letters'>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
  </section>
    <ol>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
  </section>`);

  tagReplacers.forEach(tagReplacer => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('<ol class="ol-list--roman">');
  expect(result).toMatch('<ol>');
});
