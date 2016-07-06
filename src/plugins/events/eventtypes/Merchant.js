
import _ from 'lodash';
import { Event } from '../../../core/base/event';

import { Equipment } from '../../../core/base/equipment';
import { ItemGenerator } from '../../../shared/item-generator';

export const WEIGHT = 15;

// Get given the opportunity to change classes
export class Merchant extends Event {
  static operateOn(player) {

    const item = ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk + player.liveStats.merchantItemGeneratorBonus));
    if(!player.canEquip(item)) {
      const message = '%player was offered %item by a wandering merchant, but it was useless to %himher.';
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage });
      return;
    }

    const cost = item.score - (item.score*player.liveStats.merchantCostReductionMultiplier);
    if(cost > player.gold) {
      const message = '%player was offered %item by a wandering merchant, but %she doesn\'t have enough gold.';
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage });
      return;
    }

    const id = Event.chance.guid();
    const message = `Would you like to buy «${item.fullname}» for ${cost} gold?`;
    const eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
    const extraData = { item, cost, eventText };

    player.addChoice({ id, message, extraData, event: 'Merchant', choices: ['Yes', 'No'] });
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    if(player.gold < choice.extraData.cost) return false;
    player.equip(new Equipment(choice.extraData.item));
    player.gainGold(-choice.extraData.cost);
    player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText });
  }

  static feedback(player) {
    Event.feedback(player, 'You do not have enough gold!');
  }
}
