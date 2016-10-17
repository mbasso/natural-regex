%lex
%%

\s+                         /* skip whitespace */

"vertical tab"              return 'VERTICAL_TAB'
"tab"                       return 'TAB'
(alphanumeric|word)         return 'ALPHANUMERIC'
"non word"                  return 'NON_WORD'
"white space"               return 'WHITE_SPACE'
"space"                     return 'SPACE'
(null|nothing|nil)          return 'NULL'
(return|new\sline)          return 'RETURN'
"line feed"                 return 'LINE_FEED'
"form feed"                 return 'FORM_FEED'
non\s(digit|number)         return 'NON_DIGIT'
(digit|number)              return 'DIGIT'
"backspace"                 return 'BACKSPACE'
"any character"             return 'ANY_CHARACTER'
"starts with"               return 'STARTS_WITH'
"not followed by"           return 'NOT_FOLLOWED_BY'
"followed by"               return 'FOLLOWED_BY'
"hex"                       return 'HEX'
"anything"                  return 'ANYTHING'
"control character"         return 'CONTROL_CHARACTER'

"group"                     return 'GROUP'
"end group"                 return 'END_GROUP'

"not in charset:"           return 'NOT_CHARACTER_SET'
"in charset:"               return 'CHARACTER_SET'

"optional more times"       return 'OPTIONAL_REPETITION'
"required one or more times"
                            return 'ONE_OR_MORE_REPETITION'
"optional one time"         return 'ZERO_OR_ONE_REPETITION'
"times"                     return 'REPETITION'

"minimum length"            return 'MINIMUM_LENGTH'
"length"                    return 'LENGTH'

"from"                      return 'FROM'
"to"                        return 'TO'
"end"                       return 'END'
"then"                      return 'THEN'
"or"                        return 'OR'
"and"                       return 'AND'
"for"                       return 'FOR'
","                         return ',' // comma
"."                         return '.' // point

"^"                         return '^'
"+"                         return '+' // plus
"*"                         return '*' // asterisk
"?"                         return '?' // question mark
"("                         return '(' // left round bracket
")"                         return ')' // right round bracket
"{"                         return '{' // left curly bracket
"}"                         return '}' // right curly bracket
"["                         return '[' // left square bracket
"]"                         return ']' // right square bracket
":"                         return ':' // colon
"!"                         return '!' // exclamation point
"$"                         return '$' // dollar
"|"                         return '|' // pipe
"\\"                        return 'BACKSLASH'

([""]).*?\1                 return 'SENTENCE'
[0-9]+                      return 'NUMBER'

'"'                         return '"' // quotation mark

<<EOF>>                     return 'EOF'
.                           return 'CHARACTER'


/lex

%left GROUP END_GROUP CHARACTER_SET NOT_CHARACTER_SET
%left MINIMUM_LENGTH LENGTH FROM TO FOR REPETITION OPTIONAL_REPETITION ONE_OR_MORE_REPETITION ZERO_OR_ONE_REPETITION
%left FOLLOWED_BY NOT_FOLLOWED_BY AND THEN ',' '.' EOF
%left STARTS_WITH
%left OR

%start e

%%

e
    : e EOF
        { return $1; }
    | e '.'
        { $$ = $1 }
    | e AND e
        { $$ = $1 + $3}
    | e ',' e
        { $$ = $1 + $3}
    | e THEN e
        { $$ = $1 + $3}
    | e ',' THEN e
        { $$ = $1 + $4}
    | e AND THEN e
        { $$ = $1 + $4}
    | STARTS_WITH e
        { $$ = "^(" + $2 + ")"; }
    | GROUP e END_GROUP
        { $$ = "(?:" + $2 + ")"; }
    | CHARACTER_SET charset '.'
        { $$ = "[" + $2 + "]"; }
    | NOT_CHARACTER_SET charset '.'
        { $$ = "[^" + $2 + "]"; }
    | e OR e
        { $$ = "(" + $1 + "|" + $3 + ")"; }
    | e FOLLOWED_BY e
        { $$ = $1 + "(?=" + $3 + ")"; }
    | e NOT_FOLLOWED_BY e
        { $$ = $1 + "(?!" + $3 + ")"; }
    | e repetition
        { $$ = $1 + $2; }
    | SENTENCE
        %{
            var replaceCharacters = function(input){
                return input.replace( /([.,^+*?)(}{\]\[:!|$"\\])/,
                    function(x){
                        if(x != "\\"){
                            return "\\" + x;
                        }else{
                            return "\\\\";
                        }
                    }
                );
            };
            $$ = replaceCharacters($1.substring(1, $1.length - 1));
        }%
    | ANYTHING
        { $$ = ".*"; }
    | NUMBER
    | range
    | length
    | character
    ;

range
    : FROM character TO character
        { $$ = $2 + "-" + $4; }
    | FROM NUMBER TO NUMBER
        { $$ = $2 + "-" + $4; }
    ;

length
    : LENGTH NUMBER
        { $$ = "{" + $2 + "}"; }
    | MINIMUM_LENGTH NUMBER
        { $$ = "{" + $2 + ",}"; }
    | LENGTH FROM NUMBER TO NUMBER
        { $$ = "{" + $3 + "," + $5 +"}"; }
    ;

repetition
    : OPTIONAL_REPETITION
        { $$ = "*"; }
    | ONE_OR_MORE_REPETITION
        { $$ = "+"; }
    | ZERO_OR_ONE_REPETITION
        { $$ = "?"; }
    | FROM NUMBER TO NUMBER REPETITION
        { $$ = "{" + $2 + "," + $4 + "}"; }
    | FOR NUMBER REPETITION
        { $$ = "{" + $2 + "}"; }
    ;

charset
    : character
    | character ',' charset
        { $$ = $1 + $3 }
    ;

character
    : CHARACTER
    | '.'
        { $$ = "\\."; }
    | ','
        { $$ = "\\,"; }
    | '^'
        { $$ = "\\^"; }
    | '+'
        { $$ = "\\+"; }
    | '*'
        { $$ = "\\*"; }
    | '?'
        { $$ = "\\?"; }
    | '('
        { $$ = "\\)"; }
    | ')'
        { $$ = "\\)"; }
    | '{'
        { $$ = "\\{"; }
    | '}'
        { $$ = "\\}"; }
    | '['
        { $$ = "\\["; }
    | ']'
        { $$ = "\\]"; }
    | ':'
        { $$ = "\\:"; }
    | '!'
        { $$ = "\\!"; }
    | '"'
        { $$ = "\\\""; }
    | '$'
        { $$ = "\\$"; }
    | '|'
        { $$ = "\\|"; }
    | BACKSLASH
        { $$ = "\\\\"; }
    | CONTROL_CHARACTER character
        { $$ = "\\c" + $2; }
    | TAB
        { $$ = "\\t"; }
    | VERTICAL_TAB
        { $$ = "\\v"; }
    | ALPHANUMERIC
        { $$ = "\\w"; }
    | NON_WORD
        { $$ = "\\W"; }
    | SPACE
        { $$ = "\\s"; }
    | WHITE_SPACE
        { $$ = "\\S"; }
    | NULL
        { $$ = "\\0"; }
    | RETURN
        { $$ = "\\r"; }
    | FORM_FEED
        { $$ = "\\f"; }
    | LINE_FEED
        { $$ = "\\n"; }
    | DIGIT
        { $$ = "\\d"; }
    | NON_DIGIT
        { $$ = "\\D"; }
    | BACKSPACE
        { $$ = "[\\b]"; }
    | ANY_CHARACTER
        { $$ = "."; }
    | END
        { $$ = "$"; }
    | HEX CHARACTER CHARACTER
        { $$ = "\\x" + $2 + $3; }
    | HEX CHARACTER CHARACTER CHARACTER CHARACTER
        { $$ = "\\u" + $2 + $3 + $4 + $5; }
    | HEX NUMBER
        { $$ = "\\x" + $2; }
    ;
