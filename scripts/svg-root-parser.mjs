const xmlWhitespace = new Set([" ", "\t", "\n", "\r"]);
const svgRootBoundaries = new Set([...xmlWhitespace, "/", ">", undefined]);

function skipXmlWhitespace(markup, startIndex) {
  let index = startIndex;

  while (xmlWhitespace.has(markup[index])) {
    index += 1;
  }

  return index;
}

function skipXmlDeclaration(markup, startIndex) {
  if (!markup.startsWith("<?xml", startIndex)) {
    return startIndex;
  }

  const declarationEnd = markup.indexOf("?>", startIndex + 5);
  return declarationEnd === -1 ? -1 : skipXmlWhitespace(markup, declarationEnd + 2);
}

function consumeComment(markup, startIndex) {
  if (!markup.startsWith("<!--", startIndex)) {
    return startIndex;
  }

  const commentEnd = markup.indexOf("-->", startIndex + 4);
  return commentEnd === -1 ? -1 : skipXmlWhitespace(markup, commentEnd + 3);
}

function skipLeadingComments(markup, startIndex) {
  let index = startIndex;
  let nextIndex = consumeComment(markup, index);

  while (nextIndex > index) {
    index = nextIndex;
    nextIndex = consumeComment(markup, index);
  }

  return nextIndex;
}

function updateQuote(quote, character) {
  if (quote !== "") {
    return character === quote ? "" : quote;
  }

  return character === '"' || character === "'" ? character : "";
}

function createTagEndPredicate() {
  let quote = "";

  return (character) => {
    const isEnd = character === ">" && quote === "";
    quote = updateQuote(quote, character);
    return isEnd;
  };
}

function findTagEnd(markup, startIndex) {
  const relativeEnd = markup.slice(startIndex).split("").findIndex(createTagEndPredicate());
  return relativeEnd === -1 ? -1 : startIndex + relativeEnd;
}

function isSvgRootStart(markup, startIndex) {
  return markup.startsWith("<svg", startIndex) && svgRootBoundaries.has(markup[startIndex + 4]);
}

function sliceRootAttributes(markup, startIndex) {
  const attributesStart = startIndex + 4;
  const rootEnd = findTagEnd(markup, attributesStart);
  return rootEnd === -1 ? null : markup.slice(attributesStart, rootEnd);
}

export function findSvgRootAttributes(markup) {
  const afterBom = markup.charCodeAt(0) === 0xfeff ? 1 : 0;
  const declarationStart = skipXmlWhitespace(markup, afterBom);
  const commentStart = skipXmlDeclaration(markup, declarationStart);

  if (commentStart === -1) {
    return null;
  }

  const rootStart = skipLeadingComments(markup, commentStart);

  if (rootStart === -1 || !isSvgRootStart(markup, rootStart)) {
    return null;
  }

  return sliceRootAttributes(markup, rootStart);
}
