// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = "1007266508728-3fk0oe6asdnunutr3ljecg2llcvb6ibe.apps.googleusercontent.com";

var SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.member'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
}

function addAllEmails() {
    var encodedGroupAddress = document.getElementById("group-address").value;
    var emails = document.getElementById("emails").value.split("\n");
    var completedDiv = document.getElementById("success");
    var errorMessageDiv = document.getElementById("error-messages");
    var errorEmailDiv = document.getElementById("error-emails");

    var batch = gapi.client.newBatch();
    emails.forEach(function (email) {
        email = email.trim();
        if (email == "") {
            return;
        }
        var request = addToList(email, encodedGroupAddress);
        batch.add(request);
        request.then(function (response) {
                completedDiv.innerHTML += email + "<br/>";
            },
            function (error) {
                var errorText = JSON.parse(error.body)["error"]["errors"][0]["message"];
                errorEmailDiv.innerHTML += email + "<br/>";
                errorMessageDiv.innerHTML += errorText + "<br/>";
            }
        );
    });
    //batch.execute() does not run the handlers above
    batch.then(function (response) {
    });
}

var addToList = function (email, encodedGroupAddress) {
    return gapi.client.request(
        {
            'path': 'admin/directory/v1/groups/' + encodedGroupAddress + '/members',
            'method': 'POST',
            'body': {'email': email}
        });
}
