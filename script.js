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
    if (flip1 != null && flip2 != null) {
        if (flip1.getAttribute('src') === flip2.getAttribute('src')) {
            targets++;
            if (targets == dimension * dimension / 2) {
                completion(); // completed
                targets = 0;
            }
        } else {
            console.log('not a match!');
            console.log(flip1.classList + " " + flip2.classList);
            $(flip1).removeClass('show');
            $(flip2).removeClass('show');
            $(flip1).addClass('pre_show');
            $(flip2).addClass('pre_show');
            console.log($(flip1).attr('class'));
        }
        console.log('about to delete');
        flip1 = null;
        flip2 = null;
    }
}

function showCard(card) {
    $(card).removeClass('pre_show');
    $(card).addClass('show');
}

/************************ close all cards ****************/
function resetCard() {
    console.log('reseting cards');
    $('#canvas').find('tr').each(function() {
        $(this).find('td').each(function() {
            $(this).find('img').removeClass('show');
        });
    });
}

/******************** reset and shuffle card *************/
function shuffleGrid(dimension) {
    moves = 0;
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
}
/******************* create the intial grid *********************/
// input has to be an even number, other wise it won't work
function createGrid(dimension) {
    // generate images, and shuffle them
    let imgNumber = dimension * dimension / 2;
    let tmpImg = imageGenerator(imgNumber);

    $('#star').html(threeStar);

    for (let i = 0; i < dimension; i++) {
        let row = document.createElement('tr');
        $('#canvas').append(row);
        for (let j = 0; j < dimension; j++) {
            let imgDiv = document.createElement('td');
            let img = document.createElement('img');

            img.setAttribute('src', tmpImg.pop());
            imgDiv.setAttribute('class', 'card');

            imgDiv.addEventListener('click', function() {
                let len = img.classList.length;

                if (len == 1 && img.classList[0] == 'pre_show' && start) { // this one is not open yet
                    if (start) {
                        moves++;        // counting the valid move
                        moveAndStar(moves);
                    }

                    console.log('show cards');
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

function getStar(moves) {
    if (moves > 64) return oneStar;
    else if (moves > 32) return twoStar;
    else return threeStar;
}

function moveAndStar(moves) {
    changeValue('move', moves);
    changeValue('star', getStar(moves));
}

function changeTime() {
  document.getElementById("timer").innerHTML = ++timeElapse;
}

function changeValue(id, value) {
    document.getElementById(id).innerHTML = value;
}

var timerInterval = null;
function timerCount() {
  stop(); // stoping the previous counting (if any)
  timeElapse = 0;
  timerInterval = setInterval(changeTime, 1000);
}
var stop = function() {
  clearInterval(timerInterval);
}

function addpre_show() {
    $('#canvas').find('tr').each(function() {
        $(this).find('td').each(function() {
            console.log('something');
            $(this).find('img').addClass('pre_show');
            console.log($(this).find('img').attr('class'));
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

$('#reset').on('mouseleave', addpre_show());

// monitoring reset button
$('#reset').on('click', function() {
    timerCount();
    start = true;
    shuffleGrid(dimension);
});


/********* popup button --> another round *********/
$('#popupbtn').click(function() {
    shuffleGrid(dimension);
    $('#popup').css('display', 'none');
    timerCount();
    start = true;
    addpre_show();
});

$('#testbtn').click(function() {
    completion();
});






