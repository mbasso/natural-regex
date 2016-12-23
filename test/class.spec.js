import expect from 'expect';
import NaturalRegex from '../src/';

describe('Class', () => {
  it('should create', () => {
    const regexp = NaturalRegex.from('alphanumeric');
    expect(regexp).toBeA(RegExp);
    expect(regexp.toString()).toEqual('/\\w/');
  });

  it('should parse', () => {
    expect(NaturalRegex.parse).toBeA('function');
    const regexp = NaturalRegex.parse('alphanumeric');
    expect(regexp).toBeA('string');
    expect(regexp).toEqual('\\w');
    expect(NaturalRegex.parse('')).toEqual('');
    expect(NaturalRegex.parse('  ')).toEqual('');
  });

  it('should get parser', () => {
    expect(NaturalRegex).toBeA('function');
    expect(NaturalRegex.parser).toBeA(Object);
  });

  it('should replace', () => {
    let newString = NaturalRegex.replace({
      string: 'foo is awesome, foo!',
      match: 'starts with foo',
      replace: 'bar',
    });
    expect(newString).toEqual('bar is awesome, foo!');
    newString = NaturalRegex.replace({
      string: '08/12/2014',
      match: '/, year',
      replace: '/2016',
    });
    expect(newString).toEqual('08/12/2016');
    newString = NaturalRegex.replace({
      string: 'foo foo',
      match: 'F',
      replace: 'fo',
      flags: 'i',
    });
    expect(newString).toEqual('fooo foo');
  });
});
