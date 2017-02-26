%left GROUP END_GROUP CAPTURE END_CAPTURE '.' CHARACTER_SET NOT_CHARACTER_SET '"'
%left MINIMUM MAXIMUM FROM TO FOR REPETITION OPTIONAL_REPETITION ONE_OR_MORE_REPETITION ZERO_OR_ONE_REPETITION
%left FOLLOWED_BY NOT_FOLLOWED_BY AND THEN ','
%left STARTS_WITH ENDS_WITH
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
        { $$ = $1; }
    | e '.' e
        { $$ = $1 + $3; }
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
    | ENDS_WITH e
        { $$ = $2 + "$"; }
    | GROUP e END_GROUP
        { $$ = "(?:" + $2 + ")"; }
    | CAPTURE e END_CAPTURE
        { $$ = "(" + $2 + ")"; }
    | CHARACTER_SET charset ';'
        { $$ = "[" + $2 + "]"; }
    | NOT_CHARACTER_SET charset ';'
        { $$ = "[^" + $2 + "]"; }
    | e OR e
        { $$ = "(?:" + $1 + "|" + $3 + ")"; }
    | e FOLLOWED_BY e
        { $$ = $1 + "(?=" + $3 + ")"; }
    | e NOT_FOLLOWED_BY e
        { $$ = $1 + "(?!" + $3 + ")"; }
    | e repetition
        { $$ = $1 + $2; }
    | range
        { $$ = "[" + $1 + "]" }
    | ESCAPED
        {
          $$ = yytext
                    .substring(1, yytext.length - 1)
                    .replace(/\s/g, '\\s');
        }
    | separatorcharacter
    | hexcharacter
    | unicodecharacter
    | specialcharacter
    | word
    | helper
    ;

range
    : FROM character TO character
        { $$ = $2 + "-" + $4; }
    | FROM number TO number
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
    | FROM number TO number REPETITION
        { $$ = "{" + $2 + "," + $4 + "}"; }
    | MINIMUM number REPETITION
        { $$ = "{" + $2 + ",}"; }
    | MAXIMUM number REPETITION
        { $$ = "{1," + $2 + "}"; }
    | FOR number REPETITION
        { $$ = "{" + $2 + "}"; }
    ;

word
    : simplecharacter
    | NUMBER
    | simplecharacter word
        { $$ = $1 + $2 }
    | NUMBER word
        { $$ = String($1) + $2 }
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
    | separators
    ;

separatorcharacter
    : '.'
        { $$ = "\\."; }
    | ','
        { $$ = "\\,"; }
    ;

simplecharacter
    : CHARACTER
    | '_'
        { $$ = "_"; }
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
    : HEX hexvalue hexvalue
        { $$ = "\\x" + $2 + $3; }
    | HEX hexvalue hexvalue hexvalue hexvalue
        { $$ = "\\u" + $2 + $3 + $4 + $5; }
    ;

unicodecharacter
    : UNICODE hexvalue hexvalue hexvalue hexvalue
        { $$ = "\\u" + $2 + $3 + $4 + $5; }
    | UNICODE hexvalue hexvalue hexvalue hexvalue hexvalue
        { $$ = "\\u" + $2 + $3 + $4 + $5 + $6; }
    ;

hexvalue
    : NUMBER
    | CHARACTER
        {
            if (!/[a-fA-F]/.test(yytext)) {
                throw new Error('Invalid hex value');
            }
            $$ = $1;
        }
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
    | IPV4
        { $$ = "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"; }
    | IPV6
        { $$ = "(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))"; }
    | IP_ADDRESS
        { $$ = "(?:(?:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))))"; }
    | MAC_ADDRESS
        { $$ = "(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})"; }
    | URL
        { $$ = "(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?"; }
    | EMAIL
        { $$ = "(?:[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22(?:[^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22)(?:\\x2e(?:[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22(?:[^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22))*\\x40(?:[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b(?:[^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d)(?:\\x2e(?:[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b(?:[^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d))*"; }
    | SLUG
        { $$ = "[a-z0-9-]+"; }
    | HEX
        { $$ = "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"; }
    | LOCALE
        { $$ = "[a-z]{2}(?:-[A-Z]{2})?"; }
    | ANYTHING
        { $$ = ".*"; }
    | LATITUDE
        { $$ = "[-+]?(?:[1-8]?\\d(?:\\.\\d+)?|90(?:\\.0+)?)"; }
    | LONGITUDE
        { $$ = "[-+]?(?:180(?:\\.0+)?|(?:(?:1[0-7]\\d)|(?:[1-9]?\\d))(?:\\.\\d+)?)"; }
    | COLOR_NAME
        { $$ = "(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)"; }
    | HOSTNAME
        { $$ = "(?:(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*(?:[A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])"; }
    | UUID
        { $$ = "(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})"; }
    | GUID
        { $$ = "(?:(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})|(?:00000000-0000-0000-0000-000000000000))"; }
    | US_ZIP_CODE
        { $$ = "[0-9]{5}(?:-[0-9]{4})?"; }
    | CANADIAN_POSTAL_CODE
        { $$ = "[ABCEGHJ-NPRSTVXY]{1}[0-9]{1}[ABCEGHJ-NPRSTV-Z]{1}[ ]?[0-9]{1}[ABCEGHJ-NPRSTV-Z]{1}[0-9]{1}"; }
    | BRAZILIAN_POSTAL_CODE
        { $$ = "[0-9]{5}-[0-9]{3}"; }
    | UK_POSTAL_CODE
        { $$ = "(?:(?:[gG][iI][rR] {0,}0[aA]{2})|(?:(?:(?:[a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(?:(?:[a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|(?:[a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))"; }
    | BIC
        { $$ = "[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}(?:[a-zA-Z0-9]{3})?"; }
    | IBAN
        { $$ = "[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}(?:[a-zA-Z0-9]?){0,16}"; }
    | BRAINFUCK
        { $$ = "[+-<>.,\\[\\] \\t\\n\\r]+"; }
    | MORSE
        { $$ = "[.-]{1,5}(?:[ \\t]+[.-]{1,5})*(?:[ \\t]+[.-]{1,5}(?:[ \\t]+[.-]{1,5})*)*"; }
    | YOUTUBE_CHANNEL
        { $$ = "https?:\\/\\/(?:www\\.)?youtube\\.com\\/channel\\/UC(?:[-_a-zA-Z0-9]{22})"; }
    | YOUTUBE_VIDEO
        { $$ = "https?:\\/\\/(?:youtu\\.be\\/|(?:[a-z]{2,3}\\.)?youtube\\.com\\/watch(?:\\?|#\\!)v=)(?:[\\w-]{11}).*"; }
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
        { $$ = "(?:(?:31(\\/|-)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})|(?:29(\\/|-)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:0?[1-9]|1\\d|2[0-8])(\\/|-)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})"; }
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

number
    : NUMBER number
        { $$ = String($1) + $2; }
    | NUMBER
        { $$ = $1; }
    ;