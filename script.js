var options;
var ALL = null;
var agileZenApiUrl;

function setOptions(continuation) {
    chrome.storage.sync.get(ALL,
        function (opt) {
            options = opt;
            continuation();
        });
};

function createAgileZenStory() {
    if (options.board_number === undefined || options.api_key === undefined || options.user_name === undefined) {
        $("#createAgilezenStatus").html("Couldn't create story due to missing options data. Please, add the missing data <a href='" + chrome.extension.getURL("options.html") + "' target='_blank'>here</a>, and try again.");

        return;
    }

    var data = JSON.stringify({
        owner: options.user_name,
        text: isOldUI() ? $('#ticket_subject').val() : $('.editable').first().children().first().val(),
        details: 'HD-sag: ' + location.href + '\n\r\n\r**Hvilke forretningsområder berøres?**\n\rF.eks. ”Opsætningsfejl har medført at kunder på Bibob Fri tale – 5 GB ikke har fået WiMP. Derfor skal vi pålægge tilvalgsydelsen med WiMP på disse kunder”. Eller knap xxx eller funktionalitet yyy fejler/virker ikke.\n\r\n\r\n\r**Problemet der skal løses**\n\r * DB-sager. Kunder der skal undersøges, div. Udtræk vi ikke selv kan strikke sammen, eller updates/inserts/deletes af database-indhold.\n\r * Systemfejl. Fejl i systemets funktioner. Knapper der ikke virker, services der ikke behandler kunderne korrekt, nedbrud, fejlbeskeder m.v.\n\r\n\r**Tillægsinformation**\n\rHvis man allerede har et script/screen dump eller andet der kan opsummere problemet/finde de berørte kunder eller belyser problemet, så er det en god hjælp at skrive/vedhæfte det til udvikleren. Så har man et udgangspunkt for at se, så man er enige om hvad problemet er eller hvem der er de berørte kunder.\n\r\n\r**Test**F.eks. ”Stikprøvekontrol af de berørte kunder eller funktionel test af eventuelle implementeret løsninger. Ved scripts kan man f.eks. validere af det totale antal berørte kunder, at der bør være ca. 150.”\n\r\n\r**Forventet resultat**\n\rHvad er det ønskede slutresultat, hvor mange kunder berøres samt mulig tilstand, eller en beskrivelse af hvad forretningen forventer af denne rettelse.',
        tags: [ 'slack' ]
    });
    
    $.ajax({
        type: 'POST',
        url: 'https://agilezen.com/api/v1/projects/' + options.board_number + '/stories',
        data: data,
        headers: { "X-Zen-ApiKey": options.api_key },
        })
        .success(function(response) {
            $("#createAgilezenStatus").html('The story was created succesfully, and can be found <a href="https://agilezen.com/project/' + options.board_number + '/story/' + response.id + '" target="_blank">here.</a>');
        })
        .error(function (event, jqxhr, settings, exception) {
            alert("event: " + event + ", jqxhr: " + jqxhr + ", settings: " + settings + ", exception: " + exception + ", data: " + data);
        });
}

function setAgileZenApiUrl() {
    agileZenApiUrl = "https://agilezen.com/api/v1/projects/" + options.board_number + "/stories";
};

function isOldUI() {
    return location.href.indexOf("agent") === -1;
}

function addButton() {
    if (isOldUI()) {
        $("#submit-button").parent().append("<button id='create-agilezen-story-button' type='button' class='button primary'>Create AgileZen story</button>");
    
        $("#submit-button").parent().append("<div id='createAgilezenStatus'></div>");

        $("#create-agilezen-story-button").click(createAgileZenStory);
    } else {
        if ($('.editable')[0] === undefined) {
            window.setTimeout(addButton, 300);
        } else {
            $('.ember-view.btn-group.dropup.ticket_submit_buttons.status_button').parent().append("<span id='createAgilezenStatus'></span>");

            var parentOfSaveButton = $('.save.btn').first().parent();
            parentOfSaveButton.append('<button id="create-agilezen-story-button" class="save btn btn-inverse">Create AgileZen story</button>');
            
            $("#create-agilezen-story-button").click(createAgileZenStory);
        }
    }
}

setOptions(function() {
    addButton();
    
    setAgileZenApiUrl();
});

chrome.storage.onChanged.addListener(function () {
    setOptions(function () {
    });
});
