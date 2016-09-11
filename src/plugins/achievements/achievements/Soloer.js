
import { Achievement, AchievementTypes } from '../achievement';

export class Soloer extends Achievement {
  static achievementData(player) {

    const totalSoloCombats = player.$statistics.getStat('CombatSolo');

    if(totalSoloCombats < 5000) return [];

    return [{
      tier: 1,
      name: 'Soloer',
      desc: 'Gain a special title for 5000 solo battles.',
      type: AchievementTypes.COMBAT,
      rewards: [{
        type: 'title',
        title: 'Soloer'
      }]
    }];
  }
}