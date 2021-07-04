"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// builtins/punique.e
//
// See also/similar to Eu's include/std/sequence.e/$remove_dups()...
//
//include dict.e

/*global*/ function unique(/*sequence*/ s, /*string*/ options="SORT") {
    if (compare(length(s),1)>0) {
        let /*integer*/ outdx = 1;
        if ((options==="STABLE") || (options==="INPLACE")) {
            let /*integer*/ d = new_dict();
            setd($subse(s,1),0,d);
            for (let i=2, i$lim=length(s); i<=i$lim; i+=1) {
                let /*object*/ si = $subse(s,i);
//7/2/21
//              if getd_index(si)=NULL then
                if (equal(getd_index(si,d),NULL)) {
                    setd(si,0,d);
                    outdx += 1;
                    s = $repe(s,outdx,si);
                }
            }
            destroy_dict(d);
/*
--DEV untested, just an idea, that sorta fell apart before I tried testing it...
-- (I was aiming for a stable sort, just got a bit flummoxed, and don't really need it right now anyway)
        elsif options="TAGSORT" then
            sequence tags = custom_sort(s, tagset(length(s))) 
            object prev = s[tags[1]]
--          sequence res = {prev}
            for i=2 to length(tags) do
                object next = s[tags[i]]
                if next!=prev then
--                  res = append(res,next)
                    prev = next
                end if
            end for
            return res
*/
        } else {
            if (options!=="PRESORTED") {
                if (options!=="SORT") {
                    crash("9/0"); // unknown
                }
                s = sort(s);
            }
            let /*object*/ prev = $subse(s,1);
            for (let i=2, i$lim=length(s); i<=i$lim; i+=1) {
                if (!equal($subse(s,i),prev)) {
                    prev = $subse(s,i);
                    outdx += 1;
                    s = $repe(s,outdx,prev);
                }
            }
        }
        s = $subss(s,1,outdx);
    }
    return s;
}
// Euphoria compatibility (not autoincluded)
/*global*/ 
const $RD_INPLACE = 1, $RD_PRESORTED = 2, $RD_SORT = 3
const $ops = ["sequence","INPLACE", "PRESORTED", "SORT"];

/*global*/ function $remove_dups(/*sequence*/ source_data, /*integer*/ proc_option=$RD_PRESORTED) {
    return unique(source_data,$subse($ops,proc_option));
}
