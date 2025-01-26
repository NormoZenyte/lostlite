import {Client} from '../client';
import {setupConfiguration} from '../configuration';
import {Game} from '../game';
import {Renderer} from '../jagex2/renderer/Renderer';
import {RendererWebGPU} from '../jagex2/renderer/webgpu/RendererWebGPU';
import {canvasContainer} from '../jagex2/graphics/Canvas';

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
    private canvasContainer: HTMLElement;
    private canvas: HTMLCanvasElement;

    constructor(game: Game) {
        this.game = game;
        this.trueTileToggle = document.getElementById('true-tile-toggle') as HTMLInputElement;
        this.gpuToggle = document.getElementById('gpu-toggle') as HTMLInputElement;
        this.tileMarkerToggle = document.getElementById('tile-marker-toggle') as HTMLInputElement;
        this.resizableToggle = document.getElementById('resizable-toggle') as HTMLInputElement;
        this.canvasContainer = document.getElementById('canvas-container') as HTMLElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

        const load = async () => {
            await this.initializeToggles();
            this.setupEventListeners();
            this.initializeFPSCounter();
            this.initializeSidebar();
        }

        load().then((): void => console.log('Finished loading LostLite.'));
    }

    private async enableGPURenderer(): Promise<void> {
        console.log('Enabling gpu');
        try {
            Renderer.renderer = await RendererWebGPU.init(canvasContainer, this.game.width, this.game.height);
            if (!Renderer.renderer) {
                this.game.addMessage(0, 'Failed to enable webgpu', '');
            }
        } catch (e) {
            if (e instanceof Error) {
                this.game.addMessage(0, 'Error enabling webgpu: ' + e.message, '');
            }
            console.error('Failed creating webgpu renderer', e);
        }
        console.log('Finished turning on gpu.')
    }

    private disableGPURenderer(): void {
        console.log('turning off gpu...')
        Renderer.resetRenderer();
    }

    private async initializeToggles(): Promise<void> {
        // Initialize GPU state
        if (localStorage.getItem('gpuEnabled') === 'true') {
            this.gpuToggle.checked = true;
            this.gpuToggle.closest('.plugin-item')?.classList.add('active');
            await this.enableGPURenderer();
        }

        // Initialize other toggle states
        if (localStorage.getItem('trueTileEnabled') === 'true') {
            this.trueTileToggle.checked = true;
            this.trueTileToggle.closest('.plugin-item')?.classList.add('active');
        }
        if (localStorage.getItem('tileMarkerEnabled') === 'true') {
            this.tileMarkerToggle.checked = true;
            this.tileMarkerToggle.closest('.plugin-item')?.classList.add('active');
        }

        // Initialize resizable state
        if (localStorage.getItem('resizableEnabled') === 'true') {
            this.resizableToggle.checked = true;
            this.canvasContainer.classList.add('resizable');
            this.updateCanvasSize();
        }
    }

    private setupEventListeners(): void {
        // GPU toggle
        this.gpuToggle.addEventListener('change', async () => {
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
        });

        // True Tile toggle
        this.trueTileToggle.addEventListener('change', () => {
            const pluginItem = this.trueTileToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.trueTileToggle.checked);
            localStorage.setItem('trueTileEnabled', this.trueTileToggle.checked.toString());
        });

        // Tile Marker toggle
        this.tileMarkerToggle.addEventListener('change', () => {
            const pluginItem = this.tileMarkerToggle.closest('.plugin-item');
            pluginItem?.classList.toggle('active', this.tileMarkerToggle.checked);
            localStorage.setItem('tileMarkerEnabled', this.tileMarkerToggle.checked.toString());
        });

        // Resizable toggle
        this.resizableToggle.addEventListener('change', () => {
            this.canvasContainer.classList.toggle('resizable', this.resizableToggle.checked);
            localStorage.setItem('resizableEnabled', this.resizableToggle.checked.toString());
            this.updateCanvasSize();
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            if (this.resizableToggle.checked) {
                this.updateCanvasSize();
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
        // Sidebar toggle
        const toggleSidebar = document.querySelector('.toggle-sidebar');
        const listContainer = document.querySelector('.list-container');

        toggleSidebar?.addEventListener('click', (event: Event) => {
            const target = event.currentTarget as HTMLElement;
            listContainer?.classList.toggle('collapsed');
            target.classList.toggle('fa-chevron-right');
            target.classList.toggle('fa-chevron-left');
        });

        // Category expand/collapse
        const categoryHeader = document.querySelector('.category-header');
        categoryHeader?.addEventListener('click', (event: Event) => {
            const target = event.currentTarget as HTMLElement;
            const items = target.parentElement?.querySelectorAll('.plugin-item');
            const chevron = target.querySelector('.fa-chevron-down, .fa-chevron-up');
            const isCollapsed = chevron?.classList.contains('fa-chevron-down');
            
            items?.forEach((item: Element) => {
                (item as HTMLElement).style.display = isCollapsed ? 'flex' : 'none';
            });
            
            chevron?.classList.toggle('fa-chevron-down');
            chevron?.classList.toggle('fa-chevron-up');
        });
    }
}

export const LostLite = async (): Promise<void> => {
    console.log(`Lost Lite Launching w/ user client - release #${Client.clientversion}`);
    await setupConfiguration();
    console.log('Configuration has been setup. Launching game.');

    const game: Game = new Game();

    game.loadedCallback = (): UIManager => new UIManager(game);

    game.run().then((): void => {
        console.log('Finished.')
    });
}

await LostLite();