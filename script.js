'use strict';

var Pomodoro = (function(){

  var my = {};

  /* Variables & States */
  var myInterval = null;
  var state = ''; // States => '', work, break, long & stop*
  var checkMark = 0;
  var url = 'https://s3.amazonaws.com/codepen-njmyers/pomodoro/';

  my.countDown = {'minutes': 0, 'seconds': 0};
  my.time = {'work' : 25, 'break' : 5, 'long' : 25};
  my.break = {'short': 5, 'long': 15};

  function addTime(x, type) {
    my.time[type] += x;
    displayCounter(type);    
  }

  /* Methods for initializing countdown with different timer lengths */

  function stateSwitcher(myState) {
    return function() {
      if (state === stop || !state);
      else ding();
      displayState(myState);
      state = myState;
      my.countDown.minutes = my.time[myState];
      if (state === 'long') checkMark = 0;
    }    
  }

  var breakInit = stateSwitcher('break');
  var workInit = stateSwitcher('work');
  var longInit = stateSwitcher('long');

  /* Methods for start/stop/clear buttons */

  function startTimer() {
    let reg = /stop/gi;
    state = state.replace(reg, '');
    myInterval = setInterval(counter, 1000);
    toggleButton();
  }

  function stopTimer() {
    clearInterval(myInterval);
    state = 'stop' + state;
    //console.log(state);
    toggleButton();
  }

  function clearTimer() {
    clearInterval(myInterval);
    my.countDown.minutes = 0;
    my.countDown.seconds = 0;
    my.time.work = 25;
    my.time.break = 5;
    myInterval = null;
    state = '';
    checkMark = 0;
    if ($('#start-the-timer').text() == 'stop') toggleButton();
    displayTimer();
    displayCounter('work');
    displayCounter('break');
    resetTomato();
    displayState('');
  }

  function degreeCalc(state) {
    let deg = ( (my.countDown.minutes * 60 + my.countDown.seconds) / (my.time[state] * 60) * 360 );
    deg = 360 - deg;
    return deg;
  }

/* Logic of countDown */

  function counter() {
  // initial state
    if (!state) {
      checkMark ++;
      workInit();
    }
  // check for long break
    if (checkMark >= 4) {
      longInit();
    }
  // set break or work state when clock reaches zero
    if (!my.countDown.seconds && !my.countDown.minutes) {
      if (state === 'long' || state === 'break') {
        checkMark ++;
        workInit();
      }
      else {
        breakInit();
      }
    }
    else if (state === 'stop') state = 'work';
  // Timer function
    if (!my.countDown.seconds) {
      my.countDown.seconds = 60;
      my.countDown.minutes --;
    }
    my.countDown.seconds --;
    click();
    rotateTomato(state);
    displayTimer(); // Display the clock movement
  }

  function displayState(theState) {
    let reg = /[A-Z]/g;
    function formatter(match) {
      return ' ' + match.toLowerCase();
      }
    let formatText = theState.replace(reg, formatter);
    console.log(formatText);
    $('#state-display').html(formatText);
  }

  function twoDigit(number) {
    let x = number >= 10 ? number : '0' + number;
    return x;
  }


  /* JQuery Display functions */

  function displayTimer() {
    let text = my.countDown.minutes + ':' + twoDigit(my.countDown.seconds);
    $('#count-down-display').html(text);
  }

  function displayCounter(type) {
    let text = my.time[type];
    $('#' + type + '-display').html(text);
  }

  function toggleButton() {
    let buttonText = $('#start-the-timer').text();
    if (buttonText === 'start') buttonText = 'stop';
    else buttonText = 'start';
    $('#start-the-timer').text(buttonText);
  }

  function rotateTomato(state) {
    let cssClass = 'rotate(' + degreeCalc(state) + 'deg)';
    //console.log(cssClass)
    $('#rotate-tomato').css('transform', cssClass);
  }

  function resetTomato () {
    $('#rotate-tomato').css('transform', 'rotate(0deg)');  
  }

  /* JQuery Sound Functions */

  function click() {
    let a = new Audio(url + 'click.mp3');
    a.play();
  }

  function ding() {
    let a = new Audio(url + 'ding.mp3');
    a.play();
  }

  /* Click Functions */

  function clickStart() {
    $(document).ready(function(){
      $('#start-the-timer').click(function() {
        let reg = /stop/gi;
        if (!state || reg.exec(state)) return startTimer();
        else return stopTimer();
      });
    });
  }

  function clickMaker(direction, type) {
    $(document).ready(function() {
      $('#' + direction + '-time-' + type).click(function() {
        direction === 'add' ? addTime(1, type) : addTime(-1, type)
      });
    });
  }

  function clickClearTimer() {
    $(document).ready(function() {
      $('#clear-the-timer').click(function() {
        clearTimer();
      });    
    });
  }

  function init() {
    clickMaker('add', 'work');
    clickMaker('subtract', 'work');
    clickMaker('add', 'break');
    clickMaker('subtract', 'break');
    clickClearTimer();
    clickStart();
    $(document).ready(function() {
      displayTimer();
      displayCounter('work');
      displayCounter('break');  
    });
  }

  init()

  return my

})();