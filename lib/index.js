// Host half of dsh-effort-slider.
//
// Pure UI plugin: the empty apply exists so the plugin appears in the host
// cordis.yml / Loader entry tree; the browser half ships via
// exports["./client"], discovered through the package.json `dsh.client`
// declaration (same pattern as @deepseek-ai/dsh-client-ui-model-selection).
export function apply() {}
