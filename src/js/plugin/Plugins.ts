import {LostLitePlugin} from './LostLitePlugin';
import {DebugPlugin} from './plugins/DebugPlugin';
import {Client} from '../client';

export default class Plugins {
    static DRAW_DISTANCE: number = 50; // default 25
    static ZOOM: number = 3; // default 3
    static IN_PACKETS: number = 50; // default 5
    static REMOVE_ROOFS: boolean = false; // default false
    static SHOW_TRUE_TILE: boolean = false; // default false
    static NODRAG: boolean = false; // default false
    static SHOW_TILE_MARKERS: boolean = false; // default false
    static DEBUG: boolean = false; // default false
    static HIDE_IP: boolean = false; // default false
    static AFK: boolean = false; // default false
    static LOOT_TRACKER: boolean = false; // default false
    static XP_TRACKER: boolean = false; // default false
}

export type PluginRegistryType = {
    loadPlugins: (client: Client) => Promise<Map<string, LostLitePlugin>>;
    loadedPlugins: Map<string, LostLitePlugin>
}

export const usePluginRegistry = (): PluginRegistryType => {
    const loadedPlugins: Map<string, LostLitePlugin> = new Map<string, LostLitePlugin>();

    const loadPlugins = async (client: Client): Promise<Map<string, LostLitePlugin>> => {
        loadedPlugins.set('debug_plugin', new DebugPlugin(client));
        return Promise.resolve(loadedPlugins);
    }

    return {
        loadPlugins,
        loadedPlugins
    }
}