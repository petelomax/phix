// auto-generated by pwa/p2js, see http://phix.x10.mx
"use strict";
//
// builtins/scanf.e
// ================
//
//  (Also implements to_number())
//  scanf(s,fmt) attempts to find sequence params for which sprintf(fmt,params) could have produced s.
//
//  May return more than one set, for example 
//          res = scanf("one two three","%s %s") - res is {{"one","two three"},{"one two","three"}}
//
//  Note that scanf relies heavily on literal separators, especially spaces. It is illegal to specify back-to-back
//  strings, integers, or atoms with format strings such as "%s%s", "%d%d", "%s%d", etc. The one exception is that
//  a string can immediately follow a number, an example of which is "4th" and "%d%s". Theoretically it might be
//  possible to write a scanf that yields {{1,23},{12,3}} from scanf("123","%d%d") but I for one cannot think of
//  a single practical use, and a scanf(x,"%s%s") that returns {{"",x},..{x,""}} is also of dubious value.
//  Likewise the ability to get {"hello",12} from "hello12", which is hard, as opposed to from "hello 12", which 
//  is trivial, is deemed completely unnecessary.
//
//  Any width/precision/justify/zerofill details are for the most part quietly ignored: you may get the same results
//  from %d/%d/%d as %02d/%02d/%04d, but obviously the latter might make the intent clearer, re-use something that 
//  actually needs those qualifiers, or just be brain on autopilot: any error or warning here would hinder rather 
//  than help. If scanf is about to return several possibilities, it tests the results of sprintf and trims the 
//  result set down to those with an exact character-by-character match, as long as that does not trim the result 
//  set down to zero, and, as in the example above, may trim nothing.
//
//  Internally scanf only cares for d/f/s formats; (x/o/b)/(e/g)/(c) are treated as respective aliases, up to but 
//  not including the afore-mentioned final printf trimming stage that is. For more details regarding format strings 
//  refer to printf. All characters not part of a %-group are treated as literal. There is no way to suggest, let 
//  alone force, that say scanf("#FF","%d") should fail but scanf("255","%d") should succeed, and anything like 
//  scanf("#FF","#%x") simply does not work (sorry), but scanf("#FF","%x") is perfectly fine, apart from the fact 
//  that sprintf("%x",#FF) produces "FF" not "#FF". [DEV both scanf("#FF","#%x") and scanf("FF","%x") fail...]
//
//  Failure is indicated by {}. Otherwise each element of the results has as many elements as there were format
//  specifications in the format string, in the same order as specfied. A perfect unique and unambiguous result
//  is indicated by length(res)=1.
//
//  The parse_date_string() function of timedate is a much better way to process date and time strings.
//
//  (programming note: %s is all the wildcard-matching we can handle; ? and * are treated as literals.)
//
//!/**/without debug -- (keep ex.err clean)
//
// The real gruntwork here is recognising numbers (if you think this is complicated, google "scanf.c").
//  Much of $get_number() and $completeFloat() was copied from ptok.e, should really unify I spose, but
//  ptok.e relies heavily on there being a \n at the end of every line, which this cannot, really.
// The clever bit, if you can call it that, is strings simply expand between literal matches.
//

// (actual values have no special meaning, except for one test that assumes $NONE<$LITERAL<REST.
//  the values -1,0,1,2,3, for example, could just as easily have been used instead)
const $NONE = 0, 
      $LITERAL = 1,      // (note we actually store a string, rather than the 1)
//       INTEGER = 2,   -- ( ie %d )
      $ATOM = 4,         // ( ie %f )
      $STRING = 8,       // ( ie %s )
      $DECIMAL = 10, 
      $BINARY = 12, 
      $HEXADEC = 16, 
      $OCTAL = 18;
function $parse_fmt(/*string*/ fmt) {
//
// internal: converts eg "  Vendor: %s Model: %s Rev: %4d"
//                    to {"  Vendor: ",$STRING," Model: ",$STRING," Rev: ",INTEGER}
//                    =~ {$LITERAL,     $STRING,$LITERAL,   $STRING,$LITERAL, INTEGER}
// invalid formats cause a fatal runtime error
//
    let /*integer*/ fmtdx = 1, 
                    litstart = 1;
    let /*integer*/ $scan_ch, 
                    ftyp, 
                    last = $NONE;
    let /*sequence*/ res = ["sequence"];
    if (equal(length(fmt),0)) { crash("length(fmt) is 0"); }
    while (compare(fmtdx,length(fmt))<=0) {
        $scan_ch = $subse(fmt,fmtdx);
        if ($scan_ch===0X25) {
            if (litstart<fmtdx) {
                if (equal(last,$LITERAL)) {
                    res = $repe(res,-1,$conCat($subse(res,-1),($subss(fmt,litstart,fmtdx-1))));
                } else {
                    res = append(res,$subss(fmt,litstart,fmtdx-1));
                }
                last = $LITERAL;
            }
            fmtdx += 1;
            if (compare(fmtdx,length(fmt))>0) { crash("bad format"); }
            $scan_ch = $subse(fmt,fmtdx);
            // skip any maxwidth/precision/zerofill/justify etc:
            while (($scan_ch>=0X30 && $scan_ch<=0X39) || (!equal(find($scan_ch,"+-.,"),0))) {
                fmtdx += 1;
                if (compare(fmtdx,length(fmt))>0) { crash("bad format"); }
                $scan_ch = $subse(fmt,fmtdx);
            }
            switch (lower($scan_ch)) {
                case 0X73: case 0X63: ftyp = $STRING;
//              case 'd','x','o','b':   ftyp = INTEGER
                    break;
                case 0X64: ftyp = $DECIMAL;
                    break;
                case 0X62: ftyp = $BINARY;
                    break;
                case 0X6F: ftyp = $OCTAL;
                    break;
                case 0X74: ftyp = $OCTAL;
                    break;
                case 0X78: ftyp = $HEXADEC;
                    break;
                case 0X66: case 0X67: case 0X65: ftyp = $ATOM;
                    break;
                case 0X25: ftyp = $LITERAL;
                    break;
                default: 
                    crash("bad format");
            }
            if (equal(ftyp,$LITERAL)) {
                if (equal(last,$LITERAL)) {
                    res = $repe(res,-1,$conCat($subse(res,-1),(0X25)));
                } else {
                    res = append(res,"%");
                }
            } else {
                if (equal(ftyp,$STRING)) {
                    if (equal(last,$STRING)) { crash("bad format"); }
                } else {
                    if (compare(last,$LITERAL)>0) { crash("bad format"); }
                }
                res = append(res,ftyp);
            }
            last = ftyp;
            litstart = fmtdx+1;
        }
        fmtdx += 1;
    }
    if (litstart<fmtdx) {
        if (equal(last,$LITERAL)) {
            res = $repe(res,-1,$conCat($subse(res,-1),($subss(fmt,litstart,-1))));
        } else {
//31/10/15:
//          res &= fmt[litstart..$]
            res = append(res,$subss(fmt,litstart,-1));
        }
    }
    return res;
}
//constant $bases = {8,16,2,10}  -- NB: oxbd order
let /*string*/ $baseset;
let /*sequence*/ $bases;
let /*integer*/ $binit = 0;
function $initb() {
    $baseset = repeat(255,256);
    for (let i=0; i<=9; i+=1) {
        $baseset = $repe($baseset,0X30+i,i);
    }
//  for i=10 to 15 do
    for (let i=10; i<=35; i+=1) {
        $baseset = $repe($baseset,(0X41+i)-10,i);
        $baseset = $repe($baseset,(0X61+i)-10,i);
    }
    $bases = ["sequence",8,16,2,10]; // NB: oxbd order
    $binit = 1;
}
let /*integer*/ $scan_ch;
//NB code from ptok.e relies on there being a \n at the end.
function $completeFloat(/*string*/ s, /*integer*/ sidx, /*atom*/ N, /*integer*/ msign) {
    let /*integer*/ tokvalid;
    let /*atom*/ dec;
    let /*integer*/ exponent;
    let /*integer*/ esigned;
    let /*atom*/ fraction;
    if ($scan_ch===0X2E) {
        tokvalid = 0;
//      dec = 10
        dec = 1;
        fraction = 0;
        while (1) {
//          sidx += 1
            if (compare(sidx,length(s))>0) { break; }
            $scan_ch = $subse(s,sidx);
            if ($scan_ch!==0X5F) {
                if ($scan_ch<0X30 || $scan_ch>0X39) { break; }
//27/10/15
//              N += ($scan_ch-'0') / dec
                fraction = fraction*10+($scan_ch-0X30);
                dec *= 10;
                tokvalid = 1;
            }
            sidx += 1;
        }
        if (tokvalid===0) { return ["sequence"]; }
        N += fraction/dec;
    } else {
        sidx -= 1;
    }
    exponent = 0;
    if (($scan_ch===0X65) || ($scan_ch===0X45)) {
        tokvalid = 0;
        esigned = 0;
        while (1) {
            sidx += 1;
            if (compare(sidx,length(s))>0) { break; }
            $scan_ch = $subse(s,sidx);
            if ($scan_ch<0X30 || $scan_ch>0X39) {
                if ($scan_ch!==0X5F) {
                    if (tokvalid===1) { break; }   // ie first time round only
                    if ($scan_ch===0X2D) {
                        esigned = 1;
                    } else if ($scan_ch!==0X2B) {
                        break;
                    }
                }
            } else {
                exponent = (exponent*10+$scan_ch)-0X30;
                tokvalid = 1;
            }
//          sidx += 1
        }
        if (tokvalid===0) { return ["sequence"]; }
        if (esigned) {
            exponent = -exponent;
        }
        if (exponent<0) {
            if (exponent<-308) {
                // rare case: avoid power() overflow
                N /= power(10,308);
                if (exponent<-1000) {
                    exponent = -1000;
                }
                for (let i=1, i$lim=-exponent-308; i<=i$lim; i+=1) {
                    N /= 10;
                }
            } else {
                N /= power(10,-exponent);
            }
        } else {
            if (exponent>308) {
                // rare case: avoid power() overflow
                N *= power(10,308);
                if (exponent>1000) {
                    exponent = 1000;
                }
                for (let i=1, i$lim=exponent-308; i<=i$lim; i+=1) {
                    N *= 10;
                }
            } else {
                N *= power(10,exponent);
            }
        }
    }
    return ["sequence",N*msign,sidx];
}
function $get_number(/*string*/ s, /*integer*/ sidx, inbase=10) {
    let /*integer*/ scan_ch2;
    let /*atom*/ N;
    let /*integer*/ msign, base = 0, tokvalid = 1;
//  sidx += 1
    if (compare(sidx,length(s))>0) { return ["sequence"]; }
    $scan_ch = $subse(s,sidx);
    msign = 1;
    if ($scan_ch===0X2D) {
        sidx += 1;
        if (compare(sidx,length(s))>0) { return ["sequence"]; }
        $scan_ch = $subse(s,sidx);
        msign = -1;
    } else if ($scan_ch===0X2B) {
        sidx += 1;
        if (compare(sidx,length(s))>0) { return ["sequence"]; }
        $scan_ch = $subse(s,sidx);
    }
//  if  $scan_ch>='0' 
//  and $scan_ch<='9' then
    N = $subse($baseset,$scan_ch);
    if (N<inbase) {
        sidx += 1;
        if (compare(sidx,length(s))>0) { return ["sequence",N*msign,sidx]; }
        $scan_ch = $subse(s,sidx);
        if (N===0) { // check for 0x/o/b/d formats
//          base = find($scan_ch,"toxbd(")
            base = find(lower($scan_ch),((inbase>10) ? "toxxx(" : "toxbd("));
            if (base) {
                if (base>1) {
                    base -= 1;
                }
                if (base===5) {     // 0(nn) case
                    base = 0;
                    while (1) {
                        sidx += 1;
                        if (compare(sidx,length(s))>0) { return ["sequence"]; }
                        $scan_ch = $subse(s,sidx);
                        if ($scan_ch<0X30 || $scan_ch>0X39) { break; }
                        base = (base*10+$scan_ch)-0X30;
                    }
                    if ((base<2 || base>16) || ($scan_ch!==0X29)) { return ["sequence"]; }
                } else {
                    base = $subse($bases,base);
                }
                sidx += 1;
                if (compare(sidx,length(s))>0) { return ["sequence"]; }
                $scan_ch = $subse(s,sidx);
                tokvalid = 0;
                if ((base===8) && ($scan_ch===0X62)) { // getByteWiseOctal()
                    sidx += 1;
                    if (compare(sidx,length(s))>0) { return ["sequence"]; }
                    $scan_ch = $subse(s,sidx);
                    // groups of 3:
                    while (1) {
                        // first char 0..3
                        $scan_ch = $subse($baseset,$scan_ch);
                        if ($scan_ch>3) { break; }
                        tokvalid = 0;
                        N = N*4+$scan_ch;
                        sidx += 1;
                        if (compare(sidx,length(s))>0) { return ["sequence"]; }
                        $scan_ch = $subse(s,sidx);
                        // second char 0..7
                        $scan_ch = $subse($baseset,$scan_ch);
                        if ($scan_ch>7) { return ["sequence"]; }
                        N = N*8+$scan_ch;
                        sidx += 1;
                        if (compare(sidx,length(s))>0) { return ["sequence"]; }
                        $scan_ch = $subse(s,sidx);
                        // third char 0..7
                        $scan_ch = $subse($baseset,$scan_ch);
                        if ($scan_ch>7) { return ["sequence"]; }
                        N = N*8+$scan_ch;
                        tokvalid = 1;
                        sidx += 1;
                        if (compare(sidx,length(s))>0) { break; }
                        $scan_ch = $subse(s,sidx);
                    }
                    if (tokvalid===0) { return ["sequence"]; }
                    return ["sequence",N*msign,sidx];
                }
//              else
//                  while 1 do
//                      if $scan_ch!='_' then    -- allow eg 1_000_000 to mean 1000000 (any base)
//                          $scan_ch = $baseset[$scan_ch]
//                          if $scan_ch>=base then exit end if   
//                          N = N*base + $scan_ch
//                          tokvalid = 1
//                      end if
//                      sidx += 1
//                      if sidx>length(s) then exit end if
//                      $scan_ch = s[sidx]
//                  end while
//              end if
//              if tokvalid=0 then return {} end if
//              return {N*msign,sidx}
            }
        }
        if (base===0) { base = inbase; }
        while (1) {
//          if $scan_ch<'0' or $scan_ch>'9' then
//              if $scan_ch!='_' then exit end if    -- allow eg 1_000_000 to mean 1000000
//          else
//              N = N*10 + $scan_ch-'0'
//          end if
            if ($scan_ch!==0X5F) {   // allow eg 1_000_000 to mean 1000000 (any base)
//31/7/19:
                if ($scan_ch===0X2E) { break; }
                scan_ch2 = $subse($baseset,$scan_ch);
                if (scan_ch2>=base) { break; }
                N = N*base+scan_ch2;
                tokvalid = 1;
            }
            sidx += 1;
            if (compare(sidx,length(s))>0) { break; }
            $scan_ch = $subse(s,sidx);
        }
        if (compare(sidx,length(s))<0) {
            sidx = sidx+1;
            scan_ch2 = $subse(s,sidx);
            if ($scan_ch!==0X2E) {
                // allow eg 65'A' to be the same as 65:
//DEV could probably do with some more bounds checking here (spotted in passing)
                if ((($scan_ch===0X27) && (equal($subse(s,sidx),N))) && (equal($subse(s,sidx+2),0X27))) {
                    sidx += 3;
                    return ["sequence",N*msign,sidx];
                }
                scan_ch2 = 0X2E;
            }
            if ((scan_ch2!==0X2E) || (($scan_ch===0X65) || ($scan_ch===0X45))) { // exponent ahead
                return $completeFloat(s,sidx,N,msign);
            }
            sidx -= 1;
        } else if (tokvalid===0) { // eg "0b" or "0(16)", ie no actual digits
            return ["sequence"];
        }
        return ["sequence",N*msign,sidx];
    } else if ($scan_ch===0X2E) {
        sidx += 1;
        if (compare(sidx,length(s))>0) { return ["sequence"]; }
        $scan_ch = $subse(s,sidx);
        if ($scan_ch>=0X30 && $scan_ch<=0X39) { // ".4" is a number
//          sidx -= 1
            $scan_ch = 0X2E;
            return $completeFloat(s,sidx,0,msign);
        }
        return ["sequence"];
    } else if ($scan_ch===0X23) {
        tokvalid = 0; // ensure followed by >=1 hex digit
        N = 0;
        while (1) {
            sidx += 1;
            if (compare(sidx,length(s))>0) { break; }
            $scan_ch = $subse(s,sidx);
            if ($scan_ch!==0X5F) {
                $scan_ch = $subse($baseset,$scan_ch);
                if ($scan_ch>16) { break; }
                N = N*16+$scan_ch;
                tokvalid = 1;
            }
        }
        if (tokvalid===0) { return ["sequence"]; }
        return ["sequence",N*msign,sidx];
    }
    return ["sequence"];
}

/*global*/ function to_number(/*string*/ s, /*object*/ failure=["sequence"], /*integer*/ inbase=10) {
    let /*atom*/ N;
    let /*integer*/ sidx = 1;
    if (!$binit) { $initb(); }
    if (compare(length(s),2)>=0 && (equal($subss(s,1,2),"0("))) {
        [,inbase,sidx] = $get_number(s,3,10);
        if (!equal($subse(s,sidx),0X29)) { return failure; }
        sidx += 1;
    }
    let /*sequence*/ r = $get_number(s,sidx,inbase);
    if (length(r)) {
        [,N,sidx] = r;
        if (compare(sidx,length(s))>0) {
            return N;
        }
    }
//  return {}   -- failure?
    return failure;
}
function $scanff(/*sequence*/ res, /*string*/ s, /*integer*/ sidx, /*sequence*/ fmts, /*integer*/ fidx) {
    let /*object*/ ffi, tries;
    let /*integer*/ start;
    let /*sequence*/ resset = ["sequence"];
    let /*atom*/ N;
//integer goodres
    if (compare(fidx,length(fmts))<=0) {
        if (!$binit) { $initb(); }
        ffi = $subse(fmts,fidx);
        if (string(ffi)) {  // $LITERAL
            for (let i=1, i$lim=length(ffi); i<=i$lim; i+=1) {
                if (compare(sidx,length(s))>0 || (!equal($subse(s,sidx),$subse(ffi,i)))) { return ["sequence"]; }
                sidx += 1;
            }
            res = $scanff(res,s,sidx,fmts,fidx+1);
        } else if (equal(ffi,$STRING)) {
            if (equal(fidx,length(fmts))) {
                res = append(res,$subss(s,sidx,-1));
                return ["sequence",res];
            }
            fidx += 1;
            ffi = $subse(fmts,fidx);
            fidx += 1;
            if (!string(ffi)) { crash("9/0"); }     // should never happen
                                // (should have been spotted in $parse_fmt)
            start = sidx;
            res = append(res,0);    // (placeholder, overwritten/discarded)
            resset = ["sequence"];
            while (1) {                             // backtracking loop
                sidx = match(ffi,s,sidx);
                if (sidx===0) { break; }
                res = $repe(res,-1,$subss(s,start,sidx-1));
//              tries = $scanff(res,s,sidx+length(ffi),fmts,fidx)
                tries = $scanff(deep_copy(res),s,sidx+length(ffi),fmts,fidx);
                if (length(tries)) {
                    resset = $conCat(resset, tries);
                }
//              tries = 0
                sidx += 1;
            }
            res = resset;
        } else {
//       $ATOM    = 4,   -- ( ie %f )
//       $DECIMAL = 10,
//       $BINARY  = 12,
//       $HEXADEC = 16,
//       $OCTAL   = 18
            let /*integer*/ inbase = $subse(["sequence",10,10,2,16,8],find(ffi,["sequence",$ATOM,$DECIMAL,$BINARY,$HEXADEC,$OCTAL]));
            tries = $get_number(s,sidx,inbase);
            if (equal(length(tries),0)) { return ["sequence"]; }
            [,N,sidx] = tries;
//          if ffi=INTEGER then
            if (compare(ffi,$DECIMAL)>=0) {
//              if not integer(N) then return {} end if
                if (!integer(N) && (N!==floor(N))) { return ["sequence"]; }
            }
            res = append(res,N);
            res = $scanff(res,s,sidx,fmts,fidx+1);
        }
    } else {
        if (compare(sidx,length(s))<=0) { return ["sequence"]; }
        res = ["sequence",res];
    }
//finally moved 22/7/19: (upon also spotting that fmts is no good for the sprintf() call anyways)
//DEV/DOH: this should almost certainly be in scanf itself! [ie no need for "and sidx=1 and fidx=1"] (spotted in passing)
//  if length(res)>1 and sidx=1 and fidx=1 then
//      -- filter multiple results to exact matches
//      goodres = 0
//      for i=1 to length(res) do
//          if sprintf(fmts,res[i])==s then
//              goodres += 1
//              res[goodres] = res[i]
//          end if
//      end for
//      if goodres!=0 then
//          res = res[1..goodres]
//      end if
//  end if
    return res;
}

/*global*/ function scanf(/*string*/ s, /*string*/ fmt) {
//  return $scanff({},s,1,$parse_fmt(fmt),1)
//p2js:
//  sequence res = $scanff({},s,1,$parse_fmt(fmt),1)
    let /*sequence*/ res = ["sequence"];
    res = $scanff(res,s,1,$parse_fmt(fmt),1);
    if (compare(length(res),1)>0) {
        // filter multiple results to exact matches
        let /*integer*/ goodres = 0;
        for (let i=1, i$lim=length(res); i<=i$lim; i+=1) {
            if (equal(sprintf(fmt,$subse(res,i)),s)) {
                goodres += 1;
                res = $repe(res,goodres,$subse(res,i));
            }
        }
        if (goodres!==0) {
            res = $subss(res,1,goodres);
        }
    }
    return res;
}
