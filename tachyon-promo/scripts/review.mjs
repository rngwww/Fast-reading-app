import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import path from "node:path";
import { mkdirSync } from "node:fs";
const url = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  webpackOverride: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: { ...config.resolve?.alias, "@": path.resolve("src") },
    },
  }),
});
const browser = await openBrowser("chrome", {
  chromiumOptions: { gl: "angle" },
});
const comp = await selectComposition({
  serveUrl: url,
  id: "Tachyon-More-You",
  puppeteerInstance: browser,
});
mkdirSync("out/stills", { recursive: true });
for (const frame of [210, 580, 1080, 1640, 2310, 2500, 2820, 3230, 3480]) {
  await renderStill({
    serveUrl: url,
    composition: comp,
    frame,
    output: `out/stills/${frame}.png`,
    puppeteerInstance: browser,
    chromiumOptions: { gl: "angle" },
  });
  console.log(`Reviewed frame ${frame}`);
}
await browser.close({ silent: true });
