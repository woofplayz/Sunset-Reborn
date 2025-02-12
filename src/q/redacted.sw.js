(() => {
    "use strict";
    const e = self.Ultraviolet,
      t = [
        "cross-origin-embedder-policy",
        "cross-origin-opener-policy",
        "cross-origin-resource-policy",
        "content-security-policy",
        "content-security-policy-report-only",
        "expect-ct",
        "feature-policy",
        "origin-isolation",
        "strict-transport-security",
        "upgrade-insecure-requests",
        "x-content-type-options",
        "x-download-options",
        "x-frame-options",
        "x-permitted-cross-domain-policies",
        "x-powered-by",
        "x-xss-protection",
      ],
      r = ["GET", "HEAD"];
    class i extends e.EventEmitter {
      constructor(t = __uv$config) {
        super(),
          t.bare || (t.bare = "/bare/"),
          t.prefix || (t.prefix = "/service/"),
          (this.config = t);
        const r = (Array.isArray(t.bare) ? t.bare : [t.bare]).map((e) =>
          new URL(e, location).toString(),
        );
        (this.address = r[~~(Math.random() * r.length)]),
          (this.bareClient = new e.BareClient(this.address));
      }
      async fetch({ request: i }) {
        let a;
        try {
          if (!i.url.startsWith(location.origin + this.config.prefix))
            return await fetch(i);
          const c = new e(this.config, this.address);
          "function" == typeof this.config.construct &&
            this.config.construct(c, "service");
          const l = await c.cookie.db();
          (c.meta.origin = location.origin),
            (c.meta.base = c.meta.url = new URL(c.sourceUrl(i.url)));
          const d = new o(
            i,
            this,
            c,
            r.includes(i.method.toUpperCase()) ? null : await i.blob(),
          );
          if (
            ("blob:" === c.meta.url.protocol &&
              ((d.blob = !0), (d.base = d.url = new URL(d.url.pathname))),
            i.referrer && i.referrer.startsWith(location.origin))
          ) {
            const e = new URL(c.sourceUrl(i.referrer));
            (d.headers.origin ||
              (c.meta.url.origin !== e.origin && "cors" === i.mode)) &&
              (d.headers.origin = e.origin),
              (d.headers.referer = e.href);
          }
          const h = (await c.cookie.getCookies(l)) || [],
            u = c.cookie.serialize(h, c.meta, !1);
          (d.headers["user-agent"] = navigator.userAgent),
            u && (d.headers.cookie = u);
          const p = new n(d, null, null);
          if ((this.emit("request", p), p.intercepted)) return p.returnValue;
          a = d.blob ? "blob:" + location.origin + d.url.pathname : d.url;
          const m = await this.bareClient.fetch(a, {
              headers: d.headers,
              method: d.method,
              body: d.body,
              credentials: d.credentials,
              mode: location.origin !== d.address.origin ? "cors" : d.mode,
              cache: d.cache,
              redirect: d.redirect,
            }),
            f = new s(d, m),
            b = new n(f, null, null);
          if ((this.emit("beforemod", b), b.intercepted)) return b.returnValue;
          for (const e of t) f.headers[e] && delete f.headers[e];
          if (
            (f.headers.location &&
              (f.headers.location = c.rewriteUrl(f.headers.location)),
            "document" === i.destination)
          ) {
            const e = f.headers["content-disposition"];
            if (!/\s*?((inline|attachment);\s*?)filename=/i.test(e)) {
              const t = /^\s*?attachment/i.test(e) ? "attachment" : "inline",
                [r] = new URL(m.finalURL).pathname.split("/").slice(-1);
              f.headers["content-disposition"] =
                `${t}; filename=${JSON.stringify(r)}`;
            }
          }
          if (
            (f.headers["set-cookie"] &&
              (Promise.resolve(
                c.cookie.setCookies(f.headers["set-cookie"], l, c.meta),
              ).then(() => {
                self.clients.matchAll().then(function (e) {
                  e.forEach(function (e) {
                    e.postMessage({ msg: "updateCookies", url: c.meta.url.href });
                  });
                });
              }),
              delete f.headers["set-cookie"]),
            f.body)
          )
            switch (i.destination) {
              case "script":
              case "worker":
                {
                  const e = [
                    c.bundleScript,
                    c.clientScript,
                    c.configScript,
                    c.handlerScript,
                  ]
                    .map((e) => JSON.stringify(e))
                    .join(",");
                  (f.body = `if (!self.__uv && self.importScripts) { ${c.createJsInject(this.address, this.bareClient.manfiest, c.cookie.serialize(h, c.meta, !0), i.referrer)} importScripts(${e}); }\n`),
                    (f.body += c.js.rewrite(await m.text()));
                }
                break;
              case "style":
                f.body = c.rewriteCSS(await m.text());
                break;
              case "iframe":
              case "document":
                (function (t, r = "") {
                  return (
                    "text/html" ===
                    (e.mime.contentType(r || t.pathname) || "text/html").split(
                      ";",
                    )[0]
                  );
                })(c.meta.url, f.headers["content-type"] || "") &&
                  (f.body = c.rewriteHtml(await m.text(), {
                    document: !0,
                    injectHead: c.createHtmlInject(
                      c.handlerScript,
                      c.bundleScript,
                      c.clientScript,
                      c.configScript,
                      this.address,
                      this.bareClient.manfiest,
                      c.cookie.serialize(h, c.meta, !0),
                      i.referrer,
                    ),
                  }));
            }
          return (
            "text/event-stream" === d.headers.accept &&
              (f.headers["content-type"] = "text/event-stream"),
            crossOriginIsolated &&
              (f.headers["Cross-Origin-Embedder-Policy"] = "require-corp"),
            this.emit("response", b),
            b.intercepted
              ? b.returnValue
              : new Response(f.body, {
                  headers: f.headers,
                  status: f.status,
                  statusText: f.statusText,
                })
          );
        } catch (e) {
          return ["document", "iframe"].includes(i.destination)
            ? (console.error(e),
              (function (e, t, r) {
                let i,
                  s,
                  o,
                  n,
                  a = "";
                !(function (e) {
                  return e instanceof Error && "object" == typeof e.body;
                })(e)
                  ? ((i = 500),
                    (s = "Error processing your request"),
                    (n = "Internal Server Error"),
                    (o = e instanceof Error ? e.name : "UNKNOWN"))
                  : ((i = e.status),
                    (s = "Error communicating with the Bare server"),
                    (n = e.body.message),
                    (o = e.body.code),
                    (a = e.body.id));
                return new Response(
                  (function (e, t, r, i, s, o, n) {
                    if ("The specified host could not be resolved." === i)
                      return (function (e, t) {
                        const r = new URL(e),
                          i = `remoteHostname.textContent = ${JSON.stringify(r.hostname)};bareServer.href = ${JSON.stringify(t)};uvHostname.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify("2.0.0")};`;
                        return `<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1>This site can’t be reached</h1><hr /><p><b id="remoteHostname"></b>’s server IP address could not be found.</p><p>Try:</p><ul><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="uvHostname"></b>'s administrator</li><li>Verifying the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</li></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript," + encodeURIComponent(i)}"><\/script></body></html>`;
                      })(o, n);
                    const a =
                      `errorTitle.textContent = ${JSON.stringify(e)};errorCode.textContent = ${JSON.stringify(t)};` +
                      (r ? `errorId.textContent = ${JSON.stringify(r)};` : "") +
                      `errorMessage.textContent =  ${JSON.stringify(i)};` +
                      `errorTrace.value = ${JSON.stringify(s)};` +
                      `fetchedURL.textContent = ${JSON.stringify(o)};` +
                      `bareServer.href = ${JSON.stringify(n)};` +
                      `for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());` +
                      `uvVersion.textContent = ${JSON.stringify("2.0.0")};`;
                    return (
                      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Internal Server Error</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, "Helvetica Neue", Arial, sans-serif;
        transition: 0.3s ease;
      }

      /* DARK */
      :root {
        --background-color: #121212;
        --seperator-color: #1e1e1e;
        --light-hover-bg: #222222;
        --selected-color: #2f2e2e;
        --newtab-text-color: #5f6368;
        --light-color: #e5e5e5;
        --light-bg: #1b1b1b;
        --svg-shade: #a5a5a5;
        --background-img: url("wallpapersden.com_black-4k-windows-11-original_5120x2880.jpg");
      }

      /* LIGHT */
      .light {
        --background-color: #f0f0f0;
        --seperator-color: #dcdcdc;
        --light-hover-bg: #e0e0e0;
        --selected-color: #c1c1c1;
        --newtab-text-color: #3c4043;
        --light-color: #333333;
        --light-bg: #ffffff;
        --svg-shade: #7f7f7f;
        --background-img: url("4k-Windows-11-White-Abstract-Background-4K-Wallpaper.jpg");
      }

      /* CRIMSON */
      .crimson {
        --background-color: #2c0a0a;
        --seperator-color: #450d0d;
        --light-hover-bg: #6a1414;
        --selected-color: #8b1c1c;
        --newtab-text-color: #e15c5c;
        --light-color: #f2a5a5;
        --light-bg: #511313;
        --svg-shade: #d26161;
        --background-img: url("4k-Windows-11-Abstract-Red-Bloom-4K-Wallpaper.jpg");
      }

      /* DARK ORANGE */
      .darkOrange {
        --background-color: #2e1a08;
        --seperator-color: #5c2c11;
        --light-hover-bg: #8c3c1f;
        --selected-color: #b65c32;
        --newtab-text-color: #ff914d;
        --light-color: #ffcc99;
        --light-bg: #7c3e18;
        --svg-shade: #ff6f3d;
        --background-img: url("4k-Windows-11-Abstract-Orange-Bloom-4K-Wallpaper.jpg");
      }

      /* DARK YELLOW */
      .darkYellow {
        --background-color: #3c2c00;
        --seperator-color: #6e4e16;
        --light-hover-bg: #b78c2e;
        --selected-color: #d0a02e;
        --newtab-text-color: #f2e15c;
        --light-color: #fef7a1;
        --light-bg: #7f6b2e;
        --svg-shade: #e1c340;
        --background-img: url("wallpapersden.com_minimal-artistic-desert-sunset_5760x3240.jpg");
      }

      /* GREEN */
      .green {
        --background-color: #3e4b3e;
        --seperator-color: #5a6d5a;
        --light-hover-bg: #5f775f;
        --selected-color: #4e6e4e;
        --newtab-text-color: #d6d6d6;
        --light-color: #ffffff;
        --light-bg: #4b5b4b;
        --svg-shade: #8f9e8f;
        --background-img: url("green_windows_11_logo_in_green_background_4k_hd_windows_11.jpg");
      }

      /* BLUE */
      .blue {
        --background-color: #0a1f3b;
        --seperator-color: #1f3e6d;
        --light-hover-bg: #2e5797;
        --selected-color: #4a7eb6;
        --newtab-text-color: #7aa9d6;
        --light-color: #a7c4e6;
        --light-bg: #234d7f;
        --svg-shade: #6c98c7;
        --background-img: url("4k-Windows-11-Abstract-Blue-Background-4K-Desktop-Wallpaper.jpg");
      }

      /* PURPLE */
      .purple {
        --background-color: #2c1a57;
        --seperator-color: #3f2b6f;
        --light-hover-bg: #4c3a7f;
        --selected-color: #5c2f8b;
        --newtab-text-color: #f1c6f0;
        --light-color: #f7f1f9;
        --light-bg: #452673;
        --svg-shade: #8d6ba8;
        --background-img: url("4k-Windows-11-365-Abstract-Purple-Background-Digital-Art-4K-Wallpaper.jpg");
      }

      body {
        background-color: var(--background-color);
        color: var(--light-color);
        margin: 0;
        padding: 20px;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: var(--light-bg);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 2rem;
        color: var(--svg-shade);
      }

      h2 {
        font-size: 1.5rem;
        color: var(--newtab-text-color);
      }

      p {
        font-size: 1rem;
        line-height: 1.5;
      }

      .code {
        background-color: var(--background-color);
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        color: var(--svg-shade);
      }

      .try-list,
      .admin-list {
        margin-left: 20px;
      }

      button {
        padding: 10px 20px;
        font-size: 1rem;
        color: var(--light-color);
        background-color: var(--selected-color);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
      }

      button:hover {
        background-color: var(--light-hover-bg);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Error processing your request</h1>
      <h2>Failed to load <b id="fetchedURL"></b></h2>
      <p><strong>Internal Server Error</strong></p>
      <div class="code">
        <p id="errorMessage"></p>
      </div>
      <h2>Try:</h2>
      <ul class="try-list">
        <li>Checking your internet connection</li>
        <li>Verifying you entered the correct address</li>
        <li>Clearing the site data</li>
        <li>Contacting localhost's administrator</li>
        <li>Verify the Bare server isn't censored</li>
      </ul>
      <h2>If you're the administrator of ${location.host} try:</h2>
      <ul class="admin-list">
        <li>Restarting your Bare server</li>
        <li>Updating Ultraviolet</li>
        <li>Troubleshooting the error on the GitHub repository</li>
        <l1>insuring lightgo.app/bare/ hasnt run out of bandwith</li>
      </ul>
      <button onclick="window.location.reload()">Reload</button>
      <p>Ultraviolet v2.0.0</p>
    </div>
    <script>
      window.addEventListener("message", function (event) {
        const theme = event.data.theme;
        console.log("themeememeemm");

        if (theme) {
          applyTheme(theme);
        }
      });

      function applyTheme(theme) {
        localStorage.setItem("selectedTheme", theme);

        const body = document.body;

        switch (theme) {
          case "dark":
            body.setAttribute("class", "dark");
            break;
          case "light":
            body.setAttribute("class", "light");
            break;
          case "crimson":
            body.setAttribute("class", "crimson");
            break;
          case "orange":
            body.setAttribute("class", "darkOrange");
            break;
          case "yellow":
            body.setAttribute("class", "darkYellow");
            break;
          case "green":
            body.setAttribute("class", "green");
            break;
          case "blue":
            body.setAttribute("class", "blue");
            break;
          case "purple":
            body.setAttribute("class", "purple");
            break;
          default:
            console.warn("whoever made this ");
            break;
        }
      }

      document.addEventListener("DOMContentLoaded", (event) => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          applyTheme(savedTheme);
        }
      });
    </script>
  </body>
</html>
`
                    );
                  })(s, o, a, n, String(e), t, r),
                  { status: i, headers: { "content-type": "text/html" } },
                );
              })(e, a, this.address))
            : new Response(void 0, { status: 500 });
        }
      }
      static Ultraviolet = e;
    }
    self.UVServiceWorker = i;
    class s {
      constructor(e, t) {
        (this.request = e),
          (this.raw = t),
          (this.ultraviolet = e.ultraviolet),
          (this.headers = {});
        for (const e in t.rawHeaders)
          this.headers[e.toLowerCase()] = t.rawHeaders[e];
        (this.status = t.status),
          (this.statusText = t.statusText),
          (this.body = t.body);
      }
      get url() {
        return this.request.url;
      }
      get base() {
        return this.request.base;
      }
      set base(e) {
        this.request.base = e;
      }
    }
    class o {
      constructor(e, t, r, i = null) {
        (this.ultraviolet = r),
          (this.request = e),
          (this.headers = Object.fromEntries(e.headers.entries())),
          (this.method = e.method),
          (this.address = t.address),
          (this.body = i || null),
          (this.cache = e.cache),
          (this.redirect = e.redirect),
          (this.credentials = "omit"),
          (this.mode = "cors" === e.mode ? e.mode : "same-origin"),
          (this.blob = !1);
      }
      get url() {
        return this.ultraviolet.meta.url;
      }
      set url(e) {
        this.ultraviolet.meta.url = e;
      }
      get base() {
        return this.ultraviolet.meta.base;
      }
      set base(e) {
        this.ultraviolet.meta.base = e;
      }
    }
    class n {
      #e;
      #t;
      constructor(e = {}, t = null, r = null) {
        (this.#e = !1),
          (this.#t = null),
          (this.data = e),
          (this.target = t),
          (this.that = r);
      }
      get intercepted() {
        return this.#e;
      }
      get returnValue() {
        return this.#t;
      }
      respondWith(e) {
        (this.#t = e), (this.#e = !0);
      }
    }
  })();
  //# sourceMappingURL=uv.sw.js.map
  