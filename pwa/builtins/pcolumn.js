"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// pcolumn.e
// =========
//

/*global*/ function columnize(/*sequence*/ source, /*object*/ columns=["sequence"], defval=0) {
//
// Convert a set of sequences into a set of columns.
//
// Any atoms found in source are treated as if they were a 1-element sequence.
// The optional columns parameter can be a specific column number or an ordered set.
// The default value is used when some elements of source have different lengths.
//
// Examples
//  ?columnize({{1, 2}, {3, 4}, {5, 6}})            -- {{1,3,5}, {2,4,6}}
//  ?columnize({{1, 2}, {3, 4}, {5, 6, 7}})         -- {{1,3,5}, {2,4,6}, {0,0,7}}
//  ?columnize({{1}, {2}, {3, 4}},defval:=-999)     -- {{1,2,3}, {-999,-999,4}}
//  ?columnize({{1, 2}, {3, 4}, {5, 6, 7}}, 2)      -- {{2,4,6}}
//  ?columnize({{1, 2}, {3, 4}, {5, 6, 7}}, {2,1})  -- {{2,4,6}, {1,3,5}}
//  ?columnize({"abc", "def", "ghi"},defval:=' ')   -- {"adg", "beh", "cfi" }
//
//  (Specifying a default value of <SPACE> on the last example causes it to
//   return a sequence of strings, rather than dword-sequences, which might
//   display as {{97,100,103},{98,101,104},{99,102,105}}, or cause unwanted
//   type checks if the result is later processed using a string variable.)
//
    let /*sequence*/ result;
    let /*integer*/ ncolumns, col;
    let /*object*/ sj;
    let /*integer*/ k;
    if (!sequence(columns)) {
        columns = ["sequence",columns];
//--p2js: (untried)
//  else
//      columns = deep_copy(columns)
    }
    ncolumns = length(columns);
    if (ncolumns===0) {
        ncolumns = 0;
        for (let j=1, j$lim=length(source); j<=j$lim; j+=1) {
            sj = $subse(source,j);
            if (atom(sj)) {
                if (ncolumns===0) {
                    ncolumns = 1;
                }
            } else {
                k = length(sj);
                if (ncolumns<k) { ncolumns = k; }
            }
        }
//p2js:
//      for i=1 to ncolumns do
//          columns &= i
//      end for
        columns = tagset(ncolumns);
    }
    result = repeat(repeat(defval,length(source)),ncolumns);
    for (let i=1, i$lim=ncolumns; i<=i$lim; i+=1) {
        col = $subse(columns,i);
        for (let j=1, j$lim=length(source); j<=j$lim; j+=1) {
            sj = $subse(source,j);
            if (atom(sj)) {
                if (col===1) {
                    result = $repe(result,j,sj,["sequence",i]);
                }
            } else if (compare(col,length(sj))<=0) {
                result = $repe(result,j,$subse(sj,col),["sequence",i]);
            }
        }
    }
    return result;
}
