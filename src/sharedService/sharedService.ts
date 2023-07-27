import { PLUGIN_WINDOW_CLASSIFICATION } from '../const';

export function getPluginWindow(): Window | null {
    if (typeof ui === 'undefined') return null;
    return ui.getWindow(PLUGIN_WINDOW_CLASSIFICATION);
}
