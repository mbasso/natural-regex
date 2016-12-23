//eslint-disable-next-line
import { parser } from './language';

export default class NaturalRegex {

  static parser = parser
  static parse = (code) => NaturalRegex.parser.parse(code)
  static from = (code, flags = '') => new RegExp(NaturalRegex.parse(code), flags)
  static replace = ({
    string = '',
    match = '',
    replace = '',
    flags,
  } = {}) => (
    string.replace(
      new RegExp(NaturalRegex.parse(match), flags || 'g'),
      replace
    )
  )

}
