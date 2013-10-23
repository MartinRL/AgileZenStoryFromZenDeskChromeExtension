﻿$(document).ready(function () {
    var saveOptions = function () {
        chrome.storage.sync.set({
            "api_key": $("#api_key").val(),
            "board_number": $("#board_number").val()
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
            });
    };

    $("#save").click(saveOptions);
    restoreOptions();
});
