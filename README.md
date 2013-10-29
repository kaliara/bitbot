BitBot
======
BitBot is an automated betting bot for Just-Dice. It utilizes GreaseMonkey to run the betting the browser.

##Betting strategy
The current betting strategy is this: after 5 consecutive losses, increase the bet to a new "bigtime" bet and double the bet until you win (up to a max of 10 bets). This strategy can be changed by modifying configs and the `applyStrategy` method.

##Features
* Configurable betting strategy
* Sound effects for big wins
* Results and total cash on hand is converted to USD
* Helpful `console.log` messages that show running profits (only prints after rallies)
* Ability to set a time limit so you don't bet too much

##Configuration
__rally__: a betting session

__rally_bigtime__: number of initial consecutive losses are needed before starting a rally

__rally_bets__: number of bets to place until winning during a rally

__min_bet__: initial minimum bet amount (before rally)

__bigtime_bet__: starting bet amount during a rally

__multiplier__: how much the bet is multiplied by after each loss during a rally 

__minutes_to_play__: number of time to play (in minutes)

__big_win_usd__: what is considered a "bigwin" (used for sound effects)

__profit__: object used to store running profits

__current_bet__: object used to store current bet

__bet_interval__: object used to store the betting interval for the `setInterval` method

__currency_interval__: object used to store the betting interval for the `setInterval` method

__conversion_rate__: current conversion rate of BTC to USD

__fx_dings__: object used to store sound effects (small wins)

__fx_jackpots__: object used to store sound effects (big wins)

__fx_aww__: object used to sound effects (big loss)
