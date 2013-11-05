
// Add event listener to reveal.js slide changes
Reveal.addEventListener('slidechanged', function(event) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
    
    // Set search input query on current slide from data attribute
    $('#resultspage-search-input').val(
        $(event.currentSlide).attr('data-search')
    );

    $('#frontpage-search-input').val(
        $(event.currentSlide).attr('data-search-frontpage')
    );

    if ($(event.currentSlide).attr('data-search-tools')) {
        $('#search-tools').addClass('tools-hilight');
    }
    else {
        $('#search-tools').removeClass('tools-hilight');
    }
});

Reveal.addEventListener('fragmentshown', function(event) {
    // event.fragment = the fragment DOM element
    
    // Type query into frontpage search input from data attribute
    var search = $(event.fragment).attr('data-input-frontpage-search');
    if (search) {
        typeInput(
            search,
            $('#frontpage-search-input')[0]
        ).done(function() {
            setTimeout(Reveal.next, 500);
        });
    }

    // Type query into search input from data attribute
    var search = $(event.fragment).attr('data-input-search');
    if (search) {
        typeInput(
            search,
            $('#resultspage-search-input')[0]
        ).done(function() {
            setTimeout(Reveal.next, 500);
        });
    }

    // Paste query into search input from data attribute
    var search = $(event.fragment).attr('data-paste-search');
    if (search) {
        eraseTextFromInput(
            $('#resultspage-search-input')[0],
            true
        ).done(function() {
            setTimeout(function () {
                $('#resultspage-search-input').val(search);
                setTimeout(Reveal.next, 500);
            }, 1000);
        });
    }
});

// "Type" text into a text input field
function typeInput(text, inputElement)
{
    var deferred = $.Deferred();

    $(inputElement).focus().val($(inputElement).val());

    setTimeout(
        function() {
            eraseTextFromInput(
                inputElement,
                true
            ).done(function() {
                typeTextToInput(text, inputElement)
                .done(function() {
                    $(inputElement).blur();
                    deferred.resolve();
                });
            });
        },
        400
    );

    return deferred.promise();
}

function typeTextToInput(text, inputElement)
{
    var deferred = $.Deferred();

    if (text.length <= 0) return;

    $(inputElement).val($(inputElement).val() + text.charAt(0));

    var remainingText = text.substring(1);

    if (remainingText.length > 0) {
        setTimeout(function(){
            typeTextToInput(remainingText, inputElement).done(deferred.resolve)
        }, randomBetween(50, 250));
    }
    else {
        deferred.resolve();
    }

    return deferred.promise();
}

function eraseTextFromInput(inputElement, first)
{
    var deferred = $.Deferred();

    var text = $(inputElement).val();

    var remainingText = text.substring(0, (text.length - 1));

    if (text.length > 0) {
        $(inputElement).val(remainingText);
    }

    var timeout = (first) ? 500 : 30;

    if (remainingText.length > 0) {
        setTimeout(function(){
            eraseTextFromInput(inputElement).done(deferred.resolve)
        }, timeout);
    }
    else {
        deferred.resolve();
    }

    return deferred.promise();
}

function randomBetween(from,to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function googleSearch()
{
    var url = 'http://google.com/search?q='
            + $('#resultspage-search-input').val();

    var tab = window.open(url, '_blank');
    
    tab.focus();
}
