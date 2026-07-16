const javaScriptMimeTypes = new Set([
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
]);

const asciiWhitespace = new Set(["\t", "\n", "\f", "\r", " "]);

function toAsciiLowerCase(value) {
  return value.replace(/[A-Z]/g, (character) => character.toLowerCase());
}

function isTagBoundary(character) {
  return (
    character === undefined ||
    asciiWhitespace.has(character) ||
    character === "/" ||
    character === ">"
  );
}

function findTagStart(normalizedHtml, tagStart, fromIndex) {
  const tagIndex = normalizedHtml.indexOf(tagStart, fromIndex);

  if (tagIndex === -1 || isTagBoundary(normalizedHtml[tagIndex + tagStart.length])) {
    return tagIndex;
  }

  return findTagStart(normalizedHtml, tagStart, tagIndex + tagStart.length);
}

function createTagScanState(mode, isTagEnd = false) {
  return { isTagEnd, mode };
}

function scanBeforeAttributeName(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("beforeAttributeName");
  }

  if (character === ">") {
    return createTagScanState("beforeAttributeName", true);
  }

  if (character === "/") {
    return createTagScanState("selfClosingStartTag");
  }

  return createTagScanState("attributeName");
}

function scanAttributeName(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("afterAttributeName");
  }

  if (character === "/") {
    return createTagScanState("selfClosingStartTag");
  }

  if (character === "=") {
    return createTagScanState("beforeAttributeValue");
  }

  if (character === ">") {
    return createTagScanState("attributeName", true);
  }

  return createTagScanState("attributeName");
}

function scanAfterAttributeName(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("afterAttributeName");
  }

  if (character === "/") {
    return createTagScanState("selfClosingStartTag");
  }

  if (character === "=") {
    return createTagScanState("beforeAttributeValue");
  }

  if (character === ">") {
    return createTagScanState("afterAttributeName", true);
  }

  return createTagScanState("attributeName");
}

function scanBeforeAttributeValue(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("beforeAttributeValue");
  }

  if (character === '"') {
    return createTagScanState("doubleQuotedAttributeValue");
  }

  if (character === "'") {
    return createTagScanState("singleQuotedAttributeValue");
  }

  if (character === ">") {
    return createTagScanState("beforeAttributeValue", true);
  }

  return createTagScanState("unquotedAttributeValue");
}

function scanDoubleQuotedAttributeValue(character) {
  return createTagScanState(
    character === '"' ? "afterQuotedAttributeValue" : "doubleQuotedAttributeValue",
  );
}

function scanSingleQuotedAttributeValue(character) {
  return createTagScanState(
    character === "'" ? "afterQuotedAttributeValue" : "singleQuotedAttributeValue",
  );
}

function scanUnquotedAttributeValue(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("beforeAttributeName");
  }

  if (character === ">") {
    return createTagScanState("unquotedAttributeValue", true);
  }

  return createTagScanState("unquotedAttributeValue");
}

function scanAfterQuotedAttributeValue(character) {
  if (asciiWhitespace.has(character)) {
    return createTagScanState("beforeAttributeName");
  }

  if (character === "/") {
    return createTagScanState("selfClosingStartTag");
  }

  if (character === ">") {
    return createTagScanState("afterQuotedAttributeValue", true);
  }

  return scanBeforeAttributeName(character);
}

function scanSelfClosingStartTag(character) {
  if (character === ">") {
    return createTagScanState("selfClosingStartTag", true);
  }

  return scanBeforeAttributeName(character);
}

const tagStateScanners = Object.freeze({
  afterAttributeName: scanAfterAttributeName,
  afterQuotedAttributeValue: scanAfterQuotedAttributeValue,
  attributeName: scanAttributeName,
  beforeAttributeName: scanBeforeAttributeName,
  beforeAttributeValue: scanBeforeAttributeValue,
  doubleQuotedAttributeValue: scanDoubleQuotedAttributeValue,
  selfClosingStartTag: scanSelfClosingStartTag,
  singleQuotedAttributeValue: scanSingleQuotedAttributeValue,
  unquotedAttributeValue: scanUnquotedAttributeValue,
});

function scanTagCharacter(state, character) {
  return tagStateScanners[state.mode](character);
}

function findTagEnd(html, fromIndex) {
  let state = createTagScanState("beforeAttributeName");
  const endOffset = html
    .slice(fromIndex)
    .split("")
    .findIndex((character) => {
      state = scanTagCharacter(state, character);
      return state.isTagEnd;
    });

  return endOffset === -1 ? -1 : fromIndex + endOffset;
}

function createUnclosedScriptElement(html, openingEnd, attributes) {
  return {
    attributes,
    content: html.slice(openingEnd + 1),
    nextIndex: html.length,
  };
}

function findScriptElement(html, normalizedHtml, fromIndex) {
  const openingStart = findTagStart(normalizedHtml, "<script", fromIndex);

  if (openingStart === -1) {
    return null;
  }

  const openingEnd = findTagEnd(html, openingStart + "<script".length);

  if (openingEnd === -1) {
    return null;
  }

  const attributes = html.slice(openingStart + "<script".length, openingEnd);
  const closingStart = findTagStart(normalizedHtml, "</script", openingEnd + 1);

  if (closingStart === -1) {
    return createUnclosedScriptElement(html, openingEnd, attributes);
  }

  const closingEnd = findTagEnd(html, closingStart + "</script".length);

  if (closingEnd === -1) {
    return createUnclosedScriptElement(html, openingEnd, attributes);
  }

  return {
    attributes,
    content: html.slice(openingEnd + 1, closingStart),
    nextIndex: closingEnd + 1,
  };
}

function getAttributeValue(attributes, targetName) {
  const attributePattern =
    /(?:^|\s)([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gu;
  const attribute = [...attributes.matchAll(attributePattern)].find(
    (match) => match[1].toLowerCase() === targetName,
  );

  if (attribute === undefined) {
    return undefined;
  }

  return attribute[2] ?? attribute[3] ?? attribute[4] ?? "";
}

function isExecutableInlineScript(attributes) {
  if (getAttributeValue(attributes, "src") !== undefined) {
    return false;
  }

  const scriptType = getAttributeValue(attributes, "type")?.trim().toLowerCase() ?? "";

  if (scriptType === "" || scriptType === "module") {
    return true;
  }

  const mimeEssence = scriptType.split(";", 1)[0].trim();

  return javaScriptMimeTypes.has(mimeEssence);
}

function countScriptBytes(html, normalizedHtml, state) {
  const scriptElement = findScriptElement(html, normalizedHtml, state.fromIndex);

  if (scriptElement === null) {
    return state.totalBytes;
  }

  const scriptBytes = isExecutableInlineScript(scriptElement.attributes)
    ? Buffer.byteLength(scriptElement.content, "utf8")
    : 0;

  return countScriptBytes(html, normalizedHtml, {
    fromIndex: scriptElement.nextIndex,
    totalBytes: state.totalBytes + scriptBytes,
  });
}

export function countInlineJavaScriptBytes(html) {
  return countScriptBytes(html, toAsciiLowerCase(html), { fromIndex: 0, totalBytes: 0 });
}
