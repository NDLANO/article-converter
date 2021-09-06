import { Remarkable } from 'remarkable';
import parse from 'html-react-parser';
import { renderString } from './render';

export const parseMarkdown = embeddedCaption => {
  const markdown = new Remarkable({ breaks: true, html: true });
  markdown.inline.ruler.enable(['sub', 'sup']);
  const caption = embeddedCaption || '';
  /**
   * Whitespace must be escaped in order for ^superscript^ and ~subscript~
   * to render properly. Superfluous whitespace must be escaped in order for
   * text within *italics* and *bold* to render properly.
   */
  const escapedMarkdown = markdown.render(caption.split(' ').join('\\ '));
  return parse(escapedMarkdown.split('\\').join(''));
};

export const markdownToHtmlString = markdown =>
  renderString(parseMarkdown(markdown));
