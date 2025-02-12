//ok what the sigma guys
let jj = "/g.json";

document.addEventListener("DOMContentLoaded", async () => {
  const a = await fetch(jj)
    .then((response) => response.text())
    .then((text) => {
      return JSON.parse(text);
    });
  a.forEach((z) => {
    const ff = document.querySelector(".modal-links");
    const pp = document.createElement("div");
    const ll = document.createElement("div");
    const aaz = document.createElement("div");
    const l1k = document.createElement("div");
    const dsc = document.createElement("div");
    const bbg = document.createElement("button");
    const bbc = document.createElement("button");

    aaz.classList.add("app-item");
    dsc.classList.add("app-description");
    ll.classList.add("app-content");
    pp.classList.add("app-details");
    l1k.classList.add("app-title");
    bbg.classList.add("more-button");
    bbc.classList.add("play-button");
    //adding urls to the modal
    aaz.setAttribute(
      "onclick",
      `openDynamicModal('${z.name}', '${z.description}', '${z.url}')`,
    );
    const kk = document.createElement("img");

    l1k.innerText = z.name;
    kk.src = z.img;
    kk.alt = "App";
    bbg.textContent = "More";
    bbc.textContent = "Play Now";
    kk.classList.add("app-image");
    dsc.innerText = z.description;

    pp.appendChild(l1k);
    dsc.appendChild(bbg);
    pp.appendChild(dsc);
    ll.appendChild(kk);
    ll.appendChild(pp);
    aaz.appendChild(ll);
    aaz.appendChild(bbc);
    ff.appendChild(aaz);
  });
  console.log("[Redacted.Service] Loaded!");
});

/*            <div class="app-content">
              <img src="/imgs/Instagram.png" alt="App 1" class="app-image" />
              <div class="app-details">
                <div class="app-title">Instagram</div>
                <div class="app-description">
                  Instagram is a free social media platform that allows users to
                  share photos, videos, and stories with friends, family, and
                  followers worldwide. With powerful editing tools, filters, and
                  creative features, Instagram makes it easy to capture and
                  enhance moments.
                  <button class="more-button">More</button>
                </div>
              </div>
            </div>
            <button class="play-button">Play Now</button>
          </div>
        </div>
      </div>*/
