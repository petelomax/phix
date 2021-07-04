"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// factorial.e (an autoinclude)
//
let /*integer*/ $finit = 0;
let /*sequence*/ $fcache;

/*global*/ function factorial(/*integer*/ n) {
//
// Standard iterative factorial function, with memoisation.
// eg         n : 0 1 2 3 4  5   6   7    8
//  factorial(n): 1 1 2 6 24 120 720 5040 40320 
// see also mpz_fac_ui()
//
    let /*atom*/ res = 1;
    if (n>0) {
        if (!$finit) {
            $fcache = ["sequence",1];
            $finit = 1;
        }
        for (let i=length($fcache)+1, i$lim=n; i<=i$lim; i+=1) {
            $fcache = $conCat($fcache, $subse($fcache,-1)*i);
        }
        res = $subse($fcache,n);
    }
    return res;
}

/*global*/ function k_perm(/*integer*/ n, k) {
//
// Standard partial permutations calculation (sequences without repetition)
//
    let /*atom*/ res = n;
    for (let i=n-1, i$lim=(n-k)+1; i>=i$lim; i-=1) {
        res *= i;
    }
    return res;
}

/*global*/ function choose(/*integer*/ n, k) {
//
// Standard combinations calculation - choose k from n aka "n choose k"
// see also mpz_binom() [probably wiser to use mpz over atom anyway]
//
    let /*atom*/ res = 1;
    for (let i=1, i$lim=k; i<=i$lim; i+=1) {
        res = (res*((n-i)+1))/i;
    }
    return res;
}
//  atom res = k_perm(n,k)/factorial(k)
 /* alt:
    mpz r = mpz_init(1)
    for i=1 to k do
--      r := (r * (n-i+1)) / i, but using mpz routines:
        mpz_mul_si(r, r, n-i+1)
        if mpz_fdiv_q_ui(r, r, i)!=0 then ?9/0 end if
    end for
    return mpz_get_str(r)
--or (more likely to overflow)
--function binom(integer n, k)
--  return factorial(n)/(factorial(k)*factorial(n-k))
--end function
*/ 
