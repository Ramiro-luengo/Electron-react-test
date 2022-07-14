export default function JSON_minify(json) {
  const tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g;
  let inString = false;
  let inMultilineComment = false;
  let inSinglelineComment = false;
  let tmp;
  let tmp2;
  const newStr = [];
  let ns = 0;
  let from = 0;
  let lc;
  let rc;
  let prevFrom;

  tokenizer.lastIndex = 0;

  while ((tmp = tokenizer.exec(json))) {
    lc = RegExp.leftContext;
    rc = RegExp.rightContext;
    if (!inMultilineComment && !inSinglelineComment) {
      tmp2 = lc.substring(from);
      if (!inString) {
        tmp2 = tmp2.replace(/(\n|\r|\s)+/g, '');
      }
      newStr[ns++] = tmp2;
    }
    prevFrom = from;
    from = tokenizer.lastIndex;

    // found a " character, and we're not currently in
    // a comment? check for previous `\` escaping immediately
    // leftward adjacent to this match
    if (tmp[0] == '"' && !inMultilineComment && !inSinglelineComment) {
      // perform look-behind escaping match, but
      // limit left-context matching to only go back
      // to the position of the last token match
      //
      // see: https://github.com/getify/JSON.minify/issues/64
      tmp2 = lc.substring(prevFrom).match(/\\+$/);

      // start of string with ", or unescaped " character found to end string?
      if (!inString || !tmp2 || tmp2[0].length % 2 == 0) {
        inString = !inString;
      }
      from--; // include " character in next catch
      rc = json.substring(from);
    } else if (
      tmp[0] == '/*' &&
      !inString &&
      !inMultilineComment &&
      !inSinglelineComment
    ) {
      inMultilineComment = true;
    } else if (
      tmp[0] == '*/' &&
      !inString &&
      inMultilineComment &&
      !inSinglelineComment
    ) {
      inMultilineComment = false;
    } else if (
      tmp[0] == '//' &&
      !inString &&
      !inMultilineComment &&
      !inSinglelineComment
    ) {
      inSinglelineComment = true;
    } else if (
      (tmp[0] == '\n' || tmp[0] == '\r') &&
      !inString &&
      !inMultilineComment &&
      inSinglelineComment
    ) {
      inSinglelineComment = false;
    } else if (
      !inMultilineComment &&
      !inSinglelineComment &&
      !/\n|\r|\s/.test(tmp[0])
    ) {
      newStr[ns++] = tmp[0];
    }
  }
  newStr[ns++] = rc;
  return newStr.join('');
}
