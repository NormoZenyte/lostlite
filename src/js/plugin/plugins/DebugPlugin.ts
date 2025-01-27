import {LostLitePlugin} from '../LostLitePlugin';

export class DebugPlugin extends LostLitePlugin {
    onUpdateStat(stat: number, xp: number, level: number): void {
        console.log(`Stat updated: Stat=${stat} XP=${xp} Level=${level}`)
    }

    getName(): string {
        return 'DebugPlugin';
    }
}