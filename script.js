var messages;
var input;
var username = "";
var channel = "None"
var chatroom = {data:{}};
var newdata = {};
var identifier = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);

function joinChannel() {
    const channel_input = document.getElementById("input1").value;
    const nickname_input = document.getElementById("input0").value;

    username = nickname_input
    try {
        $.ajax({
            type: "GET",
            url: `http://localhost:25565/api/chatrooms/${channel_input}/${identifier}`,
            success: function (data) {
                if (typeof data != "string") {
                    console.log("success");
                    channel = channel_input;
                    const theme = document.getElementById("theme");
                    theme.href = "style.css"

                    document.getElementById("channelname").innerHTML = channel_input;
                    document.getElementById("info").innerHTML = "Logged in as:<br>" + nickname_input;
                }
                else
                {
                    errorMessage("Channel doesn't exist. Try creating a new one.");
                }
            }
        });
    } catch (err) {errorMessage(err)}
}

function errorMessage(Text)
{
    var message = document.getElementById("error")
    message.innerHTML = Text;
    message.style.color = "red";
}

function successMessage(Text)
{
    var message = document.getElementById("error")
    message.innerHTML = Text;
    message.style.color = "#26C6DA";
}

function createChannel() {
    const channel_input = document.getElementById("input1").value;
    const nickname_input = document.getElementById("input1").value;
    const json = {"hash": channel_input};

    try {
        $.ajax({
            type: "GET",
            url: `http://localhost:25565/api/chatrooms/${channel_input}/${identifier}`,
            success: function (data) {
                if (typeof data != "string") {
                    errorMessage("Channel already exists.");
                }
                else
                {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:25565/api/chatrooms/",
                        contentType: "application/json",
                        data: JSON.stringify(json),
                        success: function (data) {
                            successMessage("Created a new channel.");
                        }
                    });
                }
            }
        });
    } catch (err) {errorMessage(err)}
}

window.onload = function(e) {
    messages = document.getElementById("messages");
    input = document.getElementById("textinput");

    input.addEventListener("keypress", function(e){
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            input.value = "";
        }
    });
}

function showMessage(name, timestamp, content, isError, errorMessage) {
    var scroll = false

    if (messages.scrollTop >= messages.scrollHeight - window.innerHeight - 72 - 70) {
        scroll = true;
    }
    const message = document.createElement("div");
    message.className = "message";
    const top = document.createElement("div");
    top.className = "top";
    message.append(top);
    messages.append(message);

    top.innerHTML = name + " (" + timestamp + ")<hr>" + content;

    if (isError) {
        top.style.color = "red";
        top.innerHTML += '<br><span class="error">¡' + errorMessage + "!</span>";
    }

    if (scroll) {
        messages.scrollTop = messages.scrollHeight;
    }
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
  }

function sendMessage() {
    if (input && input.value != "") {
        try {
            $.ajax({
                type: "PUT",
                url: `http://localhost:25565/api/chatrooms/${channel}/${identifier}/${encodeURIComponent(urlify(input.value))}/${username}`,
                success: function (data) {}
            });
        } catch (err) {
            showMessage(username, 0, input.value, true, err);
        }
    }
}

setInterval(function () {
    try {
        $.ajax({
            type: "GET",
            url: `http://localhost:25565/api/chatrooms/${channel}/${identifier}`,
            success: function (data) {
                newdata = data;
            }
        });
    } catch (err) {}
    
    if (newdata.hasOwnProperty("data")) {
        if (chatroom.data.length != newdata.data.length)
        {
            chatroom = newdata;
            messages.innerHTML = "";
            for (var i in chatroom.data) {
                var thedata = chatroom.data[i]
                var newDate = new Date();
                newDate.setTime(thedata.timestamp);
                var dateString = newDate.toUTCString();
                newDate.setTime(thedata.timestamp);
                showMessage(thedata.nickname, dateString, thedata.message);
            }
        };
    }
}, 50);