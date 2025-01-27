import {Client} from '../client';

export abstract class LostLitePlugin implements ClientHook {
    private client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    onClientTick(): void {}
    onUpdateStat(stat: number, xp: number, level: number): void {}

    abstract getName(): string;

}