/*
Card flip is done by adding or moving the class for img element
show class shows the card
pre_show class is the folding effect
*/


var imgPath = 'img/';
var dimension = 4;
var flip1 = null;
var flip2 = null;
var start = false;
var timeElapse = 0;
var moves = 0;
var targets = 0;
var oneStar = "&#9734";
var twoStar = "&#9734 &#9734";
var threeStar = "&#9734 &#9734 &#9734";

/******************* generate random card name sequence *********/
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

function imageGenerator(totalPictureNumber) {
    var images = [];
    for (let i = 1; i <= totalPictureNumber; i++) {
        // every image is a pair, double push
        let name = imgPath + "log_" + i +".png";
        images.push(name);
        images.push(name);
    }
    shuffle(images);
    return images;
}

/************************* when both cards are flipped, decision making *****/
function flipBack() {
    if (flip1 != null && flip2 != null) { // if there are two cards flipped
        if (flip1.getAttribute('src') === flip2.getAttribute('src')) { // if the two matches
            targets++;      //increase the flipped count
            if (targets == dimension * dimension / 2) {
                completion(); // completed
                targets = 0;
            }
        } else {            // two cards does not match, flip back
            $(flip1).removeClass('show');
            $(flip2).removeClass('show');
            $(flip1).addClass('pre_show');
            $(flip2).addClass('pre_show');
        }
        flip1 = null;
        flip2 = null;
    }
}

function showCard(card) {
    $(card).removeClass('pre_show');
    $(card).addClass('show');
}

/************************ close all cards ****************/
// resetCard is used to fastly close all the card when reset button is clicked
function resetCard() {
    $('#canvas').find('tr').each(function() {
        $(this).find('td').each(function() {
            $(this).find('img').removeClass('show');
        });
    });
}

/******************** reset and shuffle card *************/
// in shuffleGrid, we generate a new sequence of card, and replace the current grid with the
// the new one
function shuffleGrid(dimension) {
    moves = 0;
    timeElapse = 0;
    resetCard();

    changeValue('timer', 0);
    changeValue('move', moves);
    changeValue('star', threeStar);
    let imgNumber = dimension * dimension / 2;
    let tmpImg = imageGenerator(imgNumber);

    console.log('shuffling cards');
    $('#canvas').find('tr').each(function() {
        $(this).find('td').each(function() {
            $(this).find('img').attr('src', tmpImg.pop());
        });
    });

    stop(); // stop the timer
    flip1 = null;
    flip2 = null;

}
/******************* create the intial grid *********************/
// input has to be an even number, other wise it won't work
function createGrid(dimension) {
    // generate images, and shuffle them
    let imgNumber = dimension * dimension / 2;
    let tmpImg = imageGenerator(imgNumber);

    $('#star').html(threeStar);

    // two for-loops to generate the overall grid
    for (let i = 0; i < dimension; i++) {
        let row = document.createElement('tr');
        $('#canvas').append(row);
        for (let j = 0; j < dimension; j++) {
            let imgDiv = document.createElement('td');
            let img = document.createElement('img');

            img.setAttribute('src', tmpImg.pop());
            imgDiv.setAttribute('class', 'card');

            // adding eventlistener to each td cell
            imgDiv.addEventListener('click', function() {
                let len = img.classList.length;
                console.log('clicked: ' + len + " " + img.classList[0] + " " + start);
                if (len == 1 && img.classList[0] == 'pre_show' && start) { // this one is not open yet
                    if (start) { // start represent if the start/reset button has been pushed
                        moves++;        // counting the valid move
                        if (moves == 1) timerCount();
                        moveAndStar(moves);
                    }
                    showCard(img);
                    if (flip1 == null) flip1 = img;
                    else flip2 = img;
                }
            });

            imgDiv.append(img);
            row.append(imgDiv);
        }
    }
}


/********************** Success effect  *****************************************/
function completion() {
    changeValue('popup_time', timeElapse);
    changeValue('popup_star', getStar(moves));
    $('#popup').css('display', 'block');
}

/**********************  Timer & moves accumulator function  ********************/
// below 32 moves --> 3 stars
// 32 - 64 --> 2 star;
// above 64 --> 1 star;


// calculate start from the moves made by player
function getStar(moves) {
    if (moves > 64) return oneStar;
    else if (moves > 32) return twoStar;
    else return threeStar;
}


// to update moves and star according to the moves made
function moveAndStar(moves) {
    changeValue('move', moves);
    changeValue('star', getStar(moves));
}

/****************** Timer function ********************/
// timer function is essentially based on setInterval function
// which is built-in in javascript
var timerInterval = null;
function timerCount() {
    console.log('timer called ' + moves);
  stop(); // stoping the previous counting (if any)
  timeElapse = 0;
  timerInterval = setInterval(changeTime, 1000);
  console.log('setInterval: ' + timerInterval);
}

// to stop the counting using clearInterval
var stop = function() {
    console.log("stopping clock : " + timerInterval);
    if (timerInterval != null)
        clearInterval(timerInterval);
    console.log('stopped clock: ' + timerInterval);
}

// change time function by updating the html file directly
function changeTime() {
  document.getElementById("timer").innerHTML = ++timeElapse;
}
/*****************************************************/

// change the value of html give the id and value we want to change
function changeValue(id, value) {
    document.getElementById(id).innerHTML = value;
}


// add the flipping class
function addpre_show() {
    $('#canvas').find('tr').each(function() {
        $(this).find('td').each(function() {
            //console.log('something');
            console.log($(this).find('img').attr('class'));
            if (!$(this).find('img').hasClass('show')
                && !$(this).find('img').hasClass('pre_show'))
                $(this).find('img').addClass('pre_show');
            //console.log($(this).find('img').attr('class'));
        });
    });
}
/********************************** start the game *********************************/
createGrid(dimension); // intialized the grid

// monitoring any change over <td>
// if this one is set to click, then the picture won't appear before disappear
// no solution yet
$('td').on('mouseleave', function() {
    setTimeout(flipBack(), 1000);
});

// upon leaving the button, pre_show class is added to all the img cell
$('#reset').on('mouseleave', function() {
    addpre_show();
});

// monitoring reset button
$('#reset').on('click', function() {
    start = true;
    shuffleGrid(dimension);
});


/********* popup button --> another round *********/
$('#popupbtn').click(function() {
    shuffleGrid(dimension);
    $('#popup').css('display', 'none');
    //stop();
    start = true;
    addpre_show(); // the next around can be directly started without touching the reset button
});






