import expect from 'expect';
import NaturalRegex from '../src/';

describe('Operands', () => {
  it('numbers', () => {
    expect(
      NaturalRegex.from('77').toString()
    ).toEqual('/77/');
  });

  describe('Characters', () => {
    it(',', () => {
      const compiled = '/\\,/';
      expect(
        NaturalRegex.from(',').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('comma').toString()
      ).toEqual(compiled);
    });

    it('.', () => {
      const compiled = '/\\./';
      expect(
        NaturalRegex.from('.').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('point').toString()
      ).toEqual(compiled);
    });

    it(';', () => {
      const compiled = '/;/';
      expect(
        NaturalRegex.from(';').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('semicolon').toString()
      ).toEqual(compiled);
    });

    it('^', () => {
      const compiled = '/\\^/';
      expect(
        NaturalRegex.from('^').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('caret').toString()
      ).toEqual(compiled);
    });

    it('+', () => {
      const compiled = '/\\+/';
      expect(
        NaturalRegex.from('+').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('plus').toString()
      ).toEqual(compiled);
    });

    it('-', () => {
      let minus = NaturalRegex.from('-');
      expect(
        minus.toString()
      ).toEqual('/\\-/');
      minus = NaturalRegex.from('minus');
      expect(
        minus.toString()
      ).toEqual('/\\-/');
      expect(minus.test(' ')).toBeFalsy();
      expect(minus.test('-')).toBeTruthy();
      minus = NaturalRegex.from('in charset: a, -, c;');
      expect(
        minus.toString()
      ).toEqual('/[a\\-c]/');
      expect(minus.test('a')).toBeTruthy();
      expect(minus.test('-')).toBeTruthy();
      expect(minus.test('b')).toBeFalsy();
    });

    it('_', () => {
      let underscore = NaturalRegex.from('_');
      expect(
        underscore.toString()
      ).toEqual('/_/');
      underscore = NaturalRegex.from('underscore');
      expect(
        underscore.toString()
      ).toEqual('/_/');
      expect(underscore.test('_')).toBeTruthy();
    });

    it('*', () => {
      const compiled = '/\\*/';
      expect(
        NaturalRegex.from('*').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('asterisk').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('star').toString()
      ).toEqual(compiled);
    });

    it('?', () => {
      const compiled = '/\\?/';
      expect(
        NaturalRegex.from('?').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('question mark').toString()
      ).toEqual(compiled);
    });

    it('(', () => {
      const compiled = '/\\(/';
      expect(
        NaturalRegex.from('(').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left round bracket').toString()
      ).toEqual(compiled);
    });

    it(')', () => {
      const compiled = '/\\)/';
      expect(
        NaturalRegex.from(')').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right round bracket').toString()
      ).toEqual(compiled);
    });

    it('{', () => {
      const compiled = '/\\{/';
      expect(
        NaturalRegex.from('{').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left curly bracket').toString()
      ).toEqual(compiled);
    });

    it('}', () => {
      const compiled = '/\\}/';
      expect(
        NaturalRegex.from('}').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right curly bracket').toString()
      ).toEqual(compiled);
    });

    it('[', () => {
      const compiled = '/\\[/';
      expect(
        NaturalRegex.from('[').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('left square bracket').toString()
      ).toEqual(compiled);
    });

    it(']', () => {
      const compiled = '/\\]/';
      expect(
        NaturalRegex.from(']').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('right square bracket').toString()
      ).toEqual(compiled);
    });

    it(':', () => {
      const compiled = '/\\:/';
      expect(
        NaturalRegex.from(':').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('colon').toString()
      ).toEqual(compiled);
    });

    it('!', () => {
      const compiled = '/\\!/';
      expect(
        NaturalRegex.from('!').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('exclamation mark').toString()
      ).toEqual(compiled);
    });

    it('|', () => {
      const compiled = '/\\|/';
      expect(
        NaturalRegex.from('|').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('pipe').toString()
      ).toEqual(compiled);
    });

    it('$', () => {
      const compiled = '/\\$/';
      expect(
        NaturalRegex.from('$').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('dollar').toString()
      ).toEqual(compiled);
    });

    it('"', () => {
      const compiled = '/\\"/';
      expect(
        NaturalRegex.from('"').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('quotation mark').toString()
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

    it('slash', () => {
      const compiled = '/\\//';
      expect(
        NaturalRegex.from('/').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('slash').toString()
      ).toEqual(compiled);
    });
  });

  it('words', () => {
    expect(
      NaturalRegex.from('foo77bar').toString()
    ).toEqual('/foo77bar/');
  });

  it('escape', () => {
    const escape = NaturalRegex.from('"underscore \\"test\\"", foo, "');
    expect(
      escape.toString()
    ).toEqual('/underscore\\s\\"test\\"foo\\"/');
    expect(escape.test('underscore "test"foo"')).toBeTruthy();
    expect(escape.test('underscore "test"foo')).toBeFalsy();
    expect(escape.test('underscore"test"foo"')).toBeFalsy();
    expect(escape.test('underscore test"foo"')).toBeFalsy();
  });

  it('start', () => {
    expect(
      NaturalRegex.from('start, alphanumeric, end').toString()
    ).toEqual('/^\\w$/');
  });

  it('end', () => {
    expect(
      NaturalRegex.from('starts with alphanumeric, end').toString()
    ).toEqual('/^(?:\\w)$/');
  });

  it('space', () => {
    expect(
      NaturalRegex.from('space').toString()
    ).toEqual('/\\s/');
  });

  it('non space', () => {
    expect(
      NaturalRegex.from('non space').toString()
    ).toEqual('/\\S/');
  });

  it('alphanumeric', () => {
    expect(
      NaturalRegex.from('alphanumeric').toString()
    ).toEqual('/\\w/');
  });

  it('non alphanumeric', () => {
    expect(
      NaturalRegex.from('non alphanumeric').toString()
    ).toEqual('/\\W/');
  });

  it('digit', () => {
    expect(
      NaturalRegex.from('digit').toString()
    ).toEqual('/\\d/');
  });

  it('non digit', () => {
    expect(
      NaturalRegex.from('non digit').toString()
    ).toEqual('/\\D/');
  });

  it('any character', () => {
    expect(
      NaturalRegex.from('any character').toString()
    ).toEqual('/./');
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

  it('null', () => {
    expect(
      NaturalRegex.from('null').toString()
    ).toEqual('/\\0/');
  });

  it('newline, return', () => {
    expect(
      NaturalRegex.from('return').toString()
    ).toEqual('/\\r/');
  });

  it('line feed', () => {
    expect(
      NaturalRegex.from('line feed').toString()
    ).toEqual('/\\n/');
  });

  it('form feed', () => {
    expect(
      NaturalRegex.from('form feed').toString()
    ).toEqual('/\\f/');
  });

  it('backspace', () => {
    expect(
      NaturalRegex.from('backspace').toString()
    ).toEqual('/[\\b]/');
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
    expect(
      () => NaturalRegex.from('hex 4x')
    ).toThrow();
  });

  it('ctrl+', () => {
    expect(
      NaturalRegex.from('ctrl+A').toString()
    ).toEqual('/\\cA/');
  });
});

/* it('range', () => {
  expect(
    NaturalRegex.from('from a to z').toString()
  ).toEqual('/[a-z]/');
  expect(
    NaturalRegex.from('from 0 to 9').toString()
  ).toEqual('/[0-9]/');
}); */
