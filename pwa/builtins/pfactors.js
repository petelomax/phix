"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// pfactors.e
//
//  implementation of factors(n), which returns a list of all integer factors of n,
//                and prime_factors(n), which returns a list of prime factors of n
//
// eg factors(6) is {2,3}
//    factors(6,1) is {1,2,3,6}
//    factors(6,-1) is {1,2,3}
//    factors(720,1) is {1,2,3,4,5,6,8,9,10,12,15,16,18,20,24,30,36,
//                       40,45,48,60,72,80,90,120,144,180,240,360,720}
//    factors(12345) is {3 5 15 823 2469 4115}
//
// whereas:
//    prime_factors(6) is {2,3}
//    prime_factors(720) is {2,3,5}
//    prime_factors(720,1) is {2,2,2,2,3,3,5}
//    prime_factors(12345) is {3,5,823}
//
function $check_limits(/*atom*/ n, /*string*/ rtn) {
    if (n<1 || (n!==floor(n))) {
        crash("argument to %s() must be a positive integer",["sequence",rtn]);
    } else if (compare(n,power(2,((equal(machine_bits(),32)) ? 53 : 64)))>0) {
        // n above power(2,53|64) is pointless, since IEE 754 floats drop 
        // low-order bits. As per the manual, on 32-bit atoms can store 
        // exact integers up to 9,007,199,254,740,992, however between
        // that and 18,014,398,509,481,984 you can only store even nos,
        // then upto 36,028,797,018,963,968, you can only store numbers 
        // divisible by 4, etc. Hence were you to ask for the prime
        // factors of 9,007,199,254,740,995 you might be surprised when
        // it does not list 5, since this gets 9,007,199,254,740,994.
        // (yes, the routine actually gets a number ending in 4 not 5)
        crash("argument to %s() exceeds maximum precision",["sequence",rtn]);
    }
}

/*global*/ function factors(/*atom*/ n, /*integer*/ include1=0) {
//
// returns a list of all integer factors of n
//  if include1 is 0 (the default), result does not contain either 1 or n
//  if include1 is 1 the result contains 1 and n
//  if include1 is -1 the result contains 1 but not n
//  
    if (n===0) { return ["sequence"]; }
    $check_limits(n,"factors");
    let /*sequence*/ lfactors = ["sequence"], hfactors = ["sequence"];
    let /*atom*/ hfactor;
    let /*integer*/ p = 2, 
                    lim = floor(sqrt(n));
    if (include1!==0) {
        lfactors = ["sequence",1];
        if ((n!==1) && (include1===1)) {
            hfactors = ["sequence",n];
        }
    }
    while (p<=lim) {
        if (equal(remainder(n,p),0)) {
            lfactors = append(lfactors,p);
            hfactor = n/p;
            if (hfactor===p) { break; }
            hfactors = prepend(hfactors,hfactor);
        }
        p += 1;
    }
    return $conCat(lfactors, hfactors);
}
//include primes.e

/*global*/ function prime_factors(/*atom*/ n, /*bool*/ duplicates=false, /*integer*/ maxprime=100) {
// returns a list of all prime factors <=get_prine(maxprime) of n
//  if duplicates is true returns a true decomposition of n (eg 8 --> {2,2,2})
    if (n===0) { return ["sequence"]; }
    $check_limits(n,"prime_factors");
    if (maxprime===-1) { maxprime = get_maxprime(n); }
    let /*sequence*/ pfactors = ["sequence"];
    let /*integer*/ pn = 1, 
                    p = get_prime(pn), 
                    lim = min(floor(sqrt(n)),get_prime(maxprime));
    while (p<=lim) {
        if (equal(remainder(n,p),0)) {
            pfactors = append(pfactors,p);
            while (1) {
                n = n/p;
                if (!equal(remainder(n,p),0)) { break; }
                if (duplicates) {
                    pfactors = append(pfactors,p);
                }
            }
            if (n<=p) { break; }
            lim = min(floor(sqrt(n)),get_prime(maxprime));
        }
        pn += 1;
        p = get_prime(pn);
    }
    if (n>1 && ((!equal(length(pfactors),0)) || duplicates)) {
        pfactors = append(pfactors,n);
//added 12/6/19:
    } else if (duplicates && (equal(pfactors,["sequence"]))) {
        if (n!==1) { crash("9/0"); } // sanity check
        pfactors = ["sequence",1];
    }
    return pfactors;
}

/*global*/ function square_free(/*atom*/ n, /*integer*/ maxprime=100) {
// returns true if prime_factors(n,duplicates:=true,maxprime) would contain no duplicates
//  (but terminating early and without building any unnecessary internal lists)
    if (n===0) { return true; }
    $check_limits(n,"square_free");
    if (maxprime===-1) { maxprime = get_maxprime(n); }
    let /*integer*/ pn = 1, 
                    p = get_prime(pn), 
                    lim = min(floor(sqrt(n)),get_prime(maxprime));
    while (p<=lim) {
        if (equal(remainder(n,p),0)) {
            n = n/p;
            if (equal(remainder(n,p),0)) { return false; }
            if (n<=p) { break; }
            lim = min(floor(sqrt(n)),get_prime(maxprime));
        }
        pn += 1;
        p = get_prime(pn);
    }
    return true;
}

/*global*/ function is_prime(/*atom*/ n) {
    if (n===0) { return false; }
    $check_limits(n,"is_prime");
    let /*integer*/ pn = 1, 
                    p = get_prime(pn), 
                    lim = floor(sqrt(n));
    while (p<=lim) {
        if (equal(remainder(n,p),0)) { return false; }
        pn += 1;
        p = get_prime(pn);
    }
    return n>1;
}
