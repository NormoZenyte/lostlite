import {Client} from '../client';
import {setupConfiguration} from '../configuration';
import {Game} from '../game';
import {Renderer} from '../jagex2/renderer/Renderer';
import {RendererWebGPU} from '../jagex2/renderer/webgpu/RendererWebGPU';
import {canvasContainer} from '../jagex2/graphics/Canvas';
import Plugins, {usePluginRegistry, PluginRegistryType} from '../plugin/Plugins';

declare global {
    interface Window {
        Renderer: typeof Renderer;
        RendererWebGPU: typeof RendererWebGPU;
    }
}

class UIManager {
    private game: Game;
    private trueTileToggle: HTMLInputElement;
    private gpuToggle: HTMLInputElement;
    private tileMarkerToggle: HTMLInputElement;
    private resizableToggle: HTMLInputElement;
    private debugToggle: HTMLInputElement;
    private roofsToggle: HTMLInputElement;
    private nodragToggle: HTMLInputElement;
    private hideipToggle: HTMLInputElement;
    private afkToggle: HTMLInputElement;
    private canvasContainer: HTMLElement;
    private canvas: HTMLCanvasElement;
    private lootTrackerToggle: HTMLInputElement;
    private xpTrackerToggle: HTMLInputElement;

    constructor(game: Game) {
        this.game = game;
        this.trueTileToggle = document.getElementById('true-tile-toggle') as HTMLInputElement;
        this.gpuToggle = document.getElementById('gpu-toggle') as HTMLInputElement;
        this.tileMarkerToggle = document.getElementById('tile-marker-toggle') as HTMLInputElement;
        this.resizableToggle = document.getElementById('resizable-toggle') as HTMLInputElement;
        this.debugToggle = document.getElementById('debug-toggle') as HTMLInputElement;
        this.roofsToggle = document.getElementById('roofs-toggle') as HTMLInputElement;
        this.nodragToggle = document.getElementById('nodrag-toggle') as HTMLInputElement;
        this.hideipToggle = document.getElementById('ip-toggle') as HTMLInputElement;
        this.afkToggle = document.getElementById('afk-toggle') as HTMLInputElement;
        this.canvasContainer = document.getElementById('canvas-container') as HTMLElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.lootTrackerToggle = document.getElementById('loot-tracker-toggle') as HTMLInputElement;
        this.xpTrackerToggle = document.getElementById('xp-tracker-toggle') as HTMLInputElement;

        const load = async () => {
            await this.initializeToggles();
            this.setupEventListeners();
            this.initializeFPSCounter();
            this.initializeSidebar();
        };

        load().then((): void => console.log('Finished loading LostLite.'));
    }

    private async enableGPURenderer(): Promise<void> {
        console.log('Enabling gpu');
        try {
            Renderer.renderer = await RendererWebGPU.init(canvasContainer, this.game.width, this.game.height);
            if (!Renderer.renderer) {
                this.game.addMessage(0, 'Failed to enable webgpu', '');
                this.gpuToggle.checked = false;
                await this.onGpuChange();
            }
        } catch (e) {
            if (e instanceof Error) {
                this.game.addMessage(0, 'Error enabling webgpu: ' + e.message, '');
            }
            console.error('Failed creating webgpu renderer', e);
            this.gpuToggle.checked = false;
            await this.onGpuChange();
        }
        console.log('Finished turning on gpu.');
    }

    private disableGPURenderer(): void {
        console.log('turning off gpu...');
        Renderer.resetRenderer();
    }

    private async initializeToggles(): Promise<void> {
        // Initialize GPU state
        if (localStorage.getItem('gpuEnabled') === 'true') {
            this.gpuToggle.checked = true;
            this.gpuToggle.closest('.plugin-item')?.classList.add('active');
            await this.enableGPURenderer();
        }

        // Initialize resizable state
        if (localStorage.getItem('resizableEnabled') === 'true') {
            this.resizableToggle.checked = true;
            this.canvasContainer.classList.add('resizable');
            this.updateCanvasSize();
        }

        // Initialize hide ip state
        if (localStorage.getItem('hideipEnabled') === 'true') {
            this.hideipToggle.checked = true;
            this.hideipToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.HIDE_IP = true;
        }

        // Initialize afk state
        if (localStorage.getItem('afkEnabled') === 'true') {
            this.afkToggle.checked = true;
            this.afkToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.AFK = true;
        }

        // Initialize loot tracker state
        const lootTrackerTab = document.querySelector('.section-header[data-section="loot"]') as HTMLElement;
        if (localStorage.getItem('lootTrackerEnabled') === 'true') {
            this.lootTrackerToggle.checked = true;
            this.lootTrackerToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.LOOT_TRACKER = true;
            if (lootTrackerTab) {
                lootTrackerTab.style.display = 'flex';
            }
        } else {
            if (lootTrackerTab) {
                lootTrackerTab.style.display = 'none';
            }
        }

        // Initialize XP tracker state
        const xpTrackerTab = document.querySelector('.section-header[data-section="xp"]') as HTMLElement;
        if (localStorage.getItem('xpTrackerEnabled') === 'true') {
            this.xpTrackerToggle.checked = true;
            this.xpTrackerToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.XP_TRACKER = true;
            if (xpTrackerTab) {
                xpTrackerTab.style.display = 'flex';
            }
        } else {
            if (xpTrackerTab) {
                xpTrackerTab.style.display = 'none';
            }
        }
    }

    commands: (() => Promise<void>)[] = [];

    async test(): Promise<void> {
        const loadDebug = async (): Promise<void> => {
            if (this.game.ingame) {
                this.game.chatTyped = '::debug';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
            return Promise.resolve();
        };

        const loadTrueTile = async (): Promise<void> => {
            if (this.game.ingame) {
                this.game.chatTyped = '::entityoverlay';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
            return Promise.resolve();
        };

        const loadRoofs = async (): Promise<void> => {
            if (this.game.ingame) {
                this.game.chatTyped = '::roofs';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
            return Promise.resolve();
        };

        const loadNodrag = async (): Promise<void> => {
            if (this.game.ingame) {
                this.game.chatTyped = '::nodrag';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
            return Promise.resolve();
        };

        const loadTilemarkers = async (): Promise<void> => {
            if (this.game.ingame) {
                this.game.chatTyped = '::tilemarkers';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
            return Promise.resolve();
        };

        if (this.debugToggle.checked) {
            this.commands.push(loadDebug);
        }

        if (this.trueTileToggle.checked) {
            this.commands.push(loadTrueTile);
        }

        if (this.roofsToggle.checked) {
            this.commands.push(loadRoofs);
        }

        if (this.nodragToggle.checked) {
            this.commands.push(loadNodrag);
        }

        if (this.tileMarkerToggle.checked) {
            this.commands.push(loadTilemarkers);
        }
    }

    onLogout(): void {
        if (this.debugToggle.checked) {
            this.debugToggle.checked = false;
            const pluginItem = this.debugToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.debugToggle.checked);
            Plugins.DEBUG = !Plugins.DEBUG;
        }

        if (this.trueTileToggle.checked) {
            this.trueTileToggle.checked = false;
            const pluginItem = this.trueTileToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.trueTileToggle.checked);
            Plugins.SHOW_TRUE_TILE = !Plugins.SHOW_TRUE_TILE;
        }

        if (this.roofsToggle.checked) {
            this.roofsToggle.checked = false;
            const pluginItem = this.roofsToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.roofsToggle.checked);
            Plugins.REMOVE_ROOFS = !Plugins.REMOVE_ROOFS;
        }

        if (this.nodragToggle.checked) {
            this.nodragToggle.checked = false;
            const pluginItem = this.nodragToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.nodragToggle.checked);
            Plugins.NODRAG = !Plugins.NODRAG;
        }

        if (this.tileMarkerToggle.checked) {
            this.tileMarkerToggle.checked = false;
            const pluginItem = this.tileMarkerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.tileMarkerToggle.checked);
            Plugins.SHOW_TILE_MARKERS = !Plugins.SHOW_TILE_MARKERS;
        }

        if (this.lootTrackerToggle.checked) {
            this.lootTrackerToggle.checked = false;
            const pluginItem = this.lootTrackerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.lootTrackerToggle.checked);
            Plugins.LOOT_TRACKER = !Plugins.LOOT_TRACKER;

            // Show/hide the loot tracker tab
            const lootTrackerTab = document.querySelector('.section-header[data-section="loot"]') as HTMLElement;
            if (lootTrackerTab) {
                lootTrackerTab.style.display = this.lootTrackerToggle.checked ? 'flex' : 'none';
            }

            // If the loot tracker section is currently open and we're disabling it, close it
            if (!this.lootTrackerToggle.checked) {
                const lootTrackerSection = document.querySelector('.section-content[data-section="loot"]');
                const lootTrackerHeader = document.querySelector('.section-header[data-section="loot"]');
                lootTrackerSection?.classList.remove('expanded');
                lootTrackerHeader?.classList.remove('active');

                // Update visibility of content wrapper
                const contentWrapper = document.querySelector('.section-content-wrapper');
                const listContainer = document.querySelector('.list-container');
                const hasActiveSection = document.querySelector('.section-header.active') !== null;
                contentWrapper?.classList.toggle('has-active-section', hasActiveSection);
                listContainer?.classList.toggle('has-active-section', hasActiveSection);
            }
        }

        if (this.xpTrackerToggle.checked) {
            this.xpTrackerToggle.checked = false;
            const pluginItem = this.xpTrackerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.xpTrackerToggle.checked);
            Plugins.XP_TRACKER = !Plugins.XP_TRACKER;

            // Show/hide the XP tracker tab
            const xpTrackerTab = document.querySelector('.section-header[data-section="xp"]') as HTMLElement;
            if (xpTrackerTab) {
                xpTrackerTab.style.display = this.xpTrackerToggle.checked ? 'flex' : 'none';
            }

            // If the XP tracker section is currently open and we're disabling it, close it
            if (!this.xpTrackerToggle.checked) {
                const xpTrackerSection = document.querySelector('.section-content[data-section="xp"]');
                const xpTrackerHeader = document.querySelector('.section-header[data-section="xp"]');
                xpTrackerSection?.classList.remove('expanded');
                xpTrackerHeader?.classList.remove('active');

                // Update visibility of content wrapper
                const contentWrapper = document.querySelector('.section-content-wrapper');
                const listContainer = document.querySelector('.list-container');
                const hasActiveSection = document.querySelector('.section-header.active') !== null;
                contentWrapper?.classList.toggle('has-active-section', hasActiveSection);
                listContainer?.classList.toggle('has-active-section', hasActiveSection);
            }
        }
    }

    async initializeToggles2(): Promise<void> {
        // Debug toggle
        this.debugToggle.addEventListener('change', () => {
            const pluginItem = this.debugToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.debugToggle.checked);
            localStorage.setItem('debugEnabled', this.debugToggle.checked.toString());

            if (this.game.ingame) {
                this.game.chatTyped = '::debug';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
        });

        // True Tile toggle
        this.trueTileToggle.addEventListener('change', () => {
            const pluginItem = this.trueTileToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.trueTileToggle.checked);
            localStorage.setItem('trueTileEnabled', this.trueTileToggle.checked.toString());

            if (this.game.ingame) {
                this.game.chatTyped = '::entityoverlay';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
        });

        // Roofs toggle
        this.roofsToggle.addEventListener('change', () => {
            const pluginItem = this.roofsToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.roofsToggle.checked);
            localStorage.setItem('roofsEnabled', this.roofsToggle.checked.toString());

            if (this.game.ingame) {
                this.game.chatTyped = '::roofs';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
        });

        // Nodrag toggle
        this.nodragToggle.addEventListener('change', () => {
            const pluginItem = this.nodragToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.nodragToggle.checked);
            localStorage.setItem('nodragEnabled', this.nodragToggle.checked.toString());
            this.sendCommand('nodrag');
        });

        // Tile markers toggle
        this.tileMarkerToggle.addEventListener('change', () => {
            const pluginItem = this.tileMarkerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.tileMarkerToggle.checked);
            localStorage.setItem('nodragEnabled', this.tileMarkerToggle.checked.toString());

            if (this.game.ingame) {
                this.game.chatTyped = '::tilemarkers';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            }
        });

        // Initialize debug state
        if (localStorage.getItem('debugEnabled') === 'true') {
            this.debugToggle.checked = true;
            this.debugToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize roofs state
        if (localStorage.getItem('roofsEnabled') === 'true') {
            this.roofsToggle.checked = true;
            this.roofsToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize nodrag state
        if (localStorage.getItem('nodragEnabled') === 'true') {
            this.nodragToggle.checked = true;
            this.nodragToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize true tile state
        if (localStorage.getItem('trueTileEnabled') === 'true') {
            this.trueTileToggle.checked = true;
            this.trueTileToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize tile markers state
        if (localStorage.getItem('tileMarkerEnabled') === 'true') {
            this.tileMarkerToggle.checked = true;
            this.tileMarkerToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize loot tracker state
        if (localStorage.getItem('lootTrackerEnabled') === 'true') {
            this.lootTrackerToggle.checked = true;
            this.lootTrackerToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.LOOT_TRACKER = true;
            const lootTrackerTab = document.querySelector('.section-header[data-section="loot"]') as HTMLElement;
            if (lootTrackerTab) {
                lootTrackerTab.style.display = 'flex';
            }
        }

        // Initialize XP tracker state
        if (localStorage.getItem('xpTrackerEnabled') === 'true') {
            this.xpTrackerToggle.checked = true;
            this.xpTrackerToggle.closest('.plugin-item')?.classList.add('active');
            Plugins.XP_TRACKER = true;
            const xpTrackerTab = document.querySelector('.section-header[data-section="xp"]') as HTMLElement;
            if (xpTrackerTab) {
                xpTrackerTab.style.display = 'flex';
            }
        }
    }

    private sendCommand(command: string): void {
        if (!this.game.ingame) {
            return;
        }
        this.game.chatTyped = `::${command}`;
        this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
    }

    private async onGpuChange(): Promise<void> {
        const pluginItem = this.gpuToggle.closest('.plugin-item');
        pluginItem?.classList.toggle('active', this.gpuToggle.checked);
        localStorage.setItem('gpuEnabled', this.gpuToggle.checked.toString());

        if (this.gpuToggle.checked) {
            if (this.game.ingame) {
                this.game.chatTyped = '::gpu';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            } else {
                await this.enableGPURenderer();
            }
        } else {
            if (this.game.ingame) {
                this.game.chatTyped = '::gpu';
                this.game.onkeydown(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter'}));
            } else {
                this.disableGPURenderer();
            }
        }
    }

    private setupEventListeners(): void {
        // GPU toggle
        this.gpuToggle.addEventListener('change', async () => {
            await this.onGpuChange();
        });

        // Hide IP
        this.hideipToggle.addEventListener('change', async () => {
            const pluginItem = this.hideipToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.hideipToggle.checked);
            localStorage.setItem('hideipEnabled', this.hideipToggle.checked.toString());
            Plugins.HIDE_IP = !Plugins.HIDE_IP;
        });

        // AFK
        this.afkToggle.addEventListener('change', async () => {
            const pluginItem = this.afkToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.afkToggle.checked);
            localStorage.setItem('afkEnabled', this.afkToggle.checked.toString());
            Plugins.AFK = !Plugins.AFK;
        });

        // Resizable toggle
        this.resizableToggle.addEventListener('change', () => {
            this.canvasContainer.classList.toggle('resizable', this.resizableToggle.checked);
            localStorage.setItem('resizableEnabled', this.resizableToggle.checked.toString());
            this.updateCanvasSize();
        });

        // Loot Tracker toggle
        this.lootTrackerToggle.addEventListener('change', () => {
            const pluginItem = this.lootTrackerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.lootTrackerToggle.checked);
            localStorage.setItem('lootTrackerEnabled', this.lootTrackerToggle.checked.toString());
            Plugins.LOOT_TRACKER = this.lootTrackerToggle.checked;

            // Show/hide the loot tracker tab
            const lootTrackerTab = document.querySelector('.section-header[data-section="loot"]') as HTMLElement;
            if (lootTrackerTab) {
                lootTrackerTab.style.display = this.lootTrackerToggle.checked ? 'flex' : 'none';
            }

            // If the loot tracker section is currently open and we're disabling it, close it
            if (!this.lootTrackerToggle.checked) {
                const lootTrackerSection = document.querySelector('.section-content[data-section="loot"]');
                const lootTrackerHeader = document.querySelector('.section-header[data-section="loot"]');
                lootTrackerSection?.classList.remove('expanded');
                lootTrackerHeader?.classList.remove('active');

                // Update visibility of content wrapper
                const contentWrapper = document.querySelector('.section-content-wrapper');
                const listContainer = document.querySelector('.list-container');
                const hasActiveSection = document.querySelector('.section-header.active') !== null;
                contentWrapper?.classList.toggle('has-active-section', hasActiveSection);
                listContainer?.classList.toggle('has-active-section', hasActiveSection);
            }
        });

        // XP Tracker toggle
        this.xpTrackerToggle.addEventListener('change', () => {
            const pluginItem = this.xpTrackerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.xpTrackerToggle.checked);
            localStorage.setItem('xpTrackerEnabled', this.xpTrackerToggle.checked.toString());
            Plugins.XP_TRACKER = this.xpTrackerToggle.checked;

            // Show/hide the XP tracker tab
            const xpTrackerTab = document.querySelector('.section-header[data-section="xp"]') as HTMLElement;
            if (xpTrackerTab) {
                xpTrackerTab.style.display = this.xpTrackerToggle.checked ? 'flex' : 'none';
            }

            // If the XP tracker section is currently open and we're disabling it, close it
            if (!this.xpTrackerToggle.checked) {
                const xpTrackerSection = document.querySelector('.section-content[data-section="xp"]');
                const xpTrackerHeader = document.querySelector('.section-header[data-section="xp"]');
                xpTrackerSection?.classList.remove('expanded');
                xpTrackerHeader?.classList.remove('active');

                // Update visibility of content wrapper
                const contentWrapper = document.querySelector('.section-content-wrapper');
                const listContainer = document.querySelector('.list-container');
                const hasActiveSection = document.querySelector('.section-header.active') !== null;
                contentWrapper?.classList.toggle('has-active-section', hasActiveSection);
                listContainer?.classList.toggle('has-active-section', hasActiveSection);
            }
        });
    }

    private updateCanvasSize(): void {
        if (this.resizableToggle.checked) {
            const containerWidth = this.canvasContainer.clientWidth;
            const containerHeight = this.canvasContainer.clientHeight;
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;
        } else {
            this.canvas.width = 789;
            this.canvas.height = 532;
        }
    }

    private initializeFPSCounter(): void {
        const fpsCounter = document.querySelector('.fps-counter span') as HTMLElement;

        const updateFPS = (): void => {
            fpsCounter.textContent = `${this.game.fps} FPS`;
            requestAnimationFrame(updateFPS);
        };

        requestAnimationFrame(updateFPS);
    }

    private initializeSidebar(): void {
        // Get DOM elements
        const listContainer = document.querySelector('.list-container');
        const contentWrapper = document.querySelector('.section-content-wrapper');

        // Helper function to save section state
        const saveSectionState = (sectionId: string, isExpanded: boolean) => {
            localStorage.setItem(`section_${sectionId}_expanded`, isExpanded.toString());
        };

        // Helper function to update content wrapper visibility
        const updateContentWrapperVisibility = () => {
            const hasActiveSection = document.querySelector('.section-header.active') !== null;
            contentWrapper?.classList.toggle('has-active-section', hasActiveSection);
            listContainer?.classList.toggle('has-active-section', hasActiveSection);
        };

        // Section header click handler
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach((header: Element) => {
            header.addEventListener('click', () => {
                const sectionId = header.getAttribute('data-section');
                if (sectionId) {
                    const content = document.querySelector(`.section-content[data-section="${sectionId}"]`);

                    // Close all other sections first
                    const allSectionContents = document.querySelectorAll('.section-content');
                    const allSectionHeaders = document.querySelectorAll('.section-header');
                    allSectionContents.forEach(otherContent => {
                        if (otherContent !== content) {
                            otherContent.classList.remove('expanded');
                            const otherSectionId = otherContent.getAttribute('data-section');
                            if (otherSectionId) {
                                saveSectionState(otherSectionId, false);
                            }
                        }
                    });
                    allSectionHeaders.forEach(otherHeader => {
                        if (otherHeader !== header) {
                            otherHeader.classList.remove('active');
                        }
                    });

                    // Toggle this section
                    content?.classList.toggle('expanded');
                    header.classList.toggle('active');
                    saveSectionState(sectionId, content?.classList.contains('expanded') || false);

                    // Update content wrapper visibility
                    updateContentWrapperVisibility();
                }
            });
        });

        // Plugin item click handler
        const pluginItems = document.querySelectorAll('.plugin-item');
        pluginItems.forEach((item: Element) => {
            item.addEventListener('click', () => {
                // Expand the section if it's collapsed
                const sectionId = item.closest('.section-content')?.getAttribute('data-section');
                if (sectionId) {
                    const header = document.querySelector(`.section-header[data-section="${sectionId}"]`);
                    const content = document.querySelector(`.section-content[data-section="${sectionId}"]`);

                    // Close all other sections first
                    const allSectionContents = document.querySelectorAll('.section-content');
                    const allSectionHeaders = document.querySelectorAll('.section-header');
                    allSectionContents.forEach(otherContent => {
                        if (otherContent !== content) {
                            otherContent.classList.remove('expanded');
                            const otherSectionId = otherContent.getAttribute('data-section');
                            if (otherSectionId) {
                                saveSectionState(otherSectionId, false);
                            }
                        }
                    });
                    allSectionHeaders.forEach(otherHeader => {
                        if (otherHeader !== header) {
                            otherHeader.classList.remove('active');
                        }
                    });

                    // Expand this section
                    if (content && !content.classList.contains('expanded')) {
                        content.classList.add('expanded');
                        header?.classList.add('active');
                        saveSectionState(sectionId, true);
                    }

                    // Update content wrapper visibility
                    updateContentWrapperVisibility();
                }
            });
        });

        // Restore section states from localStorage - only expand the last active section
        const sections = document.querySelectorAll('.section-header');
        let lastExpandedSectionId: string | null = null;
        sections.forEach((header: Element) => {
            const sectionId = header.getAttribute('data-section');
            if (sectionId) {
                const isExpanded = localStorage.getItem(`section_${sectionId}_expanded`) === 'true';
                if (isExpanded) {
                    lastExpandedSectionId = sectionId;
                }
            }
        });

        if (lastExpandedSectionId) {
            const header = document.querySelector(`.section-header[data-section="${lastExpandedSectionId}"]`);
            const content = document.querySelector(`.section-content[data-section="${lastExpandedSectionId}"]`);
            if (header && content) {
                content.classList.add('expanded');
                header.classList.add('active');
                // Update content wrapper visibility
                updateContentWrapperVisibility();
            }
        } else {
            // Initially hide content wrapper if no section is active
            updateContentWrapperVisibility();
        }
    }
}

export const LostLite = async (): Promise<void> => {
    console.log(`Lost Lite Launching w/ user client - release #${Client.clientversion}`);
    // Initialize loading UI
    const loadingOverlay = document.querySelector('.loading-overlay') as HTMLElement;
    const loadingProgressBar = document.getElementById('loading-progress-bar') as HTMLElement;
    const loadingText = document.querySelector('.loading-text') as HTMLElement;
    let progress = 0;

    const { loadedPlugins, loadPlugins }: PluginRegistryType = usePluginRegistry();

    const updateLoadingProgress = (text: string, newProgress: number) => {
        progress = newProgress;
        loadingProgressBar.style.width = `${progress}%`;
        loadingText.textContent = text;
        console.log(`Loading: ${text} (${progress}%)`); // Debug loading progress
    };

    try {
        // Setup configuration (33%)
        updateLoadingProgress('Setting up configuration...', 0);
        await setupConfiguration();
        updateLoadingProgress('Configuration loaded', 33);
        console.log('Configuration has been setup. Launching game.');

        // Initialize game (66%)
        // updateLoadingProgress('Initializing game engine...', 33);
        const game: Game = new Game();
        updateLoadingProgress('Game engine initializing...', 66);
        let uiManager: UIManager | null = null;

        // Setup login screen (100%)
        game.onLoginScreenLoaded = async (): Promise<void> => {
            updateLoadingProgress('Loading interface...', 66);
            uiManager = new UIManager(game);
            updateLoadingProgress('Loading plugins...', 75);
            await loadPlugins(game);
            updateLoadingProgress('LostLite Loaded!', 100);

            // Hide loading overlay
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        };

        // World loading doesn't affect loading screen since it happens after login
        game.onWorldLoaded = async (): Promise<void> => {
            await uiManager?.initializeToggles2();
            uiManager?.test();
        };

        game.onClientTick = async (): Promise<void> => {
            const polled: (() => Promise<void>) | undefined = uiManager?.commands?.pop();
            if (polled) {
                await polled();
            }

            loadedPlugins.forEach((plugin): void => plugin.onClientTick())
        };

        game.onLogout = async (): Promise<void> => {
            uiManager?.onLogout();
        };

        game.onUpdateStat = (stat: number, xp: number, level: number): void => {
            loadedPlugins.forEach((plugin): void => plugin.onUpdateStat(stat, xp, level))
        }

        await game.run();
        console.log('Finished.');
    } catch (error) {
        console.error('Error during initialization:', error);
        loadingText.textContent = 'Error loading game. Please refresh the page.';
        loadingText.style.color = '#ff4444';
    }
};

await LostLite();
