const container = document.getElementById('message-containter');
const MESSAGE_FETCH_DELAY = 1

var most_recent_message_datetime = null

function NewMessage(user, content, time)
{
    let message = document.createElement('div');
    message.classList.add('message')
    message.innerHTML = `
        <img src="https://media.tenor.com/DuThn51FjPcAAAAC/nerd-emoji-nerd.gif"/>
        <h3>${user} <span>${time}</span></h3>
        <p>${content}</p>
    `;

    return message;
}

function LoadMessages(messages)
{
    console.log(messages)
    for(key in messages)
    {
        let datetime = new Date(messages[key]['datetime'])

        container.appendChild(
            NewMessage(messages[key]['user'], messages[key]['content'], `${datetime.getHours()}:${datetime.getMinutes()}`)
        );

        most_recent_message_datetime = messages[key]['datetime'];
    }
}

function FetchNewMessages()
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            LoadMessages(JSON.parse(this.responseText));
        }
    }

    http.open(
        'GET',
        most_recent_message_datetime ?
            `${document.URL}/fetch?since=${most_recent_message_datetime}`
            : 
            `${document.URL}/fetch`,
        true
    );
    http.send()
}

setInterval(
    FetchNewMessages,
    MESSAGE_FETCH_DELAY * 1000
)