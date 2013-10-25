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

function setAjaxDefaults() {
    $.ajaxSetup({
        xhrFields: { withCredentials: true },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Zen-ApiKey", options.api_key);
        },
    });
};

function createAgileZenStory() {
    alert("api key: " + options.api_key + ", board#: " + options.board_number + ", agileZenApiUrl: " + agileZenApiUrl);
}

function setAgileZenApiUrl() {
    agileZenApiUrl = "https://agilezen.com/api/v1/projects/" + options.board_number + "/stories";
};

function addButton() {
    $("#submit-button").parent().append("<button id='create-agilezen-story-button' type='button' class='button primary'>Create AgileZen story</button>");

    $("#create-agilezen-story-button").click(createAgileZenStory);
}

setOptions(function () {
    addButton();

    setAjaxDefaults();

    setAgileZenApiUrl();
});

chrome.storage.onChanged.addListener(function () {
    setOptions(function () {
    });
});
