"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// builtins/pfindall.e
//
/*global*/ function find_all(/*object*/ needle, /*sequence*/ haystack, /*integer*/ start=1) {
    let /*sequence*/ res = ["sequence"];
//  if start<0 then start += length(haystack)+1 end if -- (done by find() anyway)
    while (true) {
        start = find(needle,haystack,start);
        if (start===0) { break; }
        res = $conCat(res, start);
        start += 1;
    }
    return res;
}