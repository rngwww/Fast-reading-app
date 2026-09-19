
import re

with open("assets/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

new_css = """/* Apple-style Demo Video Animations */
.iphone-mockup {
  width: 280px; height: 580px; background: #000; border-radius: 40px; position: relative; overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 8px #111, inset 0 0 0 9px #333;
  transform: scale(0.9); transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1s;
}
.iphone-mockup.zoomed { transform: scale(1.0); box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 8px #111, inset 0 0 0 9px #333; }
.iphone-mockup.zoomed-out { transform: scale(0.7) perspective(800px) rotateX(15deg) rotateY(-15deg); box-shadow: -20px 40px 80px rgba(0,0,0,0.6), inset 0 0 0 8px #111, inset 0 0 0 9px #333; }

.demo-scenes-container { position: absolute; inset: 0; background: var(--bg-color); border-radius: 32px; overflow: hidden; }

.demo-scene { position: absolute; inset: 0; display: flex; flex-direction: column; opacity: 0; pointer-events: none; z-index: 5; transition: opacity 0.4s; }
.demo-scene.active { opacity: 1; pointer-events: auto; }

.demo-header { font-size: 20px; font-weight: 700; text-align: center; padding: 40px 0 20px; color: var(--text-primary); }

.demo-list { padding: 0 16px; }
.demo-list-item { background: var(--card-bg); padding: 16px; border-radius: 12px; position: relative; overflow: hidden; transform: translateX(0); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: space-between; }
.demo-list-item.swiped { transform: translateX(-80px); }
.demo-book-info { z-index: 2; }
.demo-book-title { font-weight: 600; font-size: 14px; }
.demo-book-prog { font-size: 12px; color: var(--accent); }
.demo-delete-btn { position: absolute; right: 0; top: 0; bottom: 0; width: 80px; background: #FF3B30; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; transform: translateX(100%); transition: transform 0.4s; z-index: 1; }
.demo-list-item.swiped .demo-delete-btn { transform: translateX(0); }

.demo-bottom-sheet { position: absolute; bottom: 0; left: 0; right: 0; background: var(--card-bg); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 10; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
.demo-bottom-sheet.open { transform: translateY(0); }
.sheet-btn { padding: 14px; text-align: center; background: var(--bg-color); border-radius: 10px; margin-bottom: 10px; font-weight: 600; font-size: 14px; }

.demo-cursor { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.4); box-shadow: 0 0 15px rgba(255,255,255,0.2); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0; z-index: 20; transition: transform 0.2s, opacity 0.2s; pointer-events: none; }
.demo-cursor.tap { transform: translate(-50%, -50%) scale(1); opacity: 1; }

.demo-callout { position: absolute; bottom: 40px; left: 20px; right: 20px; text-align: center; font-size: 16px; font-weight: 600; color: #fff; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 12px; border-radius: 12px; opacity: 0; transform: translateY(10px); transition: all 0.4s; z-index: 15; }
.demo-callout.show { opacity: 1; transform: translateY(0); }

.demo-theme-options { display: flex; flex-direction: column; gap: 12px; padding: 0 20px; }
.theme-opt { padding: 16px; border-radius: 12px; background: var(--card-bg); text-align: center; font-weight: 600; font-size: 14px; border: 1px solid transparent; transition: all 0.3s; }
.theme-opt.active { border-color: var(--accent); }
.demo-text-preview { padding: 30px 20px; text-align: center; font-size: 15px; color: var(--text-primary); transition: color 0.3s; }

.demo-countdown-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; }
.demo-countdown-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); width: 100%; height: 100%; }
.demo-countdown-ring circle { fill: none; stroke: var(--border-subtle); stroke-width: 4; }
.d-ring-prog { stroke: var(--accent) !important; stroke-dasharray: 283; stroke-dashoffset: 0; transition: stroke-dashoffset 1s linear; }
#demoCountText { font-size: 32px; font-weight: 700; z-index: 2; }

.demo-pause-glyph { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); font-size: 40px; font-weight: 800; color: var(--accent); opacity: 0; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.demo-pause-glyph.show { transform: translate(-50%, -50%) scale(1); opacity: 1; }

.demo-placeholder-quote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-style: italic; color: var(--text-secondary); opacity: 0.6; padding: 20px; text-align: center; transition: opacity 0.3s, transform 3s linear; }
.demo-placeholder-quote.rotating { transform: rotate(2deg) scale(1.05); }
.demo-placeholder-quote.hidden { opacity: 0; }
.demo-pasted-text { position: absolute; inset: 0; padding: 40px 20px; font-size: 16px; color: var(--text-primary); opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.demo-pasted-text.show { opacity: 1; transform: translateY(0); }

.demo-outro-logo { flex: 1; display: flex; align-items: flex-end; justify-content: center; font-size: 32px; font-weight: 800; letter-spacing: 4px; padding-bottom: 10px; opacity: 0; transform: scale(0.9); transition: all 0.8s; }
.demo-outro-logo.show { opacity: 1; transform: scale(1); }
.demo-outro-tagline { font-size: 14px; color: var(--text-secondary); text-align: center; opacity: 0; transition: opacity 0.8s 0.3s; }
.demo-outro-tagline.show { opacity: 1; }
.demo-outro-badge { margin: 40px auto; padding: 12px 24px; border-radius: 20px; background: rgba(255,255,255,0.1); font-size: 12px; font-weight: 600; text-align: center; width: max-content; opacity: 0; transition: opacity 0.8s 0.6s; }
.demo-outro-badge.show { opacity: 1; }

.play-demo-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 30; transition: opacity 0.5s; cursor: pointer; backdrop-filter: blur(5px);
}
.play-btn-circle { width: 64px; height: 64px; border-radius: 50%; background: var(--accent); display: flex; justify-content: center; align-items: center; margin-bottom: 16px; transition: transform 0.3s; }
.play-demo-overlay:hover .play-btn-circle { transform: scale(1.1); }
"""

css = re.sub(r"/\* Apple-style Demo Video Animations \*/.*?\.play-demo-overlay:hover \.play-btn-circle \{[^}]+\}", new_css, css, flags=re.DOTALL)

with open("assets/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

