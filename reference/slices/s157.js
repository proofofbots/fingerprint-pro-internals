// s157 — sig_s157
// module cm, stage3, codes 0
//
// measures
//   window.document window
// engine
//   Object.setPrototypeOf() Object.getOwnPropertyNames() JSON.stringify() Error undefined
// reported value
//   null value
// probes
//   "$cdc_asdjflasutopfhvcZLmcf" "$cdc_asdjflasutopfhvcZLmcfl_" "$chrome_asyncScriptInfo" "CefSharp"
//   "ChromeDriverw" "RunPerfTest" "_Selenium_IDE_Recorder" "_WEBDRIVER_ELEM_CACHE"
//   "__$webdriverAsyncExecutor" "__driver_evaluate" "__driver_unwrapped" "__fxdriver_evaluate"
//   "__fxdriver_unwrapped" "__lastWatirAlert" "__lastWatirConfirm" "__lastWatirPrompt" "__nightmare"
//   "__phantomas" "__selenium_evaluate" "__selenium_unwrapped" "__webdriverFunc"
//   "__webdriver_evaluate" "__webdriver_script_fn" "__webdriver_script_func"
//   "__webdriver_script_function" "__webdriver_unwrapped" "_phantom" "_selenium" "awesomium"
//   "callPhantom" "calledSelenium" "cef" "cefsharp" "coachjs" "domAutomation"
//   "domAutomationController" "electron" "emit" "find" "fmget_targets" "fminer" "geb"
//   "headless_chrome" "nightmare" "nightmarejs" "number" "phantomas" "phantomjs" "rhino" "selenium"
//   "selenium-evaluate" "sequentum" "slimerjs" "spawn" "string" "unknown" "wdioElectron" "webdriver"
//   "webdriverio"
// compares against
//   != "number" !== -1 == "function" == "string" in "find"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s157_fn3: v726 !== undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//   h_s157_fn5: typeof v965 == "string"
//   h_s157_fn5: h_s157_fn(arg830, v965)
//   h_s157_fn5: h_s157_fn6(arg830, arg832 => v965.test(arg832)) != null
//   h_s157_fn: arg479.indexOf(arg480) !== -1
//   h_s157_fn6: "find" in arg892
//   h_s157_fn6: arg893(arg892[v1010], v1010, arg892)
//
// 6 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:3864
function h_s157_fn(arg479, arg480) {
  return arg479.indexOf(arg480) !== -1;
}

// agent.clean.js:4823
const h_s157_fn2 = {
  Awesomium: "awesomium",
  Cef: "cef",
  CefSharp: "cefsharp",
  CoachJS: "coachjs",
  Electron: "electron",
  FMiner: "fminer",
  Geb: "geb",
  NightmareJS: "nightmarejs",
  Phantomas: "phantomas",
  PhantomJS: "phantomjs",
  Rhino: "rhino",
  Selenium: "selenium",
  Sequentum: "sequentum",
  SlimerJS: "slimerjs",
  WebDriverIO: "webdriverio",
  WebDriver: "webdriver",
  HeadlessChrome: "headless_chrome",
  Unknown: "unknown",
};

// agent.clean.js:5173
const h_s157_fn3 = function () {
    const v721 = {
      [h_s157_fn2.Awesomium]: { window: ["awesomium"] },
      [h_s157_fn2.Cef]: { window: ["RunPerfTest"] },
      [h_s157_fn2.CefSharp]: { window: ["CefSharp"] },
      [h_s157_fn2.CoachJS]: { window: ["emit"] },
      [h_s157_fn2.FMiner]: { window: ["fmget_targets"] },
      [h_s157_fn2.Geb]: { window: ["geb"] },
      [h_s157_fn2.NightmareJS]: { window: ["__nightmare", "nightmare"] },
      [h_s157_fn2.Phantomas]: { window: ["__phantomas"] },
      [h_s157_fn2.PhantomJS]: { window: ["callPhantom", "_phantom"] },
      [h_s157_fn2.Rhino]: { window: ["spawn"] },
      [h_s157_fn2.Selenium]: {
        window: [
          "_Selenium_IDE_Recorder",
          "_selenium",
          "calledSelenium",
          /^([a-z]){3}_.*_(Array|Promise|Symbol)$/,
        ],
        document: ["__selenium_evaluate", "selenium-evaluate", "__selenium_unwrapped"],
      },
      [h_s157_fn2.WebDriverIO]: { window: ["wdioElectron"] },
      [h_s157_fn2.WebDriver]: {
        window: [
          "webdriver",
          "__webdriverFunc",
          "__lastWatirAlert",
          "__lastWatirConfirm",
          "__lastWatirPrompt",
          "_WEBDRIVER_ELEM_CACHE",
          "ChromeDriverw",
        ],
        document: [
          "__webdriver_script_fn",
          "__driver_evaluate",
          "__webdriver_evaluate",
          "__fxdriver_evaluate",
          "__driver_unwrapped",
          "__webdriver_unwrapped",
          "__fxdriver_unwrapped",
          "__webdriver_script_fn",
          "__webdriver_script_func",
          "__webdriver_script_function",
          "$cdc_asdjflasutopfhvcZLmcf",
          "$cdc_asdjflasutopfhvcZLmcfl_",
          "$chrome_asyncScriptInfo",
          "__$webdriverAsyncExecutor",
        ],
      },
      [h_s157_fn2.HeadlessChrome]: { window: ["domAutomation", "domAutomationController"] },
    };
    let v722;
    const v723 = {},
      v724 = h_s157_fn4(window);
    let v725 = [];
    for (v722 in (window.document !== undefined && (v725 = h_s157_fn4(window.document)), v721)) {
      const v726 = v721[v722];
      if (v726 !== undefined) {
        const v727 = v726.window !== undefined && h_s157_fn5(v724, ...v726.window),
          v728 =
            !(v726.document === undefined || !v725.length) && h_s157_fn5(v725, ...v726.document);
        v723[v722] = v727 || v728;
      }
    }
    return v723;
  };

// agent.clean.js:6095
const sig_s157 = fn123(h_s157_fn3);

// agent.clean.js:6877
function h_s157_fn4(arg783) {
  return Object.getOwnPropertyNames(arg783);
}

// agent.clean.js:7311
function h_s157_fn5(arg830, ...arg831) {
  for (const v965 of arg831) {
    if (typeof v965 == "string") {
      if (h_s157_fn(arg830, v965)) {
        return true;
      }
    } else {
      if (h_s157_fn6(arg830, (arg832) => v965.test(arg832)) != null) {
        return true;
      }
    }
  }
  return false;
}

// agent.clean.js:7887
function h_s157_fn6(arg892, arg893) {
  if ("find" in arg892) {
    return arg892.find(arg893);
  }
  for (let v1010 = 0; v1010 < arg892.length; v1010++) {
    if (arg893(arg892[v1010], v1010, arg892)) {
      return arg892[v1010];
    }
  }
}
