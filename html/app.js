var WebView = {}
var mouseOver = false;
var selectedIdentity = null;
var selectedIdentityType = null;
var selectedJob = null;
var selectedJobId = null;

WebView.Open = function(data) {
    $(".container").fadeIn(150);
}

WebView.Close = function() {
    $(".container").fadeOut(150, function(){
        WebView.ResetPages();
    });
    $.post('https://Web-View/close');

    $(selectedJob).removeClass("job-selected");
    $(selectedIdentity).removeClass("job-selected");
}

WebView.ResetPages = function() {
    $(".webview-option-blocks").show();
    $(".webview-identity-page").hide();
    $(".webview-job-page").hide();
}

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "open":
                WebView.Open(event.data);
                break;
            case "close":
                WebView.Close();
                break;
        }
    })
});

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESC
            WebView.Close();
            break;
    }
});

$('.webview-option-block').click(function(e){
    e.preventDefault();

    var blockPage = $(this).data('page');

    $(".webview-option-blocks").fadeOut(100, function(){
        $(".webview-"+blockPage+"-page").fadeIn(100);
    });

    if (blockPage == "identity") {
        $(".identity-page-blocks").html("");
        $(".identity-page-blocks").html('<div class="identity-page-block" data-type="id_card"><p>Birth Certificate</p></div>');

        $.post('https://Web-View/requestLicenses', JSON.stringify({}), function(licenses){
            $.each(licenses, function(i, license){
                var elem = '<div class="identity-page-block" data-type="'+license.idType+'"><p>'+license.label+'</p></div>';
                $(".identity-page-blocks").append(elem);
            });
        });
    }
});

$(document).on("click", ".identity-page-block", function(e){
    e.preventDefault();

    var idType = $(this).data('type');

    selectedIdentityType = idType;

    if (selectedIdentity == null) {
        $(this).addClass("identity-selected");
        $(".hover-description").fadeIn(10);
        selectedIdentity = this;
        if (idType == "id_card") {
            $(".request-identity-button").fadeIn(100);
            $(".request-identity-button").html("<p>Click Here to Buy a Birth Certificate for $50</p>")
        } else if (idType == "driver_license") {
            $(".request-identity-button").fadeIn(100);
            $(".request-identity-button").html("<p>Click Here to Buy a Driver License for $50</p>")
        } else if (idType == "weaponlicense") {
            $(".request-identity-button").fadeIn(100);
            $(".request-identity-button").html("<p>Click Here to Buy a Firearms License for $50</p>")
        }
    } else if (selectedIdentity == this) {
        $(this).removeClass("identity-selected");
        selectedIdentity = null;
        $(".request-identity-button").fadeOut(100);
    } else {
        $(selectedIdentity).removeClass("identity-selected");
        $(this).addClass("identity-selected");
        selectedIdentity = this;
        if (idType == "id_card") {
            $(".request-identity-button").html("<p>You paid $50 for a Birth Certificate</p>")
        } else if (idType == "driver_license") {
            $(".request-identity-button").html("<p>You paid $50 for a Driver License</p>")
        } else if (idType == "weaponlicense") {
            $(".request-identity-button").html("<p>You paid $50 for a Firearms License</p>")
        }
    }
});

$(".request-identity-button").click(function(e){
    e.preventDefault();

    $.post('https://Web-View/requestId', JSON.stringify({
        idType: selectedIdentityType
    }))

    WebView.ResetPages();
});

$(document).on("click", ".job-page-block", function(e){
    e.preventDefault();

    var job = $(this).data('job');

    selectedJobId = job;

    if (selectedJob == null) {
        $(this).addClass("job-selected");
        selectedJob = this;
        $(".apply-job-button").fadeIn(100);
    } else if (selectedJob == this) {
        $(this).removeClass("job-selected");
        selectedJob = null;
        $(".apply-job-button").fadeOut(100);
    } else {
        $(selectedJob).removeClass("job-selected");
        $(this).addClass("job-selected");
        selectedJob = this;
    }
});

$(document).on('click', '.apply-job-button', function(e){
    e.preventDefault();

    $.post('https://Web-View/applyJob', JSON.stringify({
        job: selectedJobId
    }))

    WebView.ResetPages();
});

$(document).on('click', '.back-to-main', function(e){
    e.preventDefault();

    $(selectedJob).removeClass("job-selected");
    $(selectedIdentity).removeClass("job-selected");

    WebView.ResetPages();
});
