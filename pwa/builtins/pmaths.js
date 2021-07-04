// auto-generated by pwa/p2js, see http://phix.x10.mx
"use strict";
//
// pmaths.e
//
//  Phix implementation of abs(), round(), ceil(), sign(), min(), max()
//
// Note: There is no automatic-substitution-with-warning, as yet, of 
//       sq_abs, sq_round, sq_ceil, sq_sign, sq_mod, or sq_trunc.
//       Not that I have any particular objection to such, or even
//       just deleting the ones in psqop.e in favour of enhancing
//       the routines in here, to cope with sequence parameters.
//
//       There are no sq_xx versions of exp, min, max or atan2;
//       while sq_exp could be made, the other 3 c/should not.
//
// This is an auto-include file; there is no need to manually include
//  it, unless you want a namespace.
//
/*without trace*/ //include VM\pTrig.e    -- (not strictly necessary)

/*global*/ function abs(/*atom*/ a) {
    if (a<0) {
        a = -a;
    }
    return a;
}

/*global*/ function sign(/*atom*/ a) {
    if (a>0) {
        a = +1;
    } else if (a<0) {
        a = -1;
    }
    return a;
}

/*global*/ function even(/*atom*/ a) {
    return equal(and_bits(a,1),0);
}

/*global*/ function odd(/*atom*/ a) {
    return equal(and_bits(a,1),1);
}

/*global*/ function exp(/*atom*/ a) {
    return power(E,a);
}
//bool bUseBankersRounding = false

/*global*/ function round(/*atom*/ a, /*atom*/ inverted_precision=1) {
//  if inverted_precision=0 then
//      if a!=true and a!=false then ?9/0 end if
//      bUseBankersRounding = a
//  elsif bUseBankersRounding then
//      --25/5/20 (round to nearest even)
//      integer s = sign(a)
//      a = abs(a)*inverted_precision
//      atom t = floor(a), f = a-t
//      if f=0.5 then
//          a = t+and_bits(t,1)
//      else
//          a = floor(0.5+a)
//      end if
//      a = s*(a/inverted_precision)
//  else
        // (compatible with Euphoria)
    inverted_precision = abs(inverted_precision);
    a = floor(.5+a*inverted_precision)/inverted_precision;
//  end if
    return a;
}

/*global*/ function bankers_rounding(/*atom*/ pence, /*integer*/ precision=1) {
    let /*integer*/ pennies,  // (or nearest 100, etc, but never nearest < 1 )
                    s = sign(pence), whole;
    pence = abs(pence)/precision;
    whole = floor(pence);
    let /*atom*/ fract = pence-whole;
    if (fract===.5) {
        pennies = whole+and_bits(whole,1);
    } else {
        pennies = floor(.5+pence);
    }
    pennies *= s*precision;
    return pennies;
}

/*global*/ function ceil(/*atom*/ o) {
    o = -floor(-o);
    return o;
}

/*global*/ function min(/*object*/ a, /*object*/ b) {
    if (compare(a,b)<0) { return a; } else { return b; }
}

/*global*/ function minsq(/*sequence*/ s, /*bool*/ return_index=false) {
    let /*object*/ res = $subse(s,1);
    let /*integer*/ rdx = 1;
    for (let i=2, i$lim=length(s); i<=i$lim; i+=1) {
        if (compare($subse(s,i),res)<0) {
            res = $subse(s,i);
            rdx = i;
        }
    }
    return ((return_index) ? rdx : res);
}

/*global*/ function max(/*object*/ a, /*object*/ b) {
    if (compare(a,b)>0) { return a; } else { return b; }
}

/*global*/ function maxsq(/*sequence*/ s, /*bool*/ return_index=false) {
    let /*object*/ res = $subse(s,1);
    let /*integer*/ rdx = 1;
    for (let i=2, i$lim=length(s); i<=i$lim; i+=1) {
        if (compare($subse(s,i),res)>0) {
            res = $subse(s,i);
            rdx = i;
        }
    }
    return ((return_index) ? rdx : res);
}

/*global*/ function mod(/*atom*/ x, /*atom*/ y) {
    if (equal(sign(x),sign(y))) {
        return remainder(x,y);
    }
    return x-y*floor(x/y);
}

/*global*/ function trunc(/*atom*/ x) {
//  return sign(x)*floor(abs(x))
    if (x<0) {
        return -floor(-x);
    }
    return floor(x);
}

/*global*/ function atan2(/*atom*/ y, /*atom*/ x) {
    if (x>0) {
        return arctan(y/x);
    } else if (x<0) {
        if (y<0) {
            return arctan(y/x)-PI;
        } else {
            return arctan(y/x)+PI;
        }
    } else if (y>0) {
        return PI/2;
    } else if (y<0) {
        return -PI/2;
    } else {
        return 0;
    }
//    return 2*arctan((sqrt(power(x,2)+power(y,2))-x)/y)
}
