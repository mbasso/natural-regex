## FIND OTHER HELPERS

## DOCUMENTATION

## SENTENCE

escape " inside sentence
Fix space into sentence

## CHARACTERS

Fix hex character
Fix unicode character

## REPLACE FUNCTION

NaturalRegex should have a function that easily replace matches in a given string, for example:

const oldString = 'foo is awesome, foo!';
const newString = NaturalRegex.replace({
    source: oldString,
    match: 'starts with "foo"',
    replace: 'bar',
});
// newString === 'bar is awesome, foo!'