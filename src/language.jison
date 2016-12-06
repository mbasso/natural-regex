%lex
%%

\s+                         /* skip whitespace */

"vertical tab"              return 'VERTICAL_TAB'
"tab"                       return 'TAB'
"alphanumeric"              return 'ALPHANUMERIC'
"non alphanumeric"          return 'NON_WORD'
"non space"                 return 'NON_SPACE'
"space"                     return 'SPACE'
"null"                      return 'NULL'
(return|new\sline)          return 'RETURN'
"line feed"                 return 'LINE_FEED'
"form feed"                 return 'FORM_FEED'
"non digit"                 return 'NON_DIGIT'
"digit"                     return 'DIGIT'
"backspace"                 return 'BACKSPACE'
"any character"             return 'ANY_CHARACTER'
"starts with"               return 'STARTS_WITH'
"not followed by"           return 'NOT_FOLLOWED_BY'
"followed by"               return 'FOLLOWED_BY'
"hex"                       return 'HEX'
"ctrl+"                     return 'CONTROL_CHARACTER'

"group"                     return 'GROUP'
"end group"                 return 'END_GROUP'

"not in charset:"           return 'NOT_CHARACTER_SET'
"in charset:"               return 'CHARACTER_SET'

"optional more times"       return 'OPTIONAL_REPETITION'
"required one or more times"
                            return 'ONE_OR_MORE_REPETITION'
"optional one time"         return 'ZERO_OR_ONE_REPETITION'
"times"                     return 'REPETITION'
"(smallest)"                return 'SMALLEST'

"minimum"                   return 'MINIMUM'
"maximum"                   return 'MAXIMUM'

"from"                      return 'FROM'
"to"                        return 'TO'
"end"                       return 'END'
"start"                     return 'START'
"then"                      return 'THEN'
"or"                        return 'OR'
"and"                       return 'AND'
"for"                       return 'FOR'
(\,|comma)                  return ','
(\.|point)                  return '.'
(\;|semicolon)              return ';'

(\^|caret)                  return '^'
(\+|plus)                   return '+'
(\-|minus)                  return '-'
(\*|asterisk|star)          return '*'
(\?|question\smark)         return '?'
(\(|left\sround\sbracket)   return '('
(\)|right\sround\sbracket)  return ')'
(\{|left\scurly\sbracket)   return '{'
(\}|right\scurly\sbracket)  return '}'
(\[|left\ssquare\sbracket)  return '['
(\]|right\ssquare\sbracket) return ']'
(\:|colon)                  return ':'
(\!|exclamation\smark)      return '!'
(\$|dollar)                 return '$'
(\||pipe)                   return '|'
(\"|quotation\smark)        return '"'
(\\|backslash)              return '\\'
(\/|slash)                  return '/'

"letter"                    return 'LETTER'
"uppercase"                 return 'UPPERCASE'
"lowercase"                 return 'LOWERCASE'
"word"                      return 'WORD'
"positive"                  return 'POSITIVE'
"negative"                  return 'NEGATIVE'
"number"                    return 'TYPE_NUMBER'
"decimal"                   return 'DECIMAL'
"date"                      return 'DATE'
"email"                     return 'EMAIL'
"url"                       return 'URL'
"ip address"                return 'IP_ADDRESS'
"html tag"                  return 'HTML_TAG'
"slug"                      return 'SLUG'
"decimal"                   return 'DECIMAL'
"anything"                  return 'ANYTHING'

(hh|hours)                  return 'HOURS'
(mm|minutes)                return 'MINUTES'
(ss|seconds)                return 'SECONDS'
(dd|day)                    return 'DAY'
(MM|month)                  return 'MONTH'
"yy"                        return 'yy'
(yyyy|year)                 return 'YEAR'

[0-9]+                      return 'NUMBER'

<<EOF>>                     return 'EOF'
.                           return 'CHARACTER'


/lex

%left GROUP END_GROUP '.' CHARACTER_SET NOT_CHARACTER_SET '"'
%left MINIMUM MAXIMUM FROM TO FOR REPETITION OPTIONAL_REPETITION ONE_OR_MORE_REPETITION ZERO_OR_ONE_REPETITION
%left FOLLOWED_BY NOT_FOLLOWED_BY AND THEN ','
%left STARTS_WITH
%left OR

%start file

%%

file
    : EOF
        { return ""; }
    | e EOF
        { return $1; }
    ;

e
    : e '.'
        { $$ = "(?:" + $1 + ")"; }
    | e '.' e
        { $$ = "(?:" + $1 + ")(?:" + $3 + ")"; }
    | e AND e
        { $$ = $1 + $3; }
    | e ',' e
        { $$ = $1 + $3; }
    | e THEN e
        { $$ = $1 + $3; }
    | e ',' THEN e
        { $$ = $1 + $4; }
    | e AND THEN e
        { $$ = $1 + $4; }
    | STARTS_WITH e
        { $$ = "^(?:" + $2 + ")"; }
    | GROUP e END_GROUP
        { $$ = "(" + $2 + ")"; }
    | CHARACTER_SET charset ';'
        { $$ = "[" + $2 + "]"; }
    | NOT_CHARACTER_SET charset ';'
        { $$ = "[^" + $2 + "]"; }
    | e OR e
        { $$ = "(?:" + $1 + "|" + $3 + ")"; }
    | e FOLLOWED_BY e
        { $$ = "(?:" + $1 + ")" + "(?=" + $3 + ")"; }
    | e NOT_FOLLOWED_BY e
        { $$ = "(?:" + $1 + ")" + "(?!" + $3 + ")"; }
    | e repetition
        { $$ = "(?:" + $1 + ")" + $2; }
    | '"' sentence '"'
        { $$ = $2; }
    | NUMBER
    | range
    | character
    | hexcharacter
    | specialcharacter
    | helper
    ;

range
    : FROM character TO character
        { $$ = $2 + "-" + $4; }
    | FROM NUMBER TO NUMBER
        { $$ = $2 + "-" + $4; }
    ;

repetition
    : repetition SMALLEST
        { $$ = $1 + "?"; }
    | OPTIONAL_REPETITION
        { $$ = "*"; }
    | ONE_OR_MORE_REPETITION
        { $$ = "+"; }
    | ZERO_OR_ONE_REPETITION
        { $$ = "?"; }
    | FROM NUMBER TO NUMBER REPETITION
        { $$ = "{" + $2 + "," + $4 + "}"; }
    | MINIMUM NUMBER REPETITION
        { $$ = "{" + $2 + ",}"; }
    | MAXIMUM NUMBER REPETITION
        { $$ = "{1," + $2 + "}"; }
    | FOR NUMBER REPETITION
        { $$ = "{" + $2 + "}"; }
    ;

sentence
    : character
    | character sentence
        { $$ = $1 + $2 }
    ;

charset
    : character
    | hexcharacter
    | specialcharacter
    | range
    | charset ',' charset
        { $$ = $1 + $3 }
    | charset AND charset
        { $$ = $1 + $3 }
    ;

character
    : simplecharacter
    | '.'
        { $$ = "\\."; }
    | ','
        { $$ = "\\,"; }
    ;

simplecharacter
    : CHARACTER
    | ';'
        { $$ = ";"; }
    | '-'
        { $$ = "\\-"; }
    | '^'
        { $$ = "\\^"; }
    | '+'
        { $$ = "\\+"; }
    | '*'
        { $$ = "\\*"; }
    | '?'
        { $$ = "\\?"; }
    | '('
        { $$ = "\\("; }
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
    | '$'
        { $$ = "\\$"; }
    | '|'
        { $$ = "\\|"; }
    | '\\'
        { $$ = "\\\\"; }
    | '/'
        { $$ = "\\/"; }
    ;

specialcharacter
    : '"'
        { $$ = "\\\""; }
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
    | NON_SPACE
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
    | START
        { $$ = "^"; }
    | END
        { $$ = "$"; }
    ;

hexcharacter
    : HEX CHARACTER CHARACTER
        { $$ = "\\x" + $2 + $3; }
    | HEX CHARACTER CHARACTER CHARACTER CHARACTER
        { $$ = "\\u" + $2 + $3 + $4 + $5; }
    | HEX NUMBER
        { $$ = "\\x" + $2; }
    ;

helper
    : datetime
    | LETTER
        { $$ = "[a-zA-Z]"; }
    | UPPERCASE LETTER
        { $$ = "[A-Z]"; }
    | LOWERCASE LETTER
        { $$ = "[a-z]"; }
    | WORD
        { $$ = "[a-zA-Z]+"; }
    | UPPERCASE WORD
        { $$ = "[A-Z]+"; }
    | LOWERCASE WORD
        { $$ = "[a-z]+"; }
    | TYPE_NUMBER
        { $$ = "\\-?[0-9]+"; }
    | NEGATIVE TYPE_NUMBER
        { $$ = "\\-[0-9]+"; }
    | POSITIVE TYPE_NUMBER
        { $$ = "[0-9]+"; }
    | DECIMAL
        { $$ = "\\-?\\d+(?:\\.\\d{0,2})?" }
    | NEGATIVE DECIMAL
        { $$ = "\\-\\d+(?:\\.\\d{0,2})?"; }
    | POSITIVE DECIMAL
        { $$ = "\\d+(?:\\.\\d{0,2})?"; }
    | HTML_TAG
        { $$ = "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)"; }
    | IP_ADDRESS
        { $$ = "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"; }
    | URL
        { $$ = "(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?"; }
    | EMAIL
        { $$ = "([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})"; }
    | SLUG
        { $$ = "[a-z0-9-]+"; }
    | HEX
        { $$ = "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"; }
    | ANYTHING
        { $$ = ".*"; }
    ;

datetime
    : date
    | date datetime
        { $$ = $1 + $2 }
    | date simplecharacter datetime
        { $$ = $1 + $2 + $3  }
    | time
    | time datetime
        { $$ = $1 + $2 }
    | time simplecharacter datetime
        { $$ = $1 + $2 + $3  }
    | DATE
        { $$ = "(?:(?:31(\\/|-)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})"; }
    ;

date
    : DAY
        { $$ = "(?:0[0-9]|[1-2][0-9]|3[01])"; }
    | MONTH
        { $$ = "(?:0[0-9]|1[0-2])"; }
    | YEAR
        { $$ = "[0-9]{4}"; }
    | yy
        { $$ = "[0-9]{2}"; }
    ;

time
    : HOURS
        { $$ = "(?:0[0-9]|1[0-9]|2[0-4])"; }
    | MINUTES
        { $$ = "(?:0[0-9]|[1-5][0-9])"; }
    | SECONDS
        { $$ = "(?:0[0-9]|[1-5][0-9])"; }
    ;