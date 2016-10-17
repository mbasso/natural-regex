//eslint-disable-next-line
import { parser } from './language';

export default class NaturalRegex {

  static parser = parser
  static parse = (code) => NaturalRegex.parser.parse(code)
  static from = (code) => new RegExp(NaturalRegex.parse(code))

}
