import expect from 'expect';
import NaturalRegex from '../src/';

describe('Helpers', () => {
  describe('base helpers', () => {
    it('anything', () => {
      expect(
        NaturalRegex.from('anything').toString()
      ).toEqual('/.*/');
    });

    it('letter', () => {
      const letter = NaturalRegex.from('starts with letter');
      expect(
        letter.toString()
      ).toEqual('/^(?:[a-zA-Z])/');
      expect(letter.test('a')).toBeTruthy();
      expect(letter.test('A')).toBeTruthy();
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

    it('lowercase letter', () => {
      const letter = NaturalRegex.from('starts with lowercase letter');
      expect(
        letter.toString()
      ).toEqual('/^(?:[a-z])/');
      expect(letter.test('a')).toBeTruthy();
      expect(letter.test('A')).toBeFalsy();
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
  });

  describe('complex helpers', () => {
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

    it('ipv4', () => {
      const ipAddress = NaturalRegex.from('starts with ipv4, end');
      expect(ipAddress.test('73.60.124.136')).toBeTruthy();
      expect(ipAddress.test('255.255.255.255')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3:8d3:1319:8a2e:370:7348')).toBeFalsy();
      expect(ipAddress.test('256.60.124.136')).toBeFalsy();
    });

    it('ipv6', () => {
      const ipAddress = NaturalRegex.from('starts with ipv6, end');
      expect(ipAddress.test('2001:db8:85a3:8d3:1319:8a2e:370:7348')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3::8a2e:370:7334')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3::8a2g:370:7334')).toBeFalsy();
      expect(ipAddress.test('255.60.124.136')).toBeFalsy();
    });

    it('ip address', () => {
      const ipAddress = NaturalRegex.from('starts with ip address, end');
      expect(ipAddress.test('73.60.124.136')).toBeTruthy();
      expect(ipAddress.test('255.255.255.255')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3:8d3:1319:8a2e:370:7348')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3::8a2e:370:7334')).toBeTruthy();
      expect(ipAddress.test('2001:db8:85a3::8a2g:370:7334')).toBeFalsy();
      expect(ipAddress.test('256.60.124.136')).toBeFalsy();
      expect(ipAddress.test('http://foo/lorem')).toBeFalsy();
      expect(ipAddress.test('foo@bar.com')).toBeFalsy();
      expect(ipAddress.test('32/07/1900')).toBeFalsy();
    });

    it('mac address', () => {
      const macAddress = NaturalRegex.from('starts with mac address, end');
      expect(macAddress.test('3D:F2:C9:A6:B3:4F')).toBeTruthy();
      expect(macAddress.test('3D-F2-C9-A6-B3-4F')).toBeTruthy();
      expect(macAddress.test('3Z-F2-C9-A6-X3-4F')).toBeFalsy();
      expect(macAddress.test('3D.F2.C9.A6.B3.4F')).toBeFalsy();
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

    it('email', () => {
      const email = NaturalRegex.from('starts with email, end');
      expect(email.test('foo@bar.com')).toBeTruthy();
      expect(email.test('foo@bar.loremipsum')).toBeTruthy();
      expect(email.test('foo@bar')).toBeTruthy();
      expect(email.test('foo@')).toBeFalsy();
      expect(email.test('@foo')).toBeFalsy();
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

    it('latitude', () => {
      const latitude = NaturalRegex.from('starts with latitude, end');
      expect(latitude.test('+90.0')).toBeTruthy();
      expect(latitude.test('-90.000')).toBeTruthy();
      expect(latitude.test('45')).toBeTruthy();
      expect(latitude.test('-90')).toBeTruthy();
      expect(latitude.test('+90')).toBeTruthy();
      expect(latitude.test('47.1231231')).toBeTruthy();
      expect(latitude.test('-90.')).toBeFalsy();
      expect(latitude.test('-91')).toBeFalsy();
      expect(latitude.test('+90.1')).toBeFalsy();
      expect(latitude.test('045')).toBeFalsy();
    });

    it('longitude', () => {
      const longitude = NaturalRegex.from('starts with longitude, end');
      expect(longitude.test('-127.554334')).toBeTruthy();
      expect(longitude.test('180')).toBeTruthy();
      expect(longitude.test('-180')).toBeTruthy();
      expect(longitude.test('-180.0000')).toBeTruthy();
      expect(longitude.test('+180')).toBeTruthy();
      expect(longitude.test('179.99999999')).toBeTruthy();
      expect(longitude.test('-190.')).toBeFalsy();
      expect(longitude.test('200.111')).toBeFalsy();
      expect(longitude.test('.123456')).toBeFalsy();
      expect(longitude.test('180.')).toBeFalsy();
    });

    it('color name', () => {
      const colorName = NaturalRegex.from('color name');
      expect(colorName.test('white')).toBeTruthy();
      expect(colorName.test('blue')).toBeTruthy();
      expect(colorName.test('foo')).toBeFalsy();
    });

    it('hostname', () => {
      const hostName = NaturalRegex.from('start, hostname, end');
      expect(hostName.test('example.org')).toBeTruthy();
      expect(hostName.test('www.foo.bar')).toBeTruthy();
      expect(hostName.test('foo.')).toBeFalsy();
    });

    it('guid', () => {
      expect(
        NaturalRegex.from('guid').toString()
      ).toEqual(NaturalRegex.from('uuid').toString());
      const uuid = NaturalRegex.from('start, guid, end');
      expect(uuid.test('53fa9fa7-7b71-41c1-bb5b-306f4bf25aa4')).toBeTruthy();
      expect(uuid.test('53FA9FA7-7B71-41C1-BB5B-306F4BF25AA4')).toBeTruthy();
      expect(uuid.test('00000000-0000-0000-0000-000000000000')).toBeTruthy();
      expect(uuid.test('53fa9fa7-7b71-61c1-bb5b-306f4bf25aa4')).toBeFalsy();
      expect(uuid.test('53fa9fa7-7b71-41c1-xb5b-306f4bf25aa4')).toBeFalsy();
      expect(uuid.test('000000j-0000-0000-0000-000000000000')).toBeFalsy();
      expect(uuid.test('0000000-0000-0000-0000-000000000000')).toBeFalsy();
      expect(uuid.test('{0000000-0000-0000-0000-000000000000}')).toBeFalsy();
    });

    it('us zip code', () => {
      const code = NaturalRegex.from('start, us zip code, end');
      expect(code.test('54365-2005')).toBeTruthy();
      expect(code.test('54365')).toBeTruthy();
      expect(code.test('54365-43')).toBeFalsy();
      expect(code.test('5436-2005')).toBeFalsy();
    });

    it('canadian postal code', () => {
      const code = NaturalRegex.from('start, canadian postal code, end');
      expect(code.test('J8A0Y3')).toBeTruthy();
      expect(code.test('J8A023')).toBeFalsy();
      expect(code.test('JVA0Y3')).toBeFalsy();
    });
  });

  describe('date', () => {
    it('date', () => {
      const date = NaturalRegex.from('starts with date, end');
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
});
