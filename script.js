var options;
var ALL = null;

function setOptions(continuation) {
    chrome.storage.sync.get(ALL,
        function (opt) {
            options = opt;
            continuation();
        });
};

function createAgileZenStory() {
    alert("api key: " + options.api_key + ", board#: " + options.board_number);
}

function addButton() {
    $("#submit-button").parent().append("<button id='create-agilezen-story-button' type='button' class='button primary'>Create AgileZen story</button>");

    $("#create-agilezen-story-button").click(createAgileZenStory);
}

setOptions(addButton);
