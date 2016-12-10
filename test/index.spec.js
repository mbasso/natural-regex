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

    it('non alphanumeric', () => {
      expect(
        NaturalRegex.from('non alphanumeric').toString()
      ).toEqual('/\\W/');
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

    it('null', () => {
      expect(
        NaturalRegex.from('null').toString()
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
    });

    it('non digit', () => {
      expect(
        NaturalRegex.from('non digit').toString()
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

    it('ctrl+', () => {
      expect(
        NaturalRegex.from('ctrl+A').toString()
      ).toEqual('/\\cA/');
    });

    it('word', () => {
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
    });
  });

  describe('Start and End', () => {
    it('starts with', () => {
      expect(
        NaturalRegex.from('starts with alphanumeric').toString()
      ).toEqual('/^(?:\\w)/');
    });

    it('end', () => {
      expect(
        NaturalRegex.from('starts with alphanumeric, end').toString()
      ).toEqual('/^(?:\\w)$/');
    });

    it('start', () => {
      expect(
        NaturalRegex.from('start, alphanumeric, end').toString()
      ).toEqual('/^\\w$/');
    });

    it('separators', () => {
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
    it('group', () => {
      expect(
        NaturalRegex.from('group from a to z end group').toString()
      ).toEqual('/([a-z])/');
    });
    it('group with "."', () => {
      expect(
        NaturalRegex.from('from a to z.').toString()
      ).toEqual('/[a-z]/');
    });

    it('Charset', () => {
      expect(
        NaturalRegex.from('in charset: a, b, c, d;').toString()
      ).toEqual('/[abcd]/');
    });

    it('Not in charset', () => {
      expect(
        NaturalRegex.from('not in charset: a, b, c, d, from a to z and from 0 to 9;').toString()
      ).toEqual('/[^abcda-z0-9]/');
    });
  });

  describe('Repetition', () => {
    it('optional more times', () => {
      expect(
        NaturalRegex.from('alphanumeric optional more times').toString()
      ).toEqual('/\\w*/');
    });

    it('one or more times', () => {
      expect(
        NaturalRegex.from('alphanumeric one or more times').toString()
      ).toEqual('/\\w+/');
    });

    it('optional', () => {
      expect(
        NaturalRegex.from('alphanumeric optional').toString()
      ).toEqual('/\\w?/');
    });

    it('from to times', () => {
      expect(
        NaturalRegex.from('alphanumeric from 1 to 7 times').toString()
      ).toEqual('/\\w{1,7}/');
    });

    it('for 14 times', () => {
      expect(
        NaturalRegex.from('alphanumeric for 14 times').toString()
      ).toEqual('/\\w{14}/');
    });

    it('smallest', () => {
      expect(
        NaturalRegex.from('alphanumeric optional more times (smallest)').toString()
      ).toEqual('/\\w*?/');
    });

    it('minimum repetition', () => {
      expect(
        NaturalRegex.from('alphanumeric minimum 2 times').toString()
      ).toEqual('/\\w{2,}/');
    });

    it('maximum repetition', () => {
      expect(
        NaturalRegex.from('alphanumeric maximum 2 times').toString()
      ).toEqual('/\\w{1,2}/');
    });
  });

  describe('Binary', () => {
    it('or', () => {
      expect(
        NaturalRegex.from('alphanumeric or digit').toString()
      ).toEqual('/(?:\\w|\\d)/');
    });

    it('followed by', () => {
      expect(
        NaturalRegex.from('alphanumeric followed by digit').toString()
      ).toEqual('/\\w(?=\\d)/');
    });

    it('not followed by', () => {
      expect(
        NaturalRegex.from('alphanumeric not followed by digit').toString()
      ).toEqual('/\\w(?!\\d)/');
    });

    it('range', () => {
      expect(
        NaturalRegex.from('from a to z').toString()
      ).toEqual('/[a-z]/');
      expect(
        NaturalRegex.from('from 0 to 9').toString()
      ).toEqual('/[0-9]/');
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

    it('semicolon', () => {
      const compiled = '/;/';
      expect(
        NaturalRegex.from(';').toString()
      ).toEqual(compiled);
      expect(
        NaturalRegex.from('semicolon').toString()
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
      expect(
        NaturalRegex.from('star').toString()
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

  describe('Escape', () => {
    it('[ and ]', () => {
      const brackets = NaturalRegex.from('in charset: [, ], a, c;');
      expect(
        brackets.toString()
      ).toEqual('/[\\[\\]ac]/');
      expect(brackets.test('[')).toBeTruthy();
      expect(brackets.test(']')).toBeTruthy();
      expect(brackets.test('a')).toBeTruthy();
      expect(brackets.test('c')).toBeTruthy();
    });

    it('( and )', () => {
      const brackets = NaturalRegex.from('( or )');
      expect(
        brackets.toString()
      ).toEqual('/(?:\\(|\\))/');
      expect(brackets.test('()')).toBeTruthy();
      expect(brackets.test(')')).toBeTruthy();
    });

    it('\\', () => {
      const backslash = NaturalRegex.from('\\');
      expect(
        backslash.toString()
      ).toEqual('/\\\\/');
      expect(backslash.test(' ')).toBeFalsy();
      expect(backslash.test('\\')).toBeTruthy();
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
  });

  describe('Helpers', () => {
    it('letter', () => {
      const letter = NaturalRegex.from('starts with letter');
      expect(
        letter.toString()
      ).toEqual('/^(?:[a-zA-Z])/');
      expect(letter.test('a')).toBeTruthy();
      expect(letter.test('A')).toBeTruthy();
      expect(letter.test('3')).toBeFalsy();
    });

    it('lowercase letter', () => {
      const letter = NaturalRegex.from('starts with lowercase letter');
      expect(
        letter.toString()
      ).toEqual('/^(?:[a-z])/');
      expect(letter.test('a')).toBeTruthy();
      expect(letter.test('A')).toBeFalsy();
      expect(letter.test('3')).toBeFalsy();
    });

    it('uppercase letter', () => {
      const letter = NaturalRegex.from('starts with uppercase letter');
      expect(
        letter.toString()
      ).toEqual('/^(?:[A-Z])/');
      expect(letter.test('a')).toBeFalsy();
      expect(letter.test('A')).toBeTruthy();
      expect(letter.test('3')).toBeFalsy();
    });

    it('word', () => {
      const word = NaturalRegex.from('starts with word, end');
      expect(
        word.toString()
      ).toEqual('/^(?:[a-zA-Z]+)$/');
      expect(word.test('FOO')).toBeTruthy();
      expect(word.test('foo')).toBeTruthy();
      expect(word.test('1')).toBeFalsy();
      expect(word.test('foo2bar')).toBeFalsy();
    });

    it('lowercase word', () => {
      const word = NaturalRegex.from('starts with lowercase word, end');
      expect(
        word.toString()
      ).toEqual('/^(?:[a-z]+)$/');
      expect(word.test('FOO')).toBeFalsy();
      expect(word.test('foo')).toBeTruthy();
      expect(word.test('1')).toBeFalsy();
      expect(word.test('foo2bar')).toBeFalsy();
    });

    it('uppercase word', () => {
      const word = NaturalRegex.from('starts with uppercase word, end');
      expect(
        word.toString()
      ).toEqual('/^(?:[A-Z]+)$/');
      expect(word.test('FOO')).toBeTruthy();
      expect(word.test('foo')).toBeFalsy();
      expect(word.test('1')).toBeFalsy();
      expect(word.test('foo2bar')).toBeFalsy();
    });

    it('number', () => {
      const number = NaturalRegex.from('starts with number, end');
      expect(
        number.toString()
      ).toEqual('/^(?:\\-?[0-9]+)$/');
      expect(number.test('foo')).toBeFalsy();
      expect(number.test('1')).toBeTruthy();
      expect(number.test('-1')).toBeTruthy();
      expect(number.test('1432')).toBeTruthy();
      expect(number.test('foo2bar')).toBeFalsy();
    });

    it('positive number', () => {
      const number = NaturalRegex.from('starts with positive number, end');
      expect(
        number.toString()
      ).toEqual('/^(?:[0-9]+)$/');
      expect(number.test('foo')).toBeFalsy();
      expect(number.test('1')).toBeTruthy();
      expect(number.test('-1')).toBeFalsy();
      expect(number.test('1432')).toBeTruthy();
      expect(number.test('foo2bar')).toBeFalsy();
    });

    it('negative number', () => {
      const number = NaturalRegex.from('starts with negative number, end');
      expect(
        number.toString()
      ).toEqual('/^(?:\\-[0-9]+)$/');
      expect(number.test('foo')).toBeFalsy();
      expect(number.test('1')).toBeFalsy();
      expect(number.test('-1')).toBeTruthy();
      expect(number.test('1432')).toBeFalsy();
      expect(number.test('foo2bar')).toBeFalsy();
    });

    describe('date', () => {
      it('date', () => {
        const date = NaturalRegex.from('starts with date, end');
        expect(
          date.toString()
          //eslint-disable-next-line
        ).toEqual('/^(?:(?:(?:31(\\/|-)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2}))$/');
        expect(date.test('01/01/1900')).toBeTruthy();
        expect(date.test('01-01-1900')).toBeTruthy();
        expect(date.test('01.01.1900')).toBeFalsy();
        expect(date.test('32/07/1900')).toBeFalsy();
        expect(date.test('foo2bar')).toBeFalsy();
      });

      it('hours', () => {
        const compiled = '/(?:0[0-9]|1[0-9]|2[0-4])/';
        const hours = NaturalRegex.from('hours');
        expect(
          hours.toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('hh').toString()
        ).toEqual(compiled);
        expect(hours.test('03')).toBeTruthy();
        expect(hours.test('13')).toBeTruthy();
        expect(hours.test('23')).toBeTruthy();
        expect(hours.test('25')).toBeFalsy();
      });

      it('minutes', () => {
        const compiled = '/(?:0[0-9]|[1-5][0-9])/';
        const hours = NaturalRegex.from('minutes');
        expect(
          hours.toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('mm').toString()
        ).toEqual(compiled);
        expect(hours.test('03')).toBeTruthy();
        expect(hours.test('13')).toBeTruthy();
        expect(hours.test('23')).toBeTruthy();
        expect(hours.test('61')).toBeFalsy();
      });

      it('seconds', () => {
        const compiled = '/(?:0[0-9]|[1-5][0-9])/';
        const hours = NaturalRegex.from('seconds');
        expect(
          hours.toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('ss').toString()
        ).toEqual(compiled);
        expect(hours.test('03')).toBeTruthy();
        expect(hours.test('13')).toBeTruthy();
        expect(hours.test('23')).toBeTruthy();
        expect(hours.test('61')).toBeFalsy();
      });

      it('day', () => {
        const compiled = '/(?:0[0-9]|[1-2][0-9]|3[01])/';
        expect(
          NaturalRegex.from('day').toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('dd').toString()
        ).toEqual(compiled);
      });

      it('month', () => {
        const compiled = '/(?:0[0-9]|1[0-2])/';
        expect(
          NaturalRegex.from('month').toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('MM').toString()
        ).toEqual(compiled);
      });

      it('year', () => {
        const compiled = '/[0-9]{4}/';
        expect(
          NaturalRegex.from('year').toString()
        ).toEqual(compiled);
        expect(
          NaturalRegex.from('yyyy').toString()
        ).toEqual(compiled);
      });

      it('yy', () => {
        expect(
          NaturalRegex.from('yy').toString()
        ).toEqual('/[0-9]{2}/');
      });

      it('yyyy MM dd', () => {
        expect(
          NaturalRegex.from('yyyy MM dd').toString()
        ).toEqual('/[0-9]{4}(?:0[0-9]|1[0-2])(?:0[0-9]|[1-2][0-9]|3[01])/');
      });

      it('hh mm ss', () => {
        expect(
          NaturalRegex.from('hh mm ss').toString()
        ).toEqual('/(?:0[0-9]|1[0-9]|2[0-4])(?:0[0-9]|[1-5][0-9])(?:0[0-9]|[1-5][0-9])/');
      });

      it('hh:mm:ss', () => {
        expect(
          NaturalRegex.from('hh:mm:ss').toString()
        ).toEqual(
          '/(?:0[0-9]|1[0-9]|2[0-4])\\:(?:0[0-9]|[1-5][0-9])\\:(?:0[0-9]|[1-5][0-9])/'
        );
      });

      it('yyyy/MM/dd', () => {
        expect(
          NaturalRegex.from('yyyy MM dd').toString()
        ).toEqual('/[0-9]{4}(?:0[0-9]|1[0-2])(?:0[0-9]|[1-2][0-9]|3[01])/');
      });
    });

    it('email', () => {
      const email = NaturalRegex.from('starts with email, end');
      expect(
        email.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6}))$/');
      expect(email.test('foo@bar.com')).toBeTruthy();
      expect(email.test('foo@bar.loremipsum')).toBeFalsy();
      expect(email.test('foo@bar')).toBeFalsy();
      expect(email.test('01.01.1900')).toBeFalsy();
      expect(email.test('32/07/1900')).toBeFalsy();
    });

    it('url', () => {
      const url = NaturalRegex.from('starts with url, end');
      expect(
        url.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?)$/');
      expect(url.test('http://foo.bar/lorem')).toBeTruthy();
      expect(url.test('https://foo.bar/lorem.exp')).toBeTruthy();
      expect(url.test('foo.bar/lorem')).toBeTruthy();
      expect(url.test('http://foo/lorem')).toBeFalsy();
      expect(url.test('foo@bar.com')).toBeFalsy();
      expect(url.test('01.01.1900')).toBeFalsy();
      expect(url.test('32/07/1900')).toBeFalsy();
    });

    it('ip address', () => {
      const ipAddress = NaturalRegex.from('starts with ip address, end');
      expect(
        ipAddress.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/');
      expect(ipAddress.test('73.60.124.136')).toBeTruthy();
      expect(ipAddress.test('255.255.255.255')).toBeTruthy();
      expect(ipAddress.test('256.60.124.136')).toBeFalsy();
      expect(ipAddress.test('http://foo/lorem')).toBeFalsy();
      expect(ipAddress.test('foo@bar.com')).toBeFalsy();
      expect(ipAddress.test('32/07/1900')).toBeFalsy();
    });

    it('html tag', () => {
      const htmlTag = NaturalRegex.from('starts with html tag, end');
      expect(
        htmlTag.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>))$/');
      expect(htmlTag.test('<div></div>')).toBeTruthy();
      expect(htmlTag.test('<img src="foo.png" />')).toBeTruthy();
      expect(htmlTag.test('<div><img src="foo.png" /></div>')).toBeTruthy();
      expect(htmlTag.test('<span foo="bar"')).toBeFalsy();
    });

    it('slug', () => {
      const slug = NaturalRegex.from('starts with slug, end');
      expect(
        slug.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:[a-z0-9-]+)$/');
      expect(slug.test('foo-bar')).toBeTruthy();
      expect(slug.test('foo')).toBeTruthy();
      expect(slug.test('foo_bar')).toBeFalsy();
    });

    it('hex', () => {
      const hex = NaturalRegex.from('starts with hex, end');
      expect(
        hex.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}))$/');
      expect(hex.test('#AF32B3')).toBeTruthy();
      expect(hex.test('#AF3')).toBeTruthy();
      expect(hex.test('#1234567')).toBeFalsy();
      expect(hex.test('#ZZZZZZ')).toBeFalsy();
    });

    it('decimal', () => {
      const decimal = NaturalRegex.from('starts with decimal, end');
      expect(
        decimal.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:\\-?\\d+(?:\\.\\d{0,2})?)$/');
      expect(decimal.test('10')).toBeTruthy();
      expect(decimal.test('-10')).toBeTruthy();
      expect(decimal.test('0.10')).toBeTruthy();
      expect(decimal.test('123.5')).toBeTruthy();
      expect(decimal.test('123,5')).toBeFalsy();
    });

    it('positive decimal', () => {
      const decimal = NaturalRegex.from('starts with positive decimal, end');
      expect(
        decimal.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:\\d+(?:\\.\\d{0,2})?)$/');
      expect(decimal.test('10')).toBeTruthy();
      expect(decimal.test('-10')).toBeFalsy();
      expect(decimal.test('0.10')).toBeTruthy();
      expect(decimal.test('123.5')).toBeTruthy();
      expect(decimal.test('123,5')).toBeFalsy();
    });

    it('negative decimal', () => {
      const decimal = NaturalRegex.from('starts with negative decimal, end');
      expect(
        decimal.toString()
        //eslint-disable-next-line
      ).toEqual('/^(?:\\-\\d+(?:\\.\\d{0,2})?)$/');
      expect(decimal.test('10')).toBeFalsy();
      expect(decimal.test('-10')).toBeTruthy();
      expect(decimal.test('0.10')).toBeFalsy();
      expect(decimal.test('123.5')).toBeFalsy();
      expect(decimal.test('123,5')).toBeFalsy();
    });

    it('locale', () => {
      const locale = NaturalRegex.from('start, locale, end');
      expect(
        locale.toString()
        //eslint-disable-next-line
      ).toEqual('/^[a-z]{2}(?:-[A-Z]{2})?$/');
      expect(locale.test('it')).toBeTruthy();
      expect(locale.test('it-IT')).toBeTruthy();
      expect(locale.test('it-it')).toBeFalsy();
      expect(locale.test('i')).toBeFalsy();
    });
  });
});
