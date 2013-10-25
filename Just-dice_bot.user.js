// ==UserScript==
// @name         Just-dice bot
// @namespace    http://userscripts.org/users/535567
// @version      1
// @description  Just-dice.com b0t
// @match        https://just-dice.com/
// @grant        none
// ==/UserScript==

$(function() {
  
    /////////////////////////
    //     FUNCTIONS      ///
    /////////////////////////
    
    var setup = function() {
      // zero out bet to start
      $("#pct_bet").val("0");

      // hide unneccessary stuff
      $(".chatstat tr").eq(1).hide();
      $(".tabs").hide();
      $(".stats").hide();
      $(".bal_text").hide();
      
      // click my bet tab
      $("a[href='#me']").click();
      
      // add audio 
      $("body").append('<audio src="http://kaliara.com/ding1.ogg" id="fx_ding1" preload="auto" controls></audio>');
      fx_dings.push(document.getElementById("fx_ding1"));
      $("body").append('<audio src="http://kaliara.com/ding2.ogg" id="fx_ding2" preload="auto" controls></audio>');
      fx_dings.push(document.getElementById("fx_ding2"));
      $("body").append('<audio src="http://kaliara.com/ding3.ogg" id="fx_ding3" preload="auto" controls></audio>');
      fx_dings.push(document.getElementById("fx_ding3"));
      $("body").append('<audio src="http://kaliara.com/ding4.ogg" id="fx_ding4" preload="auto" controls></audio>');
      fx_dings.push(document.getElementById("fx_ding4"));
      $("body").append('<audio src="http://kaliara.com/ding5.ogg" id="fx_ding5" preload="auto" controls></audio>');
      fx_dings.push(document.getElementById("fx_ding5"));

      $("body").append('<audio src="http://kaliara.com/jackpot1.ogg" id="fx_jackpot1" preload="auto" controls></audio>');
      fx_jackpots.push(document.getElementById("fx_jackpot1"));
      $("body").append('<audio src="http://kaliara.com/jackpot1.ogg" id="fx_jackpot2" preload="auto" controls></audio>');
      fx_jackpots.push(document.getElementById("fx_jackpot2"));

      $("body").append('<audio src="http://kaliara.com/aww.ogg" id="fx_aww" preload="auto" controls></audio>');
      fx_aww = document.getElementById("fx_aww");

      // start and stop buttons
      $(".container").eq(2).find(".button_group").eq(2).after($(
        '<button id="start_button">Start</button>' +
        '<br/>' +
        '<button id="stop_button">Stop</button>'
      ));
      
      // add usd balance field
      $("#pct_balance").after('<br/><input class="balance_converted" value="loading..." type="text" />');

      // reset and convert initial values shortly after loading page
      setTimeout(function(){
        restartRally();      
        convertCurrency();
      }, 3000);
      
      // print good luck message
      console.debug("Good luck :)");
    },
  
    getLastRoll = function() {
      var result = $(".results .result.me").eq(0);
      var result_details = {
          bet_id: result.find(".betid a").html(),
          date: result.find(".when").html(),
          win: result.hasClass("win"),
          guaranteed: result.hasClass("gold") || result.hasClass("imp"),
          bet: result.find(".bet").text(),
          payout: result.find(".payout").text(),
          profit: result.find(".profit").text(),
      }
      
      // update rolling profits
      profit += parseFloat(result_details.profit.replace("$", ""));
      
      return result_details;
    },
    
    restartRally = function() {
      // empty rally
      rally = {};
      
      // update bet to minimum
      setBet(min_bet);
      $("#pct_bet").val(current_bet);
    },
    
    addRollToRally = function(roll) {
      // check to make sure we don't already have this roll
      if (rally[roll.bet_id] == undefined) {
        rally[roll.bet_id] = roll;
        return true;
      }
      else{
        return false;
      }
    },
    
    setBet = function(bet) {
      current_bet = bet;
      $("#pct_bet").val(bet);
    },
    
    rollDice = function() {
      $("#a_hi").click();
    },
    
    applyStrategy = function() {
      // bigtime bet when bigtime rally begins
      if(Object.keys(rally).length == rally_bigtime) {
        setBet(bigtime_bet);
      }
      // double bet during the bigtime rally
      else if(Object.keys(rally).length > rally_bigtime) {
        setBet(current_bet * multiplier);
      }      
    },

    submitBet = function() {
      // get last roll details
      var last_roll = getLastRoll();
      
      // if last roll won, restart rally
      if (last_roll.win) {
        
        // play sound effects for jackpot
        if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd * 2){
          console.debug("JACKPOT: " + last_roll.profit);
          fx_jackpots[0].play();
        }
        
        // play sound effects for big win
        else if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd){
          console.debug("BIG WIN: " + last_roll.profit);
          fx_dings[4].play();
        }
        
        // play sound effects for small wins
        else if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd / 2){
          console.debug("WIN: " + last_roll.profit);
          fx_dings[3].play();
        }
        else if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd / 4){
          console.debug("WIN: " + last_roll.profit);
          fx_dings[2].play();
        }
        else if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd / 8){
          console.debug("WIN: " + last_roll.profit);
          fx_dings[1].play();
        }
        else if(parseFloat(last_roll.profit.replace("$", "")) > big_win_usd / 16){
          console.debug("WIN: " + last_roll.profit);
          fx_dings[0].play();
        }
        
        // print how many bets it too
        if(Object.keys(rally).length > rally_bigtime){
          console.debug("Rally took " + (Object.keys(rally).length - rally_bigtime + 1) + " bets");
          console.debug("Profit: $" + profit.toFixed(2));
        }

        restartRally();
      }
      // if we've reached the max rally size, restart rally
      else if(Object.keys(rally).length > (rally_max - 1)) {
        $("#stop_button").click(); 
        restartRally();
        console.debug("hit max rally size of " + rally_max);
        console.debug("Profit: $" + profit.toFixed(2));
        fx_aww.play();
      }
      // add the last roll to the rally
      else{
        if(addRollToRally(last_roll)) {
          applyStrategy();
        }
      }

      // execute roll
      rollDice();
    },
    
    convertCurrency = function() {
      var initial, sign, converted, elements, selectors;
      
      // update usd balance
      $(".balance_converted").val($("#pct_balance").val());
      
      // add selectors to be converted
      selectors = ".results .profit .s1, .results .me .bet, .balance_converted";
      elements = $(selectors);
      
      // remove already converted elements
      elements = elements.not(".usd");
      
      // convert each element
      elements.each(function(){
        if($(this).hasClass("balance_converted")) {
          initial = $(this).val();
          converted = (initial * conversion_rate).toFixed(2);
          sign = (converted > 0 && !$(this).hasClass("bet")) ? "+" : "";
          $(this).val("$" + converted);
        }
        else{
          initial = parseFloat($(this).text());
          converted = (initial * conversion_rate).toFixed(4);
          sign = (converted > 0 && !$(this).hasClass("bet")) ? "+" : "";
          $(this).html("$" + sign + converted).addClass("usd");
        }
      });
    };
    
    
    /////////////////////////
    //   START  PROCESS   ///
    /////////////////////////
    
    // set defaults
    var min_bet = 0.000001,
        bigtime_bet = 0.00005,
        max_bet = null,
        multiplier = 2, 
        minutes_to_play = 60,
        rally = {}, 
        rally_bigtime = 5,
        rally_bets = 11, 
        rally_max = rally_bigtime + rally_bets,
        big_win_usd = 5,
        profit = 0,
        current_bet = min_bet,
        bet_interval,
        currency_interval,
        conversion_rate = 200,
        fx_dings = [],
        fx_jackpots = [],
        fx_aww;
    
    // run setup
    setup();
    
    // start the bot when clicking the start buttons
    $("#start_button").on("click", function(){
      setTimeout(function(){
        bet_interval = setInterval(submitBet, 2000);
      }, 1000);
    
      // convert currency to USD
      setInterval(convertCurrency, 300);
    
      // stop playing after timer done
      setTimeout(function(){ 
        clearInterval(bet_interval); 
        clearInterval(currency_interval); 
        console.debug("Times up!");
        console.debug("Profit: $" + profit.toFixed(2));
      }, (minutes_to_play * 60 * 1000));
    });

    // stop when hitting stop button
    $("#stop_button").on("click", function(){
      clearInterval(bet_interval); 
      clearInterval(currency_interval); 
    
      restartRally();
    });
});






