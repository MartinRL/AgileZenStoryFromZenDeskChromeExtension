function createAgileZenStory() {
    alert("hello zd!");
}

function addButton() {
    $("#submit-button").parent().append("<button id='create-agilezen-story-button' type='button' class='button primary'>Create AgileZen story</button>");

    $("#create-agilezen-story-button").click(createAgileZenStory);
}

addButton();
