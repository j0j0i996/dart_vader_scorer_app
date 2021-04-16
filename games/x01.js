import { v4 as uuidv4 } from "uuid";
class Player {
  constructor(name, startscore) {
    this.name = name;
    this.id = uuidv4();
    this.startscore = startscore;
    this.remaining = this.startscore;
    this.sets = 0;
    this.legs = 0;
    this.last_score = 0;
    this.darts_thrown_leg = 0;
    this.darts_thrown_total = 0;
    this.points_thrown_total = 0;
    this.avg = 0;
    this.turn_scores = [false, false, false];
    this.turn_sections = [false, false, false];
    this.thrown_in_turn = false;
    this.active = false;
  }

  represent() {
    console.log(
      "Sets: " +
        this.sets +
        " Legs: " +
        this.legs +
        " Remaining: " +
        this.remaining
    );
    console.log("Player active? " + this.active);
    console.log("Darts thrown: " + this.darts_thrown_leg);
    console.log("Points total: " + this.points_thrown_total);
    console.log("Avg: " + this.avg);
  }

  get_playerState() {
    return {
      name: this.name,
      id: this.id,
      remaining: this.remaining,
      active: this.active,
      scoreBoard: [
        { k: "Sets", v: this.sets, id: "81359722-a165-4ad7-b3c6-8c2f0f991dd2" },
        { k: "Legs", v: this.legs, id: "74beedc2-b6f3-49a6-b7c2-4fd75927d524" },
      ],
      stats: [
        {
          k: "Last score",
          v: this.last_score,
          id: "9de9280f-516e-48c6-a41a-33b4a1e64b75",
        },
        {
          k: "Darts thrown",
          v: this.darts_thrown_leg,
          id: "aab75b10-1a83-4a98-8fa5-aa2980e67c19",
        },
        {
          k: "Average",
          v: this.avg,
          id: "be720bb8-e90a-47e0-8434-57467090846e",
        },
      ],
    };
  }

  onThrow(score, section, throw_idx) {
    this.remaining -= score;
    this.turn_scores[throw_idx] = score;
    this.turn_sections[throw_idx] = section;
    this.darts_thrown_leg++;
    this.darts_thrown_total++;
    this.points_thrown_total += score;
    this.avg = (this.points_thrown_total / this.darts_thrown_total) * 3;
  }

  onLegWon() {
    //deactivate player
    this.active = false;

    this.legs++;
    this.darts_thrown_total++;
    this.points_thrown_total += this.remaining;
    this.avg = (this.points_thrown_total / this.darts_thrown_total) * 3;
  }

  onOverthrow() {
    // deactivate player (for potential frustration throw :) )
    this.active = false;

    // reset score
    var turn_scores = this.turn_scores;
    var total = 0;
    turn_scores.forEach(function (item, index) {
      total += item;
    });

    this.remaining += total;
    this.points_thrown_total -= total;
    this.darts_thrown_leg++;
    this.darts_thrown_total++;
    this.avg = (this.points_thrown_total / this.darts_thrown_total) * 3;
    this.turn_scores = [false, false, false];
    this.turn_sections = [false, false, false];
  }

  onNextLeg() {
    this.remaining = this.startscore;
    this.darts_thrown_leg = 0;
  }

  onTurnStart() {
    this.turn_scores = [false, false, false];
    this.turn_sections = [false, false, false];
    this.active = true;
    this.thrown_in_turn = false;
  }

  onTurnEnd() {
    this.active = false;
    var score = 0;
    for (var i in this.turn_scores) {
      score += this.turn_scores[i];
    }
    this.last_score = score;
  }

  remove_throw(throw_idx) {
    this.remaining += this.turn_scores[throw_idx];
    this.points_thrown_total -= this.turn_scores[throw_idx];
    this.darts_thrown_leg--;
    this.darts_thrown_total--;
    this.turn_sections[throw_idx] = false;
    this.turn_scores[throw_idx] = false;

    console.log("Throw removed");
  }
}

export default class gameCls {
  constructor(playerArray, params) {
    // params = startscore, sets4win, legs4set, doubleOut
    var players = [];
    playerArray.forEach(function (item, index) {
      let p = new Player(item.name, params.startscore);
      players.push(p);
    });

    this.players = players;
    this.selPlayerIndex = 0;
    this.players[this.selPlayerIndex].active = true;
    this.lastLegStarter = 0;
    this.lastSetStarter = 0;
    this.throw_idx = 0;
    this.startscore = params.startscore;

    if (params.win_crit == "Set") {
      this.legs4set = 3;
      this.sets4win = params.first_to;
    } else {
      this.legs4set = params.first_to;
      this.sets4win = 1;
    }

    this.doubleOut = params.doubleOut;
    this.back_up = false; // in case of change operation
  }

  get_gameState() {
    var gameState = [];
    this.players.forEach(function (item) {
      gameState.push(item.get_playerState());
    });
    //console.log(gameState);
    return gameState;
  }

  get_throwState() {
    const scores = this.players[this.selPlayerIndex].turn_scores;
    const sections = this.players[this.selPlayerIndex].turn_sections;
    //console.log(throws);
    const lastThrowsObj = {
      first: { id: "1", throw: 1, score: scores[0], section: sections[0] },
      second: { id: "2", throw: 2, score: scores[1], section: sections[1] },
      third: { id: "3", throw: 3, score: scores[2], section: sections[2] },
    };
    return lastThrowsObj;
  }

  onThrow(field, multiplier) {
    this.players[this.selPlayerIndex].thrown_in_turn = true;
    //testing
    var score = field * multiplier;
    var section =
      (multiplier == 1 ? "S" : multiplier == 2 ? "D" : "T") + String(field);

    if (this.players[this.selPlayerIndex].active) {
      if (this.players[this.selPlayerIndex].remaining - score > 1) {
        // normal throw
        this.players[this.selPlayerIndex].onThrow(
          score,
          section,
          this.throw_idx
        );
        this.throw_idx += 1;
      } else if (
        (this.players[this.selPlayerIndex].remaining - score == 0) &
        (this.doubleOut & (multiplier == 2) || this.doubleOut != true)
      ) {
        //end of leg
        this.onLegEnd();
      } else {
        //overthrow
        this.onOverthrow();
      }
    }
  }

  onNextPlayer() {
    if (this.players[this.selPlayerIndex].thrown_in_turn) {
      this.nextPlayer();
    }
  }

  correct_score(throw_idx, multiplier, field) {
    throw_idx--;
    console.log(throw_idx); //array starts at 0
    const turn_sections = {
      ...this.players[this.selPlayerIndex].turn_sections,
    };
    const darts_thrown_in_turn = this.throw_idx;

    console.log(turn_sections);
    console.log(this.throw_idx);

    var i;
    for (i = 2; i >= throw_idx; i--) {
      console.log(i);
      if (turn_sections[i] != false) {
        this.players[this.selPlayerIndex].remove_throw(i);
        this.throw_idx--;
      }
    }

    var kvArray = [
      ["S", 1],
      ["D", 2],
      ["T", 3],
    ];
    var MultiplierMap = new Map(kvArray);

    console.log(turn_sections);
    for (i = throw_idx; i < 3; i++) {
      if (i == throw_idx) {
        this.throw_idx = i;
        this.onThrow(field, multiplier);
      } else if (turn_sections[i] != false) {
        this.throw_idx = i;
        var field_temp = parseInt(turn_sections[i].substring(1));
        var multiplier_temp = MultiplierMap.get(
          turn_sections[i].substring(0, 1)
        );
        console.log("field: " + field_temp);
        console.log("multiplier: " + multiplier_temp);
        this.onThrow(field_temp, multiplier_temp);
      }
    }
    //console.log(turn_sections)
  }

  nextPlayer() {
    //deactivate old player
    this.players[this.selPlayerIndex].onTurnEnd();

    //activate new player
    this.activatePlayer(
      this.selPlayerIndex == this.players.length - 1
        ? 0
        : (this.selPlayerIndex += 1)
    );
  }

  activatePlayer(index) {
    this.throw_idx = 0;
    this.selPlayerIndex = index;
    this.players[this.selPlayerIndex].onTurnStart();
  }

  onLegEnd() {
    this.players[this.selPlayerIndex].onLegWon();

    //change remaining of all players to startscore
    this.players.forEach(function (item, index) {
      item.onNextLeg();
    });

    if (this.players[this.selPlayerIndex].legs == this.legs4set) {
      //set won
      this.onSetEnd();
    } else {
      //activate player to start next leg
      var index =
        this.lastLegStarter == this.players.length - 1
          ? 0
          : (this.lastLegStarter += 1);
      this.activatePlayer(index);
      this.lastLegStarter = index;
    }
  }

  onSetEnd() {
    // increase won sets of player
    this.players[this.selPlayerIndex].sets++;

    // set legs of all players to 0
    this.players.forEach(function (item, index) {
      item.legs = 0;
    });

    // activate player to start next set
    var index =
      this.lastSetStarter == this.players.length - 1
        ? 0
        : (this.lastSetStarter += 1);
    this.activatePlayer(index);
    this.lastSetStarter = index;
  }

  onOverthrow() {
    this.players[this.selPlayerIndex].onOverthrow();
  }
}
