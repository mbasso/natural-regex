import expect from 'expect';
import NaturalRegex from '../src/';

describe('Operators', () => {
  describe('Separators', () => {
    const compiled = '/\\w\\w/';

    it('.', () => {
      expect(
        NaturalRegex.from('alphanumeric.').toString()
      ).toEqual('/\\w/');
      expect(
        NaturalRegex.from('alphanumeric. alphanumeric').toString()
      ).toEqual(compiled);
    });

    it(',', () => {
      expect(
        NaturalRegex.from('alphanumeric, alphanumeric').toString()
      ).toEqual(compiled);
    });

    it('and', () => {
      expect(
        NaturalRegex.from('alphanumeric and alphanumeric').toString()
      ).toEqual(compiled);
    });

    it('then', () => {
      expect(
        NaturalRegex.from('alphanumeric then alphanumeric').toString()
      ).toEqual(compiled);
    });

    it(', then', () => {
      expect(
        NaturalRegex.from('alphanumeric, then alphanumeric').toString()
      ).toEqual(compiled);
    });

    it('and then', () => {
      expect(
        NaturalRegex.from('alphanumeric and then alphanumeric').toString()
      ).toEqual(compiled);
    });
  });

  describe('Repetitions', () => {
    it('one or more times', () => {
      expect(
        NaturalRegex.from('alphanumeric one or more times').toString()
      ).toEqual('/\\w+/');
    });

    it('optional more times', () => {
      expect(
        NaturalRegex.from('alphanumeric optional more times').toString()
      ).toEqual('/\\w*/');
    });

    it('optional', () => {
      expect(
        NaturalRegex.from('alphanumeric optional').toString()
      ).toEqual('/\\w?/');
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

    it('from to times', () => {
      expect(
        NaturalRegex.from('alphanumeric from 1 to 7 times').toString()
      ).toEqual('/\\w{1,7}/');
    });

    it('for times', () => {
      expect(
        NaturalRegex.from('alphanumeric for 14 times').toString()
      ).toEqual('/\\w{14}/');
    });

    it('smallest', () => {
      expect(
        NaturalRegex.from('alphanumeric optional more times (smallest)').toString()
      ).toEqual('/\\w*?/');
    });
  });

  describe('Others', () => {
    it('or', () => {
      expect(
        NaturalRegex.from('alphanumeric or digit').toString()
      ).toEqual('/(?:\\w|\\d)/');
    });

    it('starts with', () => {
      expect(
        NaturalRegex.from('starts with alphanumeric').toString()
      ).toEqual('/^(?:\\w)/');
    });

    it('ends with', () => {
      expect(
        NaturalRegex.from('ends with alphanumeric').toString()
      ).toEqual('/\\w$/');
    });

    it('in charset', () => {
      expect(
        NaturalRegex.from('in charset: a, b, c, d;').toString()
      ).toEqual('/[abcd]/');
    });

    it('not in charset', () => {
      expect(
        NaturalRegex.from('not in charset: a, b, c, d, from a to z and from 0 to 9;').toString()
      ).toEqual('/[^abcda-z0-9]/');
    });

    it('group', () => {
      expect(
        NaturalRegex.from('group from a to z end group').toString()
      ).toEqual('/(?:[a-z])/');
    });

    it('capture', () => {
      expect(
        NaturalRegex.from('capture from a to z end capture').toString()
      ).toEqual('/([a-z])/');
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
  });
});
