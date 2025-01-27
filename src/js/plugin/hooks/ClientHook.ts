interface ClientHook {
    onClientTick(): void;
    onUpdateStat(stat: number, xp: number, level: number): void;
}