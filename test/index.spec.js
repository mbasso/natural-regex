import expect from 'expect';
import NaturalRegex from '../src/';

describe('natural-regex', () => {
  describe('Values', () => {
    it('alphanumeric', () => {
      expect(
        NaturalRegex.from('alphanumeric').toString()
      ).toEqual('/\\w/');
    });

    it('tab', () => {
      expect(
        NaturalRegex.from('tab').toString()
      ).toEqual('/\\t/');
    });

    it('vertical tab', () => {
      expect(
        NaturalRegex.from('vertical tab').toString()
      ).toEqual('/\\v/');
    });

    it('non word', () => {
      expect(
        NaturalRegex.from('non word').toString()
      ).toEqual('/\\W/');
    });

    it('space', () => {
      expect(
        NaturalRegex.from('space').toString()
      ).toEqual('/\\s/');
    });

    it('white space', () => {
      expect(
        NaturalRegex.from('white space').toString()
      ).toEqual('/\\S/');
    });

    it('null', () => {
      expect(
        NaturalRegex.from('null').toString()
      ).toEqual('/\\0/');
      expect(
        NaturalRegex.from('nothing').toString()
      ).toEqual('/\\0/');
      expect(
        NaturalRegex.from('nil').toString()
      ).toEqual('/\\0/');
    });

    it('return', () => {
      expect(
        NaturalRegex.from('return').toString()
      ).toEqual('/\\r/');
    });

    it('form feed', () => {
      expect(
        NaturalRegex.from('form feed').toString()
      ).toEqual('/\\f/');
    });

    it('line feed', () => {
      expect(
        NaturalRegex.from('line feed').toString()
      ).toEqual('/\\n/');
    });

    it('digit', () => {
      expect(
        NaturalRegex.from('digit').toString()
      ).toEqual('/\\d/');
      expect(
        NaturalRegex.from('number').toString()
      ).toEqual('/\\d/');
    });

    it('non digit', () => {
      expect(
        NaturalRegex.from('non digit').toString()
      ).toEqual('/\\D/');
      expect(
        NaturalRegex.from('non number').toString()
      ).toEqual('/\\D/');
    });

    it('backspace', () => {
      expect(
        NaturalRegex.from('backspace').toString()
      ).toEqual('/[\\b]/');
    });

    it('any character', () => {
      expect(
        NaturalRegex.from('any character').toString()
      ).toEqual('/./');
    });

    it('control character', () => {
      expect(
        NaturalRegex.from('control character A').toString()
      ).toEqual('/\\cA/');
    });

    it('sentence', () => {
      expect(
        NaturalRegex.from('"Ciao"').toString()
      ).toEqual('/Ciao/');
    });

    it('hex', () => {
      expect(
        NaturalRegex.from('hex ab').toString()
      ).toEqual('/\\xab/');
      expect(
        NaturalRegex.from('hex abcd').toString()
      ).toEqual('/\\uabcd/');
      expect(
        NaturalRegex.from('hex 43').toString()
      ).toEqual('/\\x43/');
    });
  });

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
  });

  describe('Start and End', () => {
    it('starts with', () => {
      expect(
        NaturalRegex.from('starts with alphanumeric').toString()
      ).toEqual('/^(\\w)/');
    });

    it('end', () => {
      expect(
        NaturalRegex.from('starts with alphanumeric, end').toString()
      ).toEqual('/^(\\w)$/');
    });

    it('end of line', () => {
      const compiled = '/\\w\\w/';
      expect(
        NaturalRegex.from('alphanumeric, alphanumeric').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('alphanumeric and alphanumeric').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('alphanumeric.').toString()
      ).toEqual('/\\w/');
      expect(
        NaturalRegex.from('alphanumeric then alphanumeric').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('alphanumeric, then alphanumeric').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('alphanumeric and then alphanumeric').toString()
      ).toEqual(compiled);
    });
  });

  describe('Set and Group', () => {
    it('Group', () => {
      expect(
        NaturalRegex.from('group from a to z end group.').toString()
      ).toEqual('/(?:a-z)/');
    });

    it('Charset', () => {
      expect(
        NaturalRegex.from('in charset: a, b, c, d.').toString()
      ).toEqual('/[abcd]/');
    });

    it('Not in charset', () => {
      expect(
        NaturalRegex.from('not in charset: a, b, c, d.').toString()
      ).toEqual('/[^abcd]/');
    });
  });

  describe('Length', () => {
    it('length', () => {
      expect(
        NaturalRegex.from('alphanumeric, length 2').toString()
      ).toEqual('/\\w{2}/');
    });

    it('minimum length', () => {
      expect(
        NaturalRegex.from('alphanumeric, minimum length 2').toString()
      ).toEqual('/\\w{2,}/');
    });

    it('length from to', () => {
      expect(
        NaturalRegex.from('alphanumeric, length from 2 to 10').toString()
      ).toEqual('/\\w{2,10}/');
    });
  });

  describe('Repetition', () => {
    it('optional more times', () => {
      expect(
        NaturalRegex.from('alphanumeric optional more times').toString()
      ).toEqual('/(\\w)*/');
    });

    it('required one or more times', () => {
      expect(
        NaturalRegex.from('alphanumeric required one or more times').toString()
      ).toEqual('/(\\w)+/');
    });

    it('optional one time', () => {
      expect(
        NaturalRegex.from('alphanumeric optional one time').toString()
      ).toEqual('/(\\w)?/');
    });

    it('from to times', () => {
      expect(
        NaturalRegex.from('alphanumeric from 1 to 7 times').toString()
      ).toEqual('/(\\w){1,7}/');
    });

    it('for 7 times', () => {
      expect(
        NaturalRegex.from('alphanumeric for 7 times').toString()
      ).toEqual('/(\\w){7}/');
    });
  });

  describe('Binary', () => {
    it('or', () => {
      expect(
        NaturalRegex.from('alphanumeric or digit').toString()
      ).toEqual('/(\\w|\\d)/');
    });

    it('followed by', () => {
      expect(
        NaturalRegex.from('alphanumeric followed by digit').toString()
      ).toEqual('/(\\w)(?=\\d)/');
    });

    it('not followed by', () => {
      expect(
        NaturalRegex.from('alphanumeric not followed by digit').toString()
      ).toEqual('/(\\w)(?!\\d)/');
    });

    it('range', () => {
      expect(
        NaturalRegex.from('from a to z').toString()
      ).toEqual('/a-z/');
      expect(
        NaturalRegex.from('from 0 to 9').toString()
      ).toEqual('/0-9/');
    });
  });

  describe('Utils', () => {
    it('anything', () => {
      expect(
        NaturalRegex.from('anything').toString()
      ).toEqual('/.*/');
    });
  });

  describe('Characters', () => {
    it('comma', () => {
      const compiled = '/\\,/';
      expect(
        NaturalRegex.from(',').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('comma').toString()
      ).toEqual(compiled);
    });

    it('point', () => {
      const compiled = '/\\./';
      expect(
        NaturalRegex.from('.').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('point').toString()
      ).toEqual(compiled);
    });

    it('plus', () => {
      const compiled = '/\\+/';
      expect(
        NaturalRegex.from('+').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('plus').toString()
      ).toEqual(compiled);
    });

    it('asterisk', () => {
      const compiled = '/\\*/';
      expect(
        NaturalRegex.from('*').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('asterisk').toString()
      ).toEqual(compiled);
    });

    it('question mark', () => {
      const compiled = '/\\?/';
      expect(
        NaturalRegex.from('?').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('question mark').toString()
      ).toEqual(compiled);
    });

    it('quotation mark', () => {
      const compiled = '/\\"/';
      expect(
        NaturalRegex.from('"').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('quotation mark').toString()
      ).toEqual(compiled);
    });

    it('pipe', () => {
      const compiled = '/\\|/';
      expect(
        NaturalRegex.from('|').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('pipe').toString()
      ).toEqual(compiled);
    });

    it('dollar', () => {
      const compiled = '/\\$/';
      expect(
        NaturalRegex.from('$').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('dollar').toString()
      ).toEqual(compiled);
    });

    it('colon', () => {
      const compiled = '/\\:/';
      expect(
        NaturalRegex.from(':').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('colon').toString()
      ).toEqual(compiled);
    });

    it('exclamation mark', () => {
      const compiled = '/\\!/';
      expect(
        NaturalRegex.from('!').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('exclamation mark').toString()
      ).toEqual(compiled);
    });

    it('right square bracket', () => {
      const compiled = '/\\]/';
      expect(
        NaturalRegex.from(']').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right square bracket').toString()
      ).toEqual(compiled);
    });

    it('left square bracket', () => {
      const compiled = '/\\[/';
      expect(
        NaturalRegex.from('[').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left square bracket').toString()
      ).toEqual(compiled);
    });

    it('right curly bracket', () => {
      const compiled = '/\\}/';
      expect(
        NaturalRegex.from('}').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right curly bracket').toString()
      ).toEqual(compiled);
    });

    it('left curly bracket', () => {
      const compiled = '/\\{/';
      expect(
        NaturalRegex.from('{').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left curly bracket').toString()
      ).toEqual(compiled);
    });

    it('right round bracket', () => {
      const compiled = '/\\)/';
      expect(
        NaturalRegex.from(')').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right round bracket').toString()
      ).toEqual(compiled);
    });

    it('left round bracket', () => {
      const compiled = '/\\(/';
      expect(
        NaturalRegex.from('(').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left round bracket').toString()
      ).toEqual(compiled);
    });

    it('caret', () => {
      const compiled = '/\\^/';
      expect(
        NaturalRegex.from('^').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('caret').toString()
      ).toEqual(compiled);
    });

    it('backslash', () => {
      const compiled = '/\\\\/';
      expect(
        NaturalRegex.from('\\').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('backslash').toString()
      ).toEqual(compiled);
    });
  });
});
