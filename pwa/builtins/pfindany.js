"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// pfindany.e
//
//  Phix implementation of find_any()
//
// This is an auto-include file; there is no need to manually include
//  it, unless you want a namespace.
//

/*global*/ function find_any(/*sequence*/ needles, haystack, /*integer*/ start=1) {
    for (let i=start, i$lim=length(haystack); i<=i$lim; i+=1) {
        if (find($subse(haystack,i),needles)) {
            return i;
        }
    }
    return 0;
}
