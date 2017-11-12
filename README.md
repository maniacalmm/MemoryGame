## Memory Game
Memory game is a simply card-flip game based on your browser!!.

## Resources
index.html, script.js, css/styles.css are the three main files for the game to work.

img folder contains image necessary for the card for display.
Player can choose to replace these images of his/her own if he/she so desire.

Jquery is used for this game.

## Installation
Clone this repo to your local machine, and open the index.html in your browser.(Google Chrome preferably)
~~~
https://github.com/maniacalmm/MemoryGame.git
~~~


## How the game work
Memory game, flip two card at the time, if the two are the same, stay flipped, otherwise, fold back.

Intial dimension of the game is 4x4, thus inside the img folder, 8 images are used for the cards(log_1.png -> log_8.log).

Little circle on top is the reset button, if clicked, all cards will fold back, and the timer and score will be reset to zero, player need to click the button first time playing.

During the game, if the two cards are not the same, then the two cards will fold back when the cursor is <em>moved outside of the cell</em>.

When successfully completing the game, a pop-up windows will appear giving the game stats to the player and asking if he/she want another round.

Stars at the left-top corner represents how good you are at this game, smaller number of flips you made, higer the star you get.


