var show;

function intialization() {
    var cards = $('#canvas').find('.card').toArray();
    cards.forEach(function(elem) {
        elem.addEventListener('click', function() {
            let img = $(elem).find('img').toArray()[0];
            $(elem).find('img').toggleClass('show');
            console.log(img.getAttribute('src'));
        });
    });
    console.log(cards);
}

intialization();
/*
                function() {
                    $(elem).find('img').toArray()[0].classList.remove('show');
                }
                */