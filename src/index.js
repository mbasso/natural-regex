//eslint-disable-next-line
import { parser } from './language';

const flagsMap = {
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  unicode: 'u',
  sticky: 'y',
};

const getFlags = (flags) => {
  let result = '';
  if (typeof flags === 'string') {
    result = flags;
  } else if (typeof flags === 'object') {
    Object.keys(flagsMap).forEach(x => {
      if (flags[x]) {
        result += flagsMap[x];
      }
    });
  }
  return result;
};

export default class NaturalRegex {

  static parser = parser
  static parse = (code) => NaturalRegex.parser.parse(code)
  static from = (code, flags) => new RegExp(NaturalRegex.parse(code), getFlags(flags))
  static replace = ({
    string = '',
    match = '',
    replace = '',
    flags = 'g',
  } = {}) => (
    string.replace(
      NaturalRegex.from(match, flags),
      replace
    )
  )

}
