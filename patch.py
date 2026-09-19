
import re

# 1. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

new_html = """        <div class="demo-video-wrapper" style="background: transparent; box-shadow: none; display: flex; justify-content: center; padding: 40px 0;">
          <div id="demoIphoneFrame" class="iphone-mockup">
            <div id="demoScenesContainer" class="demo-scenes-container">
              
              <div class="demo-scene" id="scene1Lib">
                <div class="demo-header">Library</div>
                <div class="demo-list">
                  <div class="demo-list-item" id="demoBook1">
                    <div class="demo-book-info">
                      <div class="demo-book-title">The Art of War</div>
                      <div class="demo-book-prog">68%</div>
                    </div>
                    <div class="demo-delete-btn">Delete</div>
                  </div>
                </div>
                <div class="demo-bottom-sheet" id="demoResumeSheet">
                  <div class="sheet-btn">Resume from 68%</div>
                  <div class="sheet-btn">Reset to Beginning</div>
                </div>
                <div class="demo-cursor" id="demoCursor1"></div>
                <div class="demo-callout" id="callout1">Fluid Gestures.</div>
              </div>

              <div class="demo-scene" id="scene2Themes">
                <div class="demo-header">Appearance</div>
                <div class="demo-theme-options">
                  <div class="theme-opt" id="optObsidian">Obsidian</div>
                  <div class="theme-opt" id="optVellum">Warm Vellum</div>
                  <div class="theme-opt" id="optGraphite">Graphite</div>
                </div>
                <div class="demo-text-preview" id="themePreviewText">Watch the contrast adjust perfectly.</div>
                <div class="demo-cursor" id="demoCursor2"></div>
                <div class="demo-callout" id="callout2">Pixel-Perfect Themes.</div>
              </div>

              <div class="demo-scene" id="scene3Reader">
                <div id="demoCountdown" class="demo-countdown-ring">
                  <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45"></circle><circle id="dRingProg" class="d-ring-prog" cx="50" cy="50" r="45"></circle></svg>
                  <span id="demoCountText">3</span>
                </div>
                <div class="rsvp-display glow-text" id="demoRsvpDisplay2" style="font-size: 24px; display: grid;">
                  <span class="word-start" id="dWordStart"></span><span class="focal-point" id="dFocalPoint">Ready</span><span class="word-end" id="dWordEnd"></span>
                </div>
                <div id="demoPauseGlyph" class="demo-pause-glyph">||</div>
                <div class="demo-cursor" id="demoCursor3"></div>
                <div class="demo-callout" id="callout3">Intelligent Context Retention.</div>
              </div>

              <div class="demo-scene" id="scene4Scratch">
                <div id="demoQuote" class="demo-placeholder-quote">"Read at the speed of thought."</div>
                <div id="demoPastedText" class="demo-pasted-text">Information processing is no longer limited by eye movement.</div>
                <div class="demo-cursor" id="demoCursor4"></div>
                <div class="demo-callout" id="callout4">Frictionless Capture.</div>
              </div>

              <div class="demo-scene" id="scene5Outro">
                <div class="demo-outro-logo glow-text">TACHYON</div>
                <div class="demo-outro-tagline">Read at the speed of thought.</div>
                <div class="demo-outro-badge">App Store</div>
              </div>

              <div id="demoOverlay" class="play-demo-overlay">
                <div class="play-btn-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--text-primary)" style="margin-left: 4px;">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div style="font-size: 14px; font-weight: 700; color: white; letter-spacing: 2px;">PLAY DEMO</div>
              </div>
            </div>
          </div>
        </div>"""

html = re.sub(r'<div class="demo-video-wrapper">.*?(?=</div>\s*</div>\s*</div>\s*<!-- Modals -->)', new_html, html, flags=re.DOTALL)
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

