
import re

with open("assets/js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

new_js = """  // Demo Video Logic
  const demoOverlay = document.getElementById("demoOverlay");
  const iphoneFrame = document.getElementById("demoIphoneFrame");
  
  if (demoOverlay && iphoneFrame) {
    const scenes = {
      lib: document.getElementById("scene1Lib"),
      themes: document.getElementById("scene2Themes"),
      reader: document.getElementById("scene3Reader"),
      scratch: document.getElementById("scene4Scratch"),
      outro: document.getElementById("scene5Outro")
    };

    const callouts = {
      c1: document.getElementById("callout1"),
      c2: document.getElementById("callout2"),
      c3: document.getElementById("callout3"),
      c4: document.getElementById("callout4")
    };

    let isPlayingDemo = false;

    async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function moveCursor(id, top, left, doTap) {
      const c = document.getElementById(id);
      if(!c) return;
      c.style.top = top; c.style.left = left;
      if(doTap) {
        c.classList.add("tap");
        setTimeout(()=>c.classList.remove("tap"), 300);
      }
    }

    async function runDemoSequence() {
      if(isPlayingDemo) return;
      isPlayingDemo = true;
      demoOverlay.style.opacity = "0";
      await wait(500);
      demoOverlay.style.display = "none";

      // Reset all
      Object.values(scenes).forEach(s => s && s.classList.remove("active"));
      Object.values(callouts).forEach(c => c && c.classList.remove("show"));
      iphoneFrame.className = "iphone-mockup zoomed";
      
      // Scene 1
      scenes.lib.classList.add("active");
      callouts.c1.classList.add("show");
      await wait(1000);
      moveCursor("demoCursor1", "120px", "200px", true);
      await wait(200);
      document.getElementById("demoBook1").classList.add("swiped");
      await wait(1000);
      moveCursor("demoCursor1", "250px", "140px", true);
      await wait(200);
      document.getElementById("demoResumeSheet").classList.add("open");
      await wait(2000);
      scenes.lib.classList.remove("active");
      callouts.c1.classList.remove("show");
      await wait(400);

      // Scene 2
      scenes.themes.classList.add("active");
      callouts.c2.classList.add("show");
      await wait(800);
      moveCursor("demoCursor2", "110px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#000";
      document.getElementById("themePreviewText").style.color = "#fff";
      await wait(1000);
      moveCursor("demoCursor2", "160px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#F4EFE6";
      document.getElementById("themePreviewText").style.color = "#4A3F35";
      await wait(1000);
      moveCursor("demoCursor2", "210px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#1A1A1A";
      document.getElementById("themePreviewText").style.color = "#E0E0E0";
      await wait(1500);
      scenes.themes.classList.remove("active");
      callouts.c2.classList.remove("show");
      await wait(400);

      // Scene 3
      scenes.reader.classList.add("active");
      callouts.c3.classList.add("show");
      document.getElementById("demoCountdown").style.display = "flex";
      document.getElementById("demoRsvpDisplay2").style.display = "none";
      const cText = document.getElementById("demoCountText");
      const cRing = document.getElementById("dRingProg");
      cText.textContent = "3"; cRing.style.strokeDashoffset = "0";
      await wait(500);
      cRing.style.strokeDashoffset = "283";
      await wait(1000);
      cText.textContent = "2"; cRing.style.strokeDashoffset = "0";
      await wait(50); cRing.style.strokeDashoffset = "283";
      await wait(1000);
      cText.textContent = "1"; cRing.style.strokeDashoffset = "0";
      await wait(50); cRing.style.strokeDashoffset = "283";
      await wait(1000);
      
      document.getElementById("demoCountdown").style.display = "none";
      document.getElementById("demoRsvpDisplay2").style.display = "grid";
      
      const words = ["We", "are", "ramping", "up", "the", "speed", "now.", "Focus", "on", "the", "center."];
      for(let w of words) {
         document.getElementById("dFocalPoint").textContent = w;
         await wait(200);
      }
      moveCursor("demoCursor3", "300px", "140px", true);
      await wait(100);
      document.getElementById("demoPauseGlyph").classList.add("show");
      await wait(400);
      document.getElementById("dFocalPoint").textContent = "speed";
      await wait(1500);
      scenes.reader.classList.remove("active");
      callouts.c3.classList.remove("show");
      await wait(400);

      // Scene 4
      scenes.scratch.classList.add("active");
      callouts.c4.classList.add("show");
      document.getElementById("demoQuote").classList.add("rotating");
      await wait(1500);
      moveCursor("demoCursor4", "200px", "140px", true);
      await wait(200);
      document.getElementById("demoQuote").classList.add("hidden");
      document.getElementById("demoPastedText").classList.add("show");
      await wait(2000);
      scenes.scratch.classList.remove("active");
      callouts.c4.classList.remove("show");
      await wait(400);

      // Scene 5
      scenes.outro.classList.add("active");
      iphoneFrame.className = "iphone-mockup zoomed-out";
      await wait(800);
      document.querySelector(".demo-outro-logo").classList.add("show");
      document.querySelector(".demo-outro-tagline").classList.add("show");
      document.querySelector(".demo-outro-badge").classList.add("show");
      
      await wait(4000);
      
      demoOverlay.style.display = "flex";
      setTimeout(() => demoOverlay.style.opacity = "1", 50);
      isPlayingDemo = false;
      iphoneFrame.className = "iphone-mockup";
      document.getElementById("demoScenesContainer").style.background = "var(--bg-color)";
      document.getElementById("demoBook1").classList.remove("swiped");
      document.getElementById("demoResumeSheet").classList.remove("open");
      document.getElementById("demoQuote").className = "demo-placeholder-quote";
      document.getElementById("demoQuote").classList.remove("rotating");
      document.getElementById("demoQuote").classList.remove("hidden");
      document.getElementById("demoPastedText").className = "demo-pasted-text";
      document.querySelector(".demo-outro-logo").classList.remove("show");
      document.querySelector(".demo-outro-tagline").classList.remove("show");
      document.querySelector(".demo-outro-badge").classList.remove("show");
      document.getElementById("demoPauseGlyph").classList.remove("show");
    }

    demoOverlay.addEventListener("click", () => {
      if(!isPlayingDemo) runDemoSequence();
    });
  }
"""

js = re.sub(r"  // Demo Video Logic.*?(?=  // PWA SW)", new_js, js, flags=re.DOTALL)

with open("assets/js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

