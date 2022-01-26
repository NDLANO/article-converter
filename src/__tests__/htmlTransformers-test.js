/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { prettify } from './testHelpers';
import {
  htmlTransforms,
  moveReactPortals,
  transformAsides,
  transformTables,
  transformLinksInOembed,
  addHeaderCopyLinkButtons,
} from '../htmlTransformers';

test('htmlTransforms changes ol to accommodate frontend styling', () => {
  const content = cheerio.load(`
  <section>
    <ol data-type='letters'>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
    <ol>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
  </section>`);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('<ol class="ol-list--roman">');
  expect(result).toMatch('<ol>');
});

test('htmlTransforms changes ol to accommodate listing resets', () => {
  const content = cheerio.load(`
  <section>
    <ol data-type='letters' start='2'>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
    <ol start='3'>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
    <ol>
        <li>Lorem ipsum dolor sit amet...</li>
    </ol>
  </section>`);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('<ol start="2" class="ol-list--roman ol-reset-2">');
  expect(result).toMatch('<ol start="3" class="ol-reset-3">');
  expect(result).toMatch('<ol>');
});

test('htmlTransforms changes ul to accommodate frontend styling', () => {
  const content = cheerio.load(`
  <section>
    <ul data-type='two-column'>
        <li>Lorem ipsum dolor sit amet...</li>
        <li>Lorem ipsum dolor sit amet...</li>
        <li>Lorem ipsum dolor sit amet...</li>
        <li>Lorem ipsum dolor sit amet...</li>
    </ul>
  </section>
    <ul>
        <li>Lorem ipsum dolor sit amet...</li>
    </ul>
  </section>`);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('<ul class="o-list--two-columns">');
  expect(result).toMatch('<ul>');
});

test('htmlTransforms adds display block to math tags', () => {
  const content = cheerio.load(`
  <section>
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>f</mi><mo>'</mo>
      <mfenced><mrow><mn>0</mn><mo>,</mo><mn>5</mn></mrow></mfenced>
      <mo>=</mo><mn>2</mn><mo>&#xB7;</mo><mn>0</mn><mo>,</mo><mn>5</mn><mo>=</mo><mn>1</mn>
    </math>
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      <mn>0</mn><mo>,</mo><mn>5</mn>
    </math>
  </section>
  `);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatchSnapshot();
});

test('htmlTransforms changes p to accommodate frontend styling', () => {
  const content = cheerio.load(`
  <section>
  <p data-align='center'>Lorem ipsum dolor sit amet...</p>
  </section>`);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('<p class="u-text-center">');
});

test('htmlTransforms changes span with data-size to a span with font size', () => {
  const content = cheerio.load(`
  <section>
  Lorem ipsum <span data-size="large">dolor</span> sit amet...
  </section>`);

  htmlTransforms.forEach((tagReplacer) => tagReplacer(content));
  const result = content.html();

  expect(result).toMatch('Lorem ipsum <span class="u-large-body-text">dolor</span> sit amet');
});

test('move react portals to bottom', () => {
  const content = cheerio.load(`
  <section>
    <figure>
      <p>Lorem ipsum dolor sit amet...</p>
      <div data-react-universal-portal="true"><h2>Modal dialog</h2><div>Stuff</div></div>
    </figure>
  </section>`);

  moveReactPortals(content);

  const result = content.html();

  expect(result).toMatchSnapshot();
});

test('transformAsides duplicates right column aside for better narrowscreen experience', () => {
  const content = cheerio.load(`
  <section>
    <figure>
      <p>Lorem ipsum dolor sit amet...</p>
    </figure>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <p>sdfjljklsdfjlsdf</p>
    <figure>
      <p>Lorem ipsum dolor sit amet...</p>
      <div data-react-universal-portal="true"><h2>Modal dialog</h2><div>Stuff</div></div>
    </figure>
    <p>sdfjljklsdfjlsdf</p>
  </section>`);

  transformAsides(content);

  const result = content('body').html();
  expect(prettify(result)).toMatchSnapshot();
});

test('transformAsides encloses aside duplication to sections', () => {
  const content = cheerio.load(`
  <section>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <p>Lorem</p>
  </section>
  <section>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <p>Ipsum</p>
  </section>`);

  transformAsides(content);

  const result = content('body').html();
  expect(prettify(result)).toMatchSnapshot();
});

test('transformAsides replaces factAsides with factbox component', () => {
  const content = cheerio.load(`
  <section>
    <p>Lorem ipsum dolor sit amet...</p>
    <aside data-type='factAside'><h2>Test1</h2><div>Stuff</div></aside>
  </section>
    <aside data-type="factAside"><h2>Test2</h2><div>Other stuff</div></aside>
    <p>Lorem ipsum dolor sit amet...</p>
  </section>`);

  transformAsides(content);

  const result = content('body').html();
  expect(prettify(result)).toMatchSnapshot();
});

test('transformTables replaces table with <Table>', () => {
  const content = cheerio.load(`
  <table>
  <thead>
  <tr><th>test</th>
  <th>test</th>
  <th>test</th></tr>
  </thead>
  <tbody>
  <tr><td>test</td><td>test</td><td>test</td></tr>
  <tr><td>test</td><td>test</td><td>test</td></tr>
  <tr><td>test</td><td>test</td><td>test</td></tr>
  </tbody>
  </table>`);

  transformTables(content);

  const result = content('body').html();
  expect(prettify(result)).toMatchSnapshot();
});

test('transformLinksInOembed adds target blank to a if oembed', () => {
  const content = cheerio.load(`
  <section>
  <a href='https://external.com'>Lorem ipsum dolor sit amet...</a>
  </section>`);

  transformLinksInOembed(content, 'nb', { isOembed: true });

  const result = content.html();

  expect(prettify(result)).toMatchSnapshot();
});

test('addHeaderCopyLinkButtons only transforms h2 on root level', () => {
  const content = cheerio.load(`
  <section>
    <figure>
      <h2>Lorem ipsum dolor sit amet...</h2>
    </figure>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <h2>sdfjljklsdfjlsdf</h2>
    <details>
      <summary>Lorem ipsum dolor sit amet...</summary>
      <div data-react-universal-portal="true"><h2>Modal dialog</h2><div>Stuff</div></div>
    </details>
    <div class="c-bodybox">
      <h2>sdfjljklsdfjlsdf</h2>
    </div>
    <p>sdfjljklsdfjlsdf</p>
  </section>`);

  addHeaderCopyLinkButtons(content);

  const result = content('body').html();
  expect(prettify(result)).toMatchSnapshot();
});
