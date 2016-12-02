const tags = [
  { tag: '</p>', extraMargin: 32 },
  { tag: '</h1>', extraMargin: 32 },
  { tag: '</h2>', extraMargin: 32 },
  { tag: '</h3>', extraMargin: 32 },
  { tag: '</ol>', extraMargin: 32 },
  { tag: '</ul>', extraMargin: 32 },
  { tag: '</tr>', extraMargin: 20 },
];

const counter = (string, substring) => {
  let n = 0;
  let pos = 0;

  while (true) {
    pos = string.indexOf(substring, pos);
    if (pos !== -1) {
      n += 1;
      pos += substring.length;
    } else {
      break;
    }
  }
  return n;
};
const calulateTableHeight = (content) => {
  let tableHeight = 0;
  const tables = (content.match('<table>(.*?)</table>') || []);
  tables.forEach((table) => {
    const rows = (table.match('<tr>(.*?)</tr>') || []);
    rows.forEach(() => {
      tableHeight += 40;
    });
  });
  return tableHeight;
};
const calculateListHeight = (content, width) => {
  const lists = (content.match('<ul>(.*?)</ul>') || []).concat((content.match('<ol>(.*?)</ol>') || []));
  let listHeight = 0;
  lists.forEach((list) => {
    (list.match('<li>(.*?)</li>') || []).forEach((row) => {
      const numberOfLines = Math.ceil((row.length * 2) / width);
      listHeight += numberOfLines * 32;
    });
  });
  return listHeight;
};

const calculateFigureHeight = (word, width) => {
  const figureHeight = (width / 16) * 9; // 16:9 converter for figures...
  return counter(word, '</figure>') * figureHeight;
};

export const computeHeightWithCountingAlgorithm = (article, width) => {
  let iframeWidth = width;
  if (article.content.includes('</aside>')) {
    iframeWidth *= 0.75;
  }
  const words = article.content.split(' ');
  let height = (Math.ceil((article.introduction.length * 10) / width) * 28) + 80;
  console.log(height);
  height += calulateTableHeight(article.content) + calculateListHeight(article.content, iframeWidth) + calculateFigureHeight(article.content, iframeWidth);
  let currentWidth = 0;
  words.forEach((word) => {
    const wordLength = word.length * 10;
    if ((currentWidth + wordLength) > iframeWidth) {
      height += 28;
      currentWidth = wordLength;
    } else {
      currentWidth += wordLength;
    }
    tags.forEach((tagElement) => {
      height += counter(word, tagElement.tag) * tagElement.extraMargin;
    });
  });
  return height;
};
