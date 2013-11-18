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
        details: 'HD-sag: ' + location.href + '\n\r\n\r**Hvorfor:**\n\rBeskrivelse af det forretningsmæssige problem.\n\rF.eks. ”Opsætningsfejl har medført at kunder på Bibob Fri tale – 5 GB ikke har fået WiMP. Derfor skal vi pålægge tilvalgsydelsen med WiMP på disse kunder”.\n\r**Hvad:**\n\rBeskrivelse af hvad der skal ændres i databasen.\n\rF.eks.: ”Kunder med følgende kontotyper XX og YY, skal have pålagt tilvalgsydelsen med følgende id:NN.\n\r**Test:**\n\rBeskrivelse af hvordan databaseændringen kan valideres.\n\rF.eks. ”Stikprøvekontrol af de berørte kunder samt validering af det totale antal berørte kunder, der bør være ca. 150.”\n\r**Script:**\n\rHvis man allerede har et script til at finde de berørte kunder, så er det en god hjælp at skrive det til udvikleren. Så har man et udgangspunkt for at se, om man er enige om hvem der er de berørte kunder.',
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
