"use strict";
// auto-generated by pwa/p2js - part of Phix, see http://phix.x10.mx
//
// builtins/unit_test.e
//
//  A simple unit testing framework for Phix (autoinclude).
//
//      test_equal(2+2,4,"2+2 is not 4 !!!!")
//      test_summary()
//
//  If all goes well, no output is shown, and the program carries on normally.
//  You can easily force [summary/verbose] output, crash/prompt on fail, etc. [See docs]

//  Note that I have used the same routine names as Euphoria, but the parameters are
//       all different [esp their order] and therefore they are not compatibile...
//       In particular you have to give every test a name in Euphoria, whereas here
//       such things are optional. Also, Euphoria works by putting tests in files
//       named "t_*" and running eutest, whereas here they are part of the app, and
//       will start failing on live systems (eg) if not properly installed.
//
// now in psym.e:
//global enum
//  TEST_QUIET          = 0,    -- (summary only when fail)
//  TEST_SUMMARY        = 1,    -- (summary only [/always])
//  TEST_SHOW_FAILED    = 2,    -- (summary + failed tests)
//  TEST_SHOW_ALL       = 3     -- (summary + all tests)
//  TEST_ABORT          = 1     -- (abort on failure, at summary)
// (TEST_QUIET          = 0)    -- (carry on despite failure)
//  TEST_CRASH          = -1    -- (crash on failure, immediately)
//  TEST_PAUSE          = 1     -- (always pause)
// (TEST_QUIET          = 0)    -- (never pause)
//  TEST_PAUSE_FAIL     = -1    -- (pause on failure)
//
let /*integer*/ $tests_run = 0, 
                $tests_passed = 0, 
                $tests_failed = 0, 
                $verbosity = TEST_QUIET, 
                $abort_on_fail = TEST_QUIET, 
                $pause_summary = TEST_PAUSE_FAIL, 
                $log_fn = 0;
// (aside: 0 rather than "" avoids need for a test_init(), when autoincluded:)
let /*object*/ $module = 0,  // (set to string by set_test_module)
               $prev_module = 0; // (    ""           $show_module)
function $test_log(/*string*/ fmt, /*sequence*/ args=["sequence"]) {
    let /*integer*/ fn = 2;
    for (let i=1, i$lim=2-($log_fn===0); i<=i$lim; i+=1) { // ({stderr} or {stderr,$log_fn})
        printf(fn,fmt,args);
        fn = $log_fn;
    }
}
function $show_module() {
    if (!equal($prev_module,$module)) {
        $test_log("%s:\n",["sequence",$module]);
        $prev_module = $module;
    }
}

/*global*/ function set_test_verbosity(/*integer*/ level) {
    $verbosity = level;
}

/*global*/ function get_test_verbosity() {
    return $verbosity;
}

/*global*/ function set_test_abort(/*integer*/ abort_test) {
// abort_test is TEST_ABORT(at summary)/TEST_QUIET/TEST_CRASH(immediately)
    $abort_on_fail = abort_test;
}

/*global*/ function get_test_abort() {
    return $abort_on_fail;
}

/*global*/ function set_test_pause(/*integer*/ pause) {
// pause is TEST_PAUSE/TEST_QUIET/TEST_PAUSE_FAIL (default)
    $pause_summary = pause;
}

/*global*/ function get_test_pause() {
    return $pause_summary;
}

/*global*/ function set_test_logfile(/*string*/ filename) {
// (closed by test_summary([true]))
    if ($log_fn!==0) { crash("9/0"); }
    $log_fn = open(filename,"w");
    if ($log_fn===-1) { crash("9/0"); }
}

/*global*/ function get_test_logfile() {
    return $log_fn;
}

/*global*/ function test_summary(/*bool*/ close_log=true) {
    if (($tests_run>0 && $verbosity>=TEST_SUMMARY) || $tests_failed>0) {
        $show_module();
        let /*string*/ passpc = sprintf("%.2f",($tests_passed/$tests_run)*100);
        if (equal($subss(passpc,-3,-1),".00")) { passpc = $subss(passpc,1,-4); }
        if (($tests_failed!==0) && (passpc==="100")) { passpc = "99.99"; }
                // (the above may be needed when $tests_run is > 10,000)
        $test_log("\n %d tests run, %d passed, %d failed, %s%% success\n",["sequence",$tests_run, $tests_passed, $tests_failed, passpc]);
        if (($pause_summary===TEST_PAUSE) || (($pause_summary===TEST_PAUSE_FAIL) && $tests_failed>0)) {
            puts(1,"Press any key to continue...");
            /*[] =*/ wait_key();
        }
    }
    if (close_log && $log_fn>0) {
        close($log_fn);
        $log_fn = 0;
    }
    if ($tests_failed>0 && ($abort_on_fail===TEST_ABORT)) {
        abort(1);
    }
    $tests_run = 0;
    $tests_passed = 0;
    $tests_failed = 0;
    $module = 0;
    $prev_module = 0;
}

/*global*/ function set_test_module(/*string*/ name) {
//
//  The $module name is simply a hint to the programmer about where to go to 
//  fix some problem just introduced/detected, eg after
//
//      set_test_module("logical")
//      ...
//      set_test_module("relational")
//      ...
//      set_test_module("regression")
//      ...
//      test_summary()
//
//  if you get (say)
//
//      relational:
//        test12 failed: 2 expected, got 4
//       20 tests run, 19 passed, 1 failed, 95% success
//
//  then you know to look for the "test12" test in the relational section.
//  test_summary() is automatically invoked by set_test_module(), and you
//  have to do it right at the end, or risk getting no output whatsoever.
//  Obviously you are free to use any appropriate section names, and if
//  you never invoke set_test_module() they are all lumped together.
//  Likewise it is perfectly fine if you cannot be bothered to name the
//  individual tests, just a bit more of a hunt should they trigger.
//
    if ($tests_run!==0) {
        test_summary(false);
    }
    $module = name;
}
//Instead of this there is now an Alias() in psym.e:
//global procedure set_test_section(string name)
//  set_test_module(name)
//end procedure
const $fmts = ["sequence","  failed: %s: %v should %sequal %v\n",
                         "  failed: %s\n"];
function $test_result(/*bool*/ success, /*sequence*/ args, /*integer*/ fdx, level) {
    $tests_run += 1;
    if (success) {
        if (($verbosity===TEST_SHOW_ALL) && (!equal($subse(args,1),""))) {
            $show_module();
            $test_log("  passed: %s\n",args);
        }
        $tests_passed += 1;
    } else {
        if ($verbosity>=TEST_SHOW_FAILED) {
            $show_module();
            $test_log($subse($fmts,fdx),args);
        }
        if ($abort_on_fail===TEST_CRASH) {
            crash("unit test failure (%s)",args,level);
        }
        $tests_failed += 1;
    }
}

/*global*/ function test_equal(/*object*/ a, /*object*/ b, /*string*/ name="", /*bool*/ eq=true) {
    let /*bool*/ success;
    if (equal(a,b)) {
        success = true;
    } else if (equal(sq_mul(0,a),sq_mul(0,b))) {
        // for complicated sequences values (same shape)
        if (atom(a)) {
            success = compare(abs(a-b),1e-9)<0;
        } else {
            success = or_all(sq_lt(flatten(sq_abs(sq_sub(a,b))),1e-9));
            // or maybe:
 /*
            success = true
            a = flatten(a)
            b = flatten(b)
            for i=1 to length(a) do
                atom ai = a[i],
                     bi = b[i]
                if ai!=bi
                and not(abs(ai-bi)<1e9) then
                    success = false
                    exit
                end if
            end for
*/ 
        }
    } else {
        success = false;
    }
    let /*string*/ ne = ((eq) ? "" : "not ");
    $test_result(success===eq,["sequence",name, a, ne, b],1,4-eq);
}

/*global*/ function test_not_equal(/*object*/ a, /*object*/ b, /*string*/ name="") {
    test_equal(a,b,name,false);
}

/*global*/ function test_true(/*bool*/ success, /*string*/ name="") {
    $test_result(success,["sequence",name],2,3);
}

/*global*/ function test_false(/*bool*/ success, /*string*/ name="") {
    $test_result(!success,["sequence",name],2,3);
}

/*global*/ function test_pass(/*string*/ name="") {
    $test_result(true,["sequence",name],2,3);
}

/*global*/ function test_fail(/*string*/ name="") {
    $test_result(false,["sequence",name],2,3);
}
