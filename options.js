$(document).ready(function () {
    var saveOptions = function () {
        chrome.storage.sync.set({
            "api_key": $("#api_key").val(),
            "board_number": $("#board_number").val(),
            "user_name": $("#user_name").val(),
            "zendesk_email": $("#zendesk_email").val(),
            "zendesk_password": $("#zendesk_password").val(),
        });

        var status = $("#status");
        status.html("options saved");
        setTimeout(function () {
            status.html("");
        }, 750);
    };

    var restoreOptions = function () {
        chrome.storage.sync.get(null,
            function (options) {
                $("#api_key").val(options.api_key);
                $("#board_number").val(options.board_number);
                $("#user_name").val(options.user_name);
                $("#zendesk_email").val(options.zendesk_email);
                $("#zendesk_password").val(options.zendesk_password);
            });
    };

    $("#save").click(saveOptions);
    restoreOptions();
});
