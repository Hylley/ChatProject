const container = document.getElementById('message-containter');

var socket = io()
socket.on('connect', function(){
    console.log('Successfully connected to the server.')
})

function SendMessage(user, text, pfp)
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    }

    http.open('POST', `/send`, true);

    let params = new FormData()
    params.append('user', user)
    params.append('text', text)
    params.append('profile', pfp)

    http.send(params);
}

function LoadMessages()
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            UnpackMessages(JSON.parse(this.responseText));
        }
    }

    http.open('GET', '/resume', true);
    http.send()
}

function UnpackMessages(messages)
{
    console.log(messages)
    for(key in messages)
    {
        let datetime = new Date(messages[key]['datetime'])

        container.appendChild(
            InsertMessage(messages[key]['user'], messages[key]['content'], messages[key]['profile'], `${datetime.getHours()}:${datetime.getMinutes()}`)
        );

        most_recent_message_datetime = messages[key]['datetime'];
    }
}

LoadMessages();
socket.on('fetch', function(data){
    dict = {
        0: data
    }
    UnpackMessages(dict);
});