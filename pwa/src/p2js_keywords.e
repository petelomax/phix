--
-- p2js_keywords.e (nb automatically over-written, all comments get trashed)
--
-- clash detection (no single-character symbol should ever match any ttidx):
--
--   `!` = 33, `"` = 34, `#` = 35, `$` = 36, `%` = 37, `&` = 38, `'` = 39, `(` = 40, `)` = 41, `*` = 42,
--   `+` = 43, `,` = 44, `-` = 45, `.` = 46, `/` = 47, `0` = 48, `:` = 58, `;` = 59, `<` = 60, `=` = 61,
--   `>` = 62, `?` = 63, `A` = 65, `[` = 91, `\` = 92, `]` = 93, ``` = 96, `{` = 123, `|` = 124, `}` = 125,
--   `~` = 126
--
global constant p2js_keywords = {
    {"string",                  T_string                    := 24},
    {"nullable_string",         T_nullable_string           := 88},    -- 'X'
    {"atom_string",             T_atom_string               := 136},
    {"atom",                    T_atom                      := 140},
    {"bool",                    T_bool                      := 160},
    {"boolean",                 T_boolean                   := 176},
    {"byte",                    T_byte                      := 192},
    {"char",                    T_char                      := 212},
    {"double",                  T_double                    := 240},
    {"float",                   T_float                     := 264},
    {"int",                     T_int                       := 280},
    {"integer",                 T_integer                   := 300},
    {"Ihandle",                 T_Ihandle                   := 332},
    {"Ihandln",                 T_Ihandln                   := 340},
    {"long",                    T_long                      := 360},
    {"sequence",                T_sequence                  := 392},
    {"short",                   T_short                     := 412},
    {"timedate",                T_timedate                  := 448},
    {"object",                  T_object                    := 476},

    {"abstract",                T_abstract                  := 508},
    {"and",                     T_and                       := 520},
    {"await",                   T_await                     := 540},
    {"break",                   T_break                     := 560},
    {"by",                      T_by                        := 564},
    {"case",                    T_case                      := 580},
    {"catch",                   T_catch                     := 596},
    {"class",                   T_class                     := 616},
    {"const",                   T_const                     := 636},
    {"constant",                T_constant                  := 652},
    {"continue",                T_continue                  := 676},
    {"debugger",                T_debugger                  := 708},
    {"default",                 T_default                   := 732},
    {"do",                      T_do                        := 736},
    {"else",                    T_else                      := 756},
    {"elsif",                   T_elsif                     := 768},
    {"end",                     T_end                       := 780},
    {"enum",                    T_enum                      := 792},
    {"exit",                    T_exit                      := 808},
    {"export",                  T_export                    := 828},
    {"extends",                 T_extends                   := 852},
    {"fallthru",                T_fallthru                  := 884},
    {"fallthrough",             T_fallthrough               := 904},
    {"final",                   T_final                     := 924},
    {"finally",                 T_finally                   := 936},
    {"for",                     T_for                       := 948},
    {"forward",                 T_forward                   := 968},
    {"from",                    T_from                      := 984},
    {"function",                T_function                  := 1016},
    {"global",                  T_global                    := 1044},
    {"goto",                    T_goto                      := 1060},
    {"if",                      T_if                        := 1068},
    {"iff",                     T_iff                       := 1076},
    {"iif",                     T_iif                       := 1088},
    {"implements",              T_implements                := 1128},
    {"import",                  T_import                    := 1144},
    {"in",                      T_in                        := 1148},
    {"include",                 T_include                   := 1172},
    {"instanceof",              T_instanceof                := 1208},
    {"interface",               T_interface                 := 1232},
    {"let",                     T_let                       := 1244},
    {"native",                  T_native                    := 1268},
    {"not",                     T_not                       := 1280},
    {"or",                      T_or                        := 1288},
    {"package",                 T_package                   := 1320},
    {"private",                 T_private                   := 1348},
    {"procedure",               T_procedure                 := 1380},
    {"protected",               T_protected                 := 1408},
    {"public",                  T_public                    := 1432},
    {"return",                  T_return                    := 1460},
    {"static",                  T_static                    := 1480},
    {"super",                   T_super                     := 1500},
    {"switch",                  T_switch                    := 1524},
    {"synchronized",            T_synchronized              := 1572},
    {"then",                    T_then                      := 1588},
    {"this",                    T_this                      := 1600},
    {"throw",                   T_throw                     := 1616},
    {"throws",                  T_throws                    := 1624},
    {"to",                      T_to                        := 1632},
    {"trace",                   T_trace                     := 1652},
    {"transient",               T_transient                 := 1680},
    {"try",                     T_try                       := 1688},
    {"type",                    T_type                      := 1704},
    {"var",                     T_var                       := 1720},
    {"volatile",                T_volatile                  := 1752},
    {"while",                   T_while                     := 1776},
    {"with",                    T_with                      := 1792},
    {"without",                 T_without                   := 1808},
    {"xor",                     T_xor                       := 1824},

    {"apply",                   T_apply                     := 1844},
    {"append",                  T_append                    := 1860},
    {"columnize",               T_columnize                 := 1892},
    {"concat",                  T_concat                    := 1908},
    {"crash",                   T_crash                     := 1928},
    {"delete",                  T_delete                    := 1948},
    {"factors",                 T_factors                   := 1972},
    {"find",                    T_find                      := 1980},
    {"Icallback",               T_Icallback                 := 2016},
    {"IupAppend",               T_IupAppend                 := 2052},
    {"IupButton",               T_IupButton                 := 2080},
    {"IupClose",                T_IupClose                  := 2104},
    {"IupCloseOnEscape",        T_IupCloseOnEscape          := 2140},
    {"IupDestroy",              T_IupDestroy                := 2172},
    {"IupDialog",               T_IupDialog                 := 2196},
    {"IupFill",                 T_IupFill                   := 2216},
    {"IupFlatLabel",            T_IupFlatLabel              := 2252},
    {"IupFrame",                T_IupFrame                  := 2272},
    {"IupGetAttribute",         T_IupGetAttribute           := 2324},
    {"IupGetInt",               T_IupGetInt                 := 2340},
    {"IupGetIntInt",            T_IupGetIntInt              := 2356},
    {"IupHbox",                 T_IupHbox                   := 2376},
    {"IupLabel",                T_IupLabel                  := 2400},
    {"IupList",                 T_IupList                   := 2416},
    {"IupMap",                  T_IupMap                    := 2432},
    {"IupMessage",              T_IupMessage                := 2460},
    {"IupOpen",                 T_IupOpen                   := 2480},
    {"IupPopup",                T_IupPopup                  := 2504},
    {"IupSetAttribute",         T_IupSetAttribute           := 2556},
    {"IupSetAttributes",        T_IupSetAttributes          := 2564},
    {"IupSetAttributeHandle",   T_IupSetAttributeHandle     := 2592},
    {"IupSetAttributeId",       T_IupSetAttributeId         := 2604},
    {"IupSetAttributePtr",      T_IupSetAttributePtr        := 2620},
    {"IupSetCallback",          T_IupSetCallback            := 2656},
    {"IupSetGlobal",            T_IupSetGlobal              := 2684},
    {"IupSetInt",               T_IupSetInt                 := 2700},
    {"IupSetStrAttribute",      T_IupSetStrAttribute        := 2752},
    {"IupShow",                 T_IupShow                   := 2768},
    {"IupStoreAttribute",       T_IupStoreAttribute         := 2824},
    {"IupTable",                T_IupTable                  := 2848},
    {"IupTableResize_cb",       T_IupTableResize_cb         := 2888},
    {"IupTableSetData",         T_IupTableSetData           := 2920},
    {"IupText",                 T_IupText                   := 2936},
    {"IupToggle",               T_IupToggle                 := 2960},
    {"IupTreeAddNodes",         T_IupTreeAddNodes           := 3008},
    {"IupTreeView",             T_IupTreeView               := 3028},
    {"IupUser",                 T_IupUser                   := 3048},
    {"IupVbox",                 T_IupVbox                   := 3068},
    {"length",                  T_length                    := 3088},
    {"match",                   T_match                     := 3112},
    {"max",                     T_max                       := 3120},
    {"min",                     T_min                       := 3132},
    {"new",                     T_new                       := 3144},
    {"platform",                T_platform                  := 3176},
    {"prepend",                 T_prepend                   := 3200},
    {"printf",                  T_printf                    := 3216},
    {"repeat",                  T_repeat                    := 3236},
    {"rfind",                   T_rfind                     := 3256},
    {"split",                   T_split                     := 3276},
    {"split_any",               T_split_any                 := 3296},
    {"sprintf",                 T_sprintf                   := 3320},
    {"substitute",              T_substitute                := 3356},
    {"sum",                     T_sum                       := 3364},
    {"tagset",                  T_tagset                    := 3388},
    {"typeof",                  T_typeof                    := 3400},
    {"yield",                   T_yield                     := 3424},

    {"abort",                   T_abort                     := 3440},
    {"command_line",            T_command_line              := 3484},
    {"get_file_path",           T_get_file_path             := 3536},
    {"get_proper_dir",          T_get_proper_dir            := 3580},
    {"get_text",                T_get_text                  := 3600},
    {"IupConfig",               T_IupConfig                 := 3624},
    {"IupConfigDialogClosed",   T_IupConfigDialogClosed     := 3676},
    {"IupConfigDialogShow",     T_IupConfigDialogShow       := 3696},
    {"IupConfigLoad",           T_IupConfigLoad             := 3716},
    {"IupConfigSave",           T_IupConfigSave             := 3736},
    {"IupFileDlg",              T_IupFileDlg                := 3756},
    {"IupMainLoop",             T_IupMainLoop               := 3784},
    {"IupNormalizer",           T_IupNormalizer             := 3828},
    {"join_path",               T_join_path                 := 3868},
    {"open",                    T_open                      := 3884},
    {"peek_string",             T_peek_string               := 3928},
    {"pp",                      T_pp                        := 3936},
    {"wait_key",                T_wait_key                  := 3968},

    {"false",                   T_false                     := 3980},
    {"GT_LF_STRIPPED",          T_GT_LF_STRIPPED            := 4040},
    {"Infinity",                T_Infinity                  := 4072},
    {"IUP_CONTINUE",            T_IUP_CONTINUE              := 4120},
    {"IUP_DEFAULT",             T_IUP_DEFAULT               := 4152},
    {"IUP_BLACK",               T_IUP_BLACK                 := 4176},
    {"IUP_BLUE",                T_IUP_BLUE                  := 4188},
    {"IUP_CYAN",                T_IUP_CYAN                  := 4204},
    {"IUP_DARK_BLUE",           T_IUP_DARK_BLUE             := 4240},
    {"IUP_DARK_CYAN",           T_IUP_DARK_CYAN             := 4260},
    {"IUP_DARK_GRAY",           T_IUP_DARK_GRAY             := 4280},
    {"IUP_DARK_GREY",           T_IUP_DARK_GREY             := 4292},
    {"IUP_DARK_GREEN",          T_IUP_DARK_GREEN            := 4304},
    {"IUP_DARK_MAGENTA",        T_IUP_DARK_MAGENTA          := 4336},
    {"IUP_DARK_RED",            T_IUP_DARK_RED              := 4352},
    {"IUP_GRAY",                T_IUP_GRAY                  := 4372},
    {"IUP_GREY",                T_IUP_GREY                  := 4384},
    {"IUP_GREEN",               T_IUP_GREEN                 := 4396},
    {"IUP_INDIGO",              T_IUP_INDIGO                := 4424},
    {"IUP_MAGENTA",             T_IUP_MAGENTA               := 4456},
    {"IUP_NAVY",                T_IUP_NAVY                  := 4476},
    {"IUP_OLIVE",               T_IUP_OLIVE                 := 4500},
    {"IUP_RED",                 T_IUP_RED                   := 4516},
    {"IUP_LIGHT_BLUE",          T_IUP_LIGHT_BLUE            := 4560},
    {"IUP_LIGHT_GRAY",          T_IUP_LIGHT_GRAY            := 4580},
    {"IUP_LIGHT_GREY",          T_IUP_LIGHT_GREY            := 4592},
    {"IUP_LIGHT_GREEN",         T_IUP_LIGHT_GREEN           := 4604},
    {"IUP_ORANGE",              T_IUP_ORANGE                := 4628},
    {"IUP_PARCHMENT",           T_IUP_PARCHMENT             := 4668},
    {"IUP_PURPLE",              T_IUP_PURPLE                := 4692},
    {"IUP_SILVER",              T_IUP_SILVER                := 4720},
    {"IUP_TEAL",                T_IUP_TEAL                  := 4740},
    {"IUP_VIOLET",              T_IUP_VIOLET                := 4768},
    {"IUP_WHITE",               T_IUP_WHITE                 := 4792},
    {"IUP_YELLOW",              T_IUP_YELLOW                := 4820},
    {"K_cP",                    T_K_cP                      := 4840},
    {"K_cT",                    T_K_cT                      := 4848},
    {"K_ESC",                   T_K_ESC                     := 4864},
    {"K_F1",                    T_K_F1                      := 4876},
    {"JAVASCRIPT",              T_JAVASCRIPT                := 4920},
    {"JS",                      T_JS                        := 4928},
    {"Nan",                     T_Nan                       := 4944},
    {"null",                    T_null                      := 4948},
    {"NULL",                    T_NULL                      := 4964},
    {"true",                    T_true                      := 4976},
    {"undefined",               T_undefined                 := 5016},
    {"void",                    T_void                      := 5028},
    {"WEB",                     T_WEB                       := 5044}}
