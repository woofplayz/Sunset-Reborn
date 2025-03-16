function fg() {
  try {
    const iframe = document.querySelector(".iframe-frame");
    if (!iframe) {
      console.log("[Redacted.error] Iframe not found");
      return;
    }

    const iframeUrl = iframe.contentWindow.location.href;
    const fsrc = __uv$config.decodeUrl(
      iframeUrl.replace(__uv$config.prefix, "")
    );

    let newurl = fsrc;
    if (fsrc.includes("https://www.google.com/search=q?")) {
      newurl = fsrc.replace("/search=q?", "/search?meow=");
    }

    if (newurl.includes("https://www.google.com/search?meow=")) {
      const starind = newurl.indexOf("?meow=");
      if (starind !== -1) {
        const qurind = newurl.slice(starind + 6);
        const decqur = __uv$config.decodeUrl(qurind);

        const newUrl =
          __uv$config.prefix +
          __uv$config.encodeUrl(`https://www.google.com/search?q=${decqur}`);

        iframe.src = newUrl;

        console.log("[Redacted.fix] Fixed Google!");
      }
    }
  } catch (error) {
    console.log("[Redacted.error] couldn't fix the goog @^@ : " + error);
  }
}
function kindkidisNOTacutie() {
  try {
    let cc = document.querySelector(".iframe-frame");
    if(!iframe) {
      console.log("[Redacted.error] Iframe Not Found")
      return;
    }

    let ccUrl = __uv$config.decodeUrl(iframe.contentWindow.location.href.replace(location.protocol + location.host + __uv$config.prefix, ""));

    if(ccUrl.includes("https://search.brave.com/q=")) {
      let substr = ccUrl.split("?")
      let decoded = __uv$config.decodeUrl(substr[1])

      cc.src = "https://search.brave.com/search?q=" + decoded;
      console.log("[Redacted.complete] Fixed Brave :3")
    }


  }catch (e) {
    console.log("[Redacted.error] couldnt fix brave TwT")
  }
}

function fbing() {
  try {
    const iframe = document.querySelector(".iframe-frame");
    if (!iframe) {
      console.log("[Redacted.error] Iframe not found");
      return;
    }

    const iframeUrl = iframe.contentWindow.location.href;
    const fsrc = __uv$config.decodeUrl(
      iframeUrl.replace(__uv$config.prefix, "")
    );

    let newurl = fsrc;
    if (fsrc.includes("https://www.bing.com/search=")) {
      newurl = fsrc.replace("/search=", "/meow=");
    }

    if (newurl.includes("https://www.bing.com/meow=")) {
      const starind = newurl.indexOf("meow=");
      if (starind !== -1) {
        const qurind = newurl.slice(starind + 5);
        const decqur = __uv$config.decodeUrl(qurind);

        const newUrl =
          __uv$config.prefix +
          __uv$config.encodeUrl(`https://www.bing.com/search?q=${decqur}`);

        iframe.src = newUrl;

        console.log("[Redacted.fix] Fixed bing 🤢");
      }
    }
  } catch (error) {
    console.log("[Redacted.error] couldn't fix bing OvO : " + error);
  }
}
// FUCK DUCK DUCK GO
// IM TWEAKING
// BING IS DEFAULT NOW FUCK YOU