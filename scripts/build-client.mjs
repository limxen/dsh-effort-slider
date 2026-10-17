// Builds lib/client.js (permanent client bundle) from client.js (dynamic source).
//
// The dynamic source targets the DeepSeek Harness dynamic-plugin runtime (globals: React,
// styles, ctx, slots). The permanent bundle wraps it in the web module-loader
// format the harness serves for `dsh.client` packages:
//
//   window.__ModuleLoader__.load({ id: <packageName>, factory: (require) => ... })
//
// Inside the factory we provide the two globals the source needs:
//   - React       <- require("react")
//   - styles      <- a shim that appends a <style> element (single instance,
//                    replaced on re-apply; the page reset clears it)
//
// Run with Node (>=18):  node scripts/build-client.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "client.js"), "utf8");

const bundle = `window.__ModuleLoader__.load({
\tid: "dsh-effort-slider",
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
\t\tlet React = require("react");
\t\t// Shim for the dynamic runtime's \`styles\` builtin: one <style> element,
\t\t// replaced on re-apply (a page reset clears it).
\t\tconst styles = (() => {
\t\t\tlet el = null;
\t\t\treturn {
\t\t\t\tinsert: (css) => {
\t\t\t\t\tif (el) el.remove();
\t\t\t\t\tel = document.createElement("style");
\t\t\t\t\tel.textContent = css;
\t\t\t\t\tdocument.head.appendChild(el);
\t\t\t\t\treturn () => {
\t\t\t\t\t\tif (el) { el.remove(); el = null; }
\t\t\t\t\t};
\t\t\t\t},
\t\t\t};
\t\t})();
\t\tconst plugin = (() => {
${source}
\t\t})();
\t\texports.apply = plugin.apply;
\t\texports.inject = plugin.inject;
\t\treturn module.exports;
\t}
});
`;

writeFileSync(join(root, "lib", "client.js"), bundle);
console.log("built lib/client.js");
