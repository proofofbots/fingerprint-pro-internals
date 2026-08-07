function fn1(port, ...arg1) {
  port.postMessage(arg1);
}
function fn2(arg2, arg3, arg4) {
  if (arg4 instanceof Error) {
    fn1(arg2, arg3, arg4.name, arg4.message, arg4.stack);
  } else {
    fn1(arg2, arg3, null, String(arg4));
  }
}
const v1 = function ({ port: arg5 = self, workerModules: arg6 = [] } = {}) {
  !(function (arg7, arg8) {
    let v2;
    if (!(v3 = self).window) {
      v3.window = self;
    }
    if (!self.requestIdleCallback) {
      self.requestIdleCallback = (arg9, { timeout: arg10 } = {}) =>
        setTimeout(arg9, arg10 != null ? arg10 : 1e3);
    }
    if (!self.document) {
      self.document = {
        hidden: false,
        addEventListener: (arg11, arg12, arg13) => self.addEventListener(arg11, arg12, arg13),
        removeEventListener: (arg14, arg15, arg16) => self.removeEventListener(arg14, arg15, arg16),
      };
    }
    var v3;
    let v4 = false;
    arg7.addEventListener("message", async ({ data: arg17 }) => {
      if (arg17 instanceof Array) {
        switch (arg17[0]) {
          case 0:
            fn1(arg7, 1);
            break;
          case 3:
            try {
              if (v2) {
                throw new Error("Worker is already running.");
              }
              const v5 = arg17[1],
                v6 = arg8(),
                v7 = {};
              for (const v10 of v6) {
                if (v10.sources) {
                  Object.assign(v7, v10.sources.stage1, v10.sources.stage2, v10.sources.stage3);
                }
              }
              const v8 = Object.keys(v7),
                v9 = Promise.all(
                  v8.map(async (arg18) => {
                    const v11 = await (async function (arg19, arg20) {
                      const v12 = Date.now();
                      try {
                        const v13 = await arg19(arg20),
                          v14 = Date.now() - v12;
                        if (typeof v13 != "function") {
                          return () => ({
                            value: v13,
                            duration: v14,
                          });
                        }
                        const v15 = v13;
                        return async () => {
                          const v16 = Date.now();
                          try {
                            return {
                              value: await v15(),
                              duration: v14 + (Date.now() - v16),
                            };
                          } catch (v17) {
                            return {
                              error: String(v17),
                              duration: v14 + (Date.now() - v16),
                            };
                          }
                        };
                      } catch (v18) {
                        const v19 = Date.now() - v12;
                        return () => ({
                          error: String(v18),
                          duration: v19,
                        });
                      }
                    })(v7[arg18], v5);
                    return [arg18, v11];
                  }),
                );
              v2 = async () => {
                const v20 = await v9,
                  v21 = {};
                await Promise.all(
                  v20.map(async ([arg21, arg22]) => {
                    v21[arg21] = await arg22();
                  }),
                );
                return v21;
              };
              fn1(arg7, 4);
            } catch (v22) {
              fn2(arg7, 5, v22);
            }
            break;
          case 6:
            try {
              if (!v2) {
                throw new Error("Worker signal collection was not started.");
              }
              fn1(arg7, 7, await v2());
              v4 = true;
            } catch (v23) {
              fn2(arg7, 8, v23);
            }
            break;
          case 9:
            if (v4) {
              fn1(arg7, 10);
            }
        }
      }
    });
    fn1(arg7, 2);
  })(arg5, () => [
    {
      sources: {
        stage1: {},
        stage2: {},
        stage3: {},
      },
    },
    ...arg6.map((arg23) => arg23()),
  ]);
};
v1();
