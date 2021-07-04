// auto-generated by pwa/p2js, see http://phix.x10.mx
"use strict";
//
// psqop.e
// =======
//
// The functions in this file implement explicit sequence ops.
//  This file is automatically included when needed, you should only
//  need to manually include it for compatibility with RDS Eu, or you
//  can write code in the following manner:
//      --/**/ sq_add() --/* -- Phix
//              +       --*/ -- RDS Eu
//
//  (Yes, '+' is far easier to type than 'sq_add()', but...
//        '=' is far easier to type than 'equal()', and...
//      the latter is several orders of magnitude more frequent.)
//
// As an example, the legacy sequence-op-based function lower() was:
//
//  global function lower(object x)
//  -- convert atom or sequence to lower case
//      return x + (x >= 'A' and x <= 'Z') * TO_LOWER
//  end function
//
// (Look in pcase.e to see the official Phix version of lower(), btw.)
//
// In Phix you could, if you really wanted, recode the above as:
//
//  global function lower(object x)
//  -- convert atom or sequence to lower case
//  sequence mask
//      -- create 1/0 mask for chars in A..Z/not in A..Z
//      mask = sq_and(sq_ge(x,'A'),sq_le(x,'Z'))
//      -- convert to TO_LOWER/0 array
//      mask = sq_mul(mask,TO_LOWER)
//      return sq_add(x,mask)
//  end function
//
// Agreed, it is visually uglier, but probably easier to understand 
// (rather than looking like integer add etc, you know it might be 
//  doing loads of work) and also //much easier to debug//.
//
// Interestingly, on RDS Eu the following is not significantly any
//  slower (ok, maybe 5%) than the legacy version from wildcard.e:
//
//  global function lower(object x)
//  -- convert atom or sequence to lower case
//  sequence tmp1, tmp2
//      tmp1 = (x >= 'A')
//      tmp2 = (x <= 'Z')
//      tmp1 = (tmp1 and tmp2)
//      tmp1 = (tmp1 * TO_LOWER)
//      tmp1 = (x + tmp1)
//      return tmp1
//  end function
//
// Admittedly, the Phix equivalent:
//
//  global function lower(object x)
//  -- convert atom or sequence to lower case
//  sequence tmp1, tmp2
//      tmp1 = sq_ge(x,'A')
//      tmp2 = sq_le(x,'Z')
//      tmp1 = sq_and(tmp1,tmp2)
//      tmp1 = sq_mul(tmp1,TO_LOWER)
//      tmp1 = sq_add(x,tmp1)
//      return tmp1
//  end function
//
//
//DEV the following timings probably pre-date pbr optimisation and should be re-done...
// is about 3.6x slower, however the pcase.e version is 8.4x
// faster than the legacy wildcard.e version (on Phix, that
// is, and about 2.7x faster on RDS Eu). Comparing the routine
// immediately above and builtins/pcase.e, when both are run on
// Phix, the latter is an astonishing 30.5x faster.
//
// The bottom line is, I guess, that Phix supports (explicit)
// sequence ops at a bearable speed loss, but there is usually
// a much faster way in Phix. If, and not before, performance
// of these routines causes real problems in real programs, I
// will reconsider recoding them in assembly.
//
// 2/5/21: completely rewritten for p2js (and vastly simplified)
//         note it is the programmer's responsibility to assign
//         unique/non-clashing private/internal character codes, 
//         eg/ie '+', '-', '*', ... 'f', 'g', 'l', ... etc.
//
                            // (not strictly necessary)
function $sq_fatal(/*sequence*/ a, /*sequence*/ b) {
    printf(1,"sequence lengths not the same (%d!=%d)!\n",["sequence",length(a),length(b)]);
    crash("9/0");
}
function $sq_general(/*object*/ a, b, /*integer*/ fn, /*bool*/ recursive=true) {
    if (atom(a) || !recursive) {
        if (atom(b) || !recursive) {
            switch (fn) {
                case 0X2B: a = a+b;
                    break;
                case 0X2D: a = a-b;
                    break;
                case 0X2A: a = a*b;
                    break;
                case 0X2F: a = a/b;
                    break;
                case 0X3C: a = compare(a,b)<0;
                    break;
                case 0X3D: a = equal(a,b);
                    break;
                case 0X3E: a = compare(a,b)>0;
                    break;
                case 0X61: a = a && b;
                    break;
                case 0X63: a = compare(a,b);
                    break;
                case 0X66: a = floor(a/b);
                    break;
                case 0X67: a = compare(a,b)>=0;
                    break;
                case 0X6C: a = compare(a,b)<=0;
                    break;
                case 0X6D: a = mod(a,b);
                    break;
                case 0X6E: a = !equal(a,b);
                    break;
                case 0X6F: a = a || b;
                    break;
                case 0X70: a = power(a,b);
                    break;
                case 0X72: a = remainder(a,b);
                    break;
                case 0X78: a = xor(a, b);
                    break;
                case 0X41: a = and_bits(a,b);
                    break;
                case 0X4F: a = or_bits(a,b);
                    break;
                case 0X4D: a = max(a,b);
                    break;
                case 0X4E: a = min(a,b);
                    break;
                case 0X58: a = xor_bits(a,b);
                    break;
                default: 
                    crash("9/0");
            }
            return a;
        }
        let /*integer*/ lb = length(b);
        let /*sequence*/ res = repeat(((string(b)) ? 0X20 : 0),lb);
        for (let i=1, i$lim=lb; i<=i$lim; i+=1) {
            res = $repe(res,i,$sq_general(a,$subse(b,i),fn));
        }
        return res;
    }
    let /*integer*/ la = length(a);
    let /*sequence*/ res = repeat(((string(a)) ? 0X20 : 0),la);
    if (atom(b)) {
        for (let i=1, i$lim=la; i<=i$lim; i+=1) {
            res = $repe(res,i,$sq_general($subse(a,i),b,fn));
        }
    } else {
        if (!equal(la,length(b))) { $sq_fatal(a,b); }
        for (let i=1, i$lim=la; i<=i$lim; i+=1) {
            res = $repe(res,i,$sq_general($subse(a,i),$subse(b,i),fn));
        }
    }
    return res;
}
function $sq_unary(/*object*/ a, /*integer*/ fn, /*bool*/ recursive=true) {
    if (atom(a) || !recursive) {
        switch (fn) {
            case 0X61: a = abs(a);
                break;
            case 0X63: a = ceil(a);
                break;
            case 0X65: a = even(a);
                break;
            case 0X66: a = floor(a);
                break;
            case 0X6C: a = log(a);
                break;
            case 0X31: a = log10(a);
                break;
            case 0X32: a = log2(a);
                break;
            case 0X6E: a = !a;
                break;
            case 0X6F: a = odd(a);
                break;
            case 0X71: a = sqrt(a);
                break;
            case 0X72: a = rand(a);
                break;
            case 0X73: a = compare(a,0);
                break;
            case 0X74: a = trunc(a);
                break;
            case 0X75: a = -a;
                break;
            case 0X43: a = cos(a);
                break;
            case 0X44: a = arccos(a);
                break;
            case 0X49: a = int(a);
                break;
            case 0X41: a = atom(a);
                break;
            case 0X47: a = string(a);
                break;
            case 0X51: a = sequence(a);
                break;
            case 0X52: a = arcsin(a);
                break;
            case 0X53: a = sin(a);
                break;
            case 0X54: a = tan(a);
                break;
            case 0X55: a = arctan(a);
                break;
            case 0X4E: a = not_bits(a);
                break;
            default: 
                crash("9/0");
        }
        return a;
    }
    let /*integer*/ la = length(a);
    let /*sequence*/ res = repeat(0,la);
    for (let i=1, i$lim=la; i<=i$lim; i+=1) {
        res = $repe(res,i,$sq_unary($subse(a,i),fn));
    }
    return res;
}

/*global*/ function sq_cmp(/*object*/ a, b) { return $sq_general(a,b,0X63); }

/*global*/ function sq_eq(/*object*/ a, b) { return $sq_general(a,b,0X3D); }

/*global*/ function sq_ne(/*object*/ a, b) { return $sq_general(a,b,0X6E); }

/*global*/ function sq_lt(/*object*/ a, b) { return $sq_general(a,b,0X3C); }

/*global*/ function sq_le(/*object*/ a, b) { return $sq_general(a,b,0X6C); }

/*global*/ function sq_gt(/*object*/ a, b) { return $sq_general(a,b,0X3E); }

/*global*/ function sq_ge(/*object*/ a, b) { return $sq_general(a,b,0X67); }

/*global*/ function sq_add(/*object*/ a, b) { return $sq_general(a,b,0X2B); }

/*global*/ function sq_sub(/*object*/ a, b) { return $sq_general(a,b,0X2D); }

/*global*/ function sq_mul(/*object*/ a, b) { return $sq_general(a,b,0X2A); }

/*global*/ function sq_div(/*object*/ a, b) { return $sq_general(a,b,0X2F); }

/*global*/ function sq_floor_div(/*object*/ a, b) { return $sq_general(a,b,0X66); }

/*global*/ function sq_rmdr(/*object*/ a, b) { return $sq_general(a,b,0X72); }

/*global*/ function sq_mod(/*object*/ a, b) { return $sq_general(a,b,0X6D); }

/*global*/ function sq_and(/*object*/ a, b) { return $sq_general(a,b,0X61); }

/*global*/ function sq_or(/*object*/ a, b) { return $sq_general(a,b,0X6F); }

/*global*/ function sq_xor(/*object*/ a, b) { return $sq_general(a,b,0X78); }

/*global*/ function sq_and_bits(/*object*/ a, b) { return $sq_general(a,b,0X41); }

/*global*/ function sq_or_bits(/*object*/ a, b) { return $sq_general(a,b,0X4F); }

/*global*/ function sq_xor_bits(/*object*/ a, b) { return $sq_general(a,b,0X58); }

/*global*/ function sq_power(/*object*/ a, b) { return $sq_general(a,b,0X70); }
// 24/6/21 false removed*2, for Hourglass puzzle... (all tests pass...)
//global function sq_max(object a, b) return $sq_general(a,b,'M',false) end function
/*global*/ function sq_max(/*object*/ a, b) { return $sq_general(a,b,0X4D); }
//global function sq_min(object a, b) return $sq_general(a,b,'N',false) end function
/*global*/ function sq_min(/*object*/ a, b) { return $sq_general(a,b,0X4E); }

/*global*/ function sq_abs(/*object*/ a) { return $sq_unary(a,0X61); }

/*global*/ function sq_floor(/*object*/ a) { return $sq_unary(a,0X66); }

/*global*/ function sq_ceil(/*object*/ a) { return $sq_unary(a,0X63); }

/*global*/ function sq_even(/*object*/ a) { return $sq_unary(a,0X65); }

/*global*/ function sq_sign(/*object*/ a) { return $sq_unary(a,0X73); }

/*global*/ function sq_trunc(/*object*/ a) { return $sq_unary(a,0X74); }

/*global*/ function sq_rand(/*object*/ a) { return $sq_unary(a,0X72); }

/*global*/ function sq_uminus(/*object*/ a) { return $sq_unary(a,0X75); }

/*global*/ function sq_not(/*object*/ a) { return $sq_unary(a,0X6E); }

/*global*/ function sq_not_bits(/*object*/ a) { return $sq_unary(a,0X4E); }

/*global*/ function sq_odd(/*object*/ a) { return $sq_unary(a,0X6F); }

/*global*/ function sq_cos(/*object*/ a) { return $sq_unary(a,0X43); }

/*global*/ function sq_sin(/*object*/ a) { return $sq_unary(a,0X53); }

/*global*/ function sq_tan(/*object*/ a) { return $sq_unary(a,0X54); }

/*global*/ function sq_arccos(/*object*/ a) { return $sq_unary(a,0X44); }

/*global*/ function sq_arcsin(/*object*/ a) { return $sq_unary(a,0X52); }

/*global*/ function sq_arctan(/*object*/ a) { return $sq_unary(a,0X55); }

/*global*/ function sq_log(/*object*/ a) { return $sq_unary(a,0X6C); }

/*global*/ function sq_log10(/*object*/ a) { return $sq_unary(a,0X31); }

/*global*/ function sq_log2(/*object*/ a) { return $sq_unary(a,0X32); }

/*global*/ function sq_sqrt(/*object*/ a) { return $sq_unary(a,0X71); }

/*global*/ function sq_int(/*object*/ a) { return $sq_unary(a,0X49,false); }

/*global*/ function sq_atom(/*object*/ a) { return $sq_unary(a,0X41,false); }

/*global*/ function sq_str(/*object*/ a) { return $sq_unary(a,0X47,false); }

/*global*/ function sq_seq(/*object*/ a) { return $sq_unary(a,0X51,false); }
// If sq_atom()/sq_seq() used recursion, you would just get a 
// "tree of 1's"/"tree of 0's" of the exact same size/shape.
// [ie sum(sq_atom(x)) would be === length(flatten(x)), and
//  sum(sq_seq(x)) would always be 0, for any and all x]
// It may be that these routines deserve a "nest" parameter
// (possibly defaulted to 1), ditto for sq_int/sq_str.
// OTOH, there are NO known uses of the above routines, anywhere!
// update: recursion removed for sq_int/sq_str, as per docs.

// removed 31/3/21 (p2js):
 /*
--DEV not even sure these return anything different from upper/lower...
-- (ie: this might just be a sad hangover from trying to cope with the one in wildcard.e)
--include builtins\pcase.e as pcase
include builtins\pcase.e

global function sq_upper(object a)
--  if integer(a) then return pcase:upper(a) end if
    if integer(a) then return upper(a) end if
    if atom(a) then return a end if
--  if string(a) then return pcase:upper(a) end if
    if string(a) then return upper(a) end if
    for i=1 to length(a) do
        a[i] = sq_upper(a[i])
    end for
    return a
--DEV tryme:
--  return pcase:upper(a)
end function

global function sq_lower(object a)
--  if integer(a) then return pcase:lower(a) end if
    if integer(a) then return lower(a) end if
    if atom(a) then return a end if
--  if string(a) then return pcase:lower(a) end if
    if string(a) then return lower(a) end if
    for i=1 to length(a) do
        a[i] = sq_lower(a[i])
    end for
    return a
--DEV tryme:
--  return pcase:lower(a)
end function
*/ 

/*global*/ function sq_round(/*object*/ a, /*object*/ inverted_precision=1) {
    let /*integer*/ len, lp;
    let /*object*/ res;
    inverted_precision = sq_abs(inverted_precision);
    if (atom(a)) {
        if (atom(inverted_precision)) {
//25/5/20
//          res = floor(0.5 + (a * inverted_precision )) / inverted_precision
            res = round(a,inverted_precision);
        } else {
            len = length(inverted_precision);
            res = repeat(0,len);
            for (let i=1, i$lim=len; i<=i$lim; i+=1) {
                res = $repe(res,i,sq_round(a,$subse(inverted_precision,i)));
            }
        }
    } else {
        len = length(a);
        res = repeat(0,len);
        if (atom(inverted_precision)) {
            for (let i=1, i$lim=len; i<=i$lim; i+=1) {
                res = $repe(res,i,sq_round($subse(a,i),inverted_precision));
            }
        } else {
            lp = length(inverted_precision);
            if (len!==lp) { crash("sequence lengths not the same (%d!=%d)!\n",["sequence",len,lp]); }
            for (let i=1, i$lim=len; i<=i$lim; i+=1) {
                res = $repe(res,i,sq_round($subse(a,i),$subse(inverted_precision,i)));
            }
        }
    }
    return res;
}
