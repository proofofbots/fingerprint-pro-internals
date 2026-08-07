// s106 — sig_s106_notification
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.Notification window.Notification.permission navigator.permissions navigator
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: window.Notification is undefined / navigator.permissions is undefined
//   -2: navigator.permissions.query is not a function
//   -3: notificationPermissions signal unexpected behaviour
// reported value
//   null value
// probes
//   "denied" "function" "navigator.permissions is undefined" "notifications" "number" "prompt"
//   "window.Notification is undefined"
// compares against
//   != "function" != "number" == "function" === "denied" === "prompt"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s106_notification: window.Notification === undefined
//   h_s106_notification: navigator.permissions === undefined
//   h_s106_notification: typeof permissions.query != "function"
//   h_s106_notification: window.Notification.permission === "denied" && v719.state === "prompt"
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5129
const h_s106_notification = async function () {
    if (window.Notification === undefined) {
      throw new botdError(-1, "window.Notification is undefined");
    }
    if (navigator.permissions === undefined) {
      throw new botdError(-1, "navigator.permissions is undefined");
    }
    const { permissions: permissions } = navigator;
    if (typeof permissions.query != "function") {
      throw new botdError(-2, "navigator.permissions.query is not a function");
    }
    try {
      const v719 = await permissions.query({ name: "notifications" });
      return window.Notification.permission === "denied" && v719.state === "prompt";
    } catch (v720) {
      throw new botdError(-3, "notificationPermissions signal unexpected behaviour");
    }
  };

// agent.clean.js:6085
const sig_s106_notification = fn123(h_s106_notification);
