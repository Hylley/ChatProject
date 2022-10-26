const container = document.getElementById('message-containter');

MESSAGE_FETCH_DELAY = 3

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
}

function FetchNewMessages()
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            LoadMessages(this.responseText);
        }
    }

    http.open('GET', `${document.URL}/fetch`, true);
    http.send()
}

setInterval(
    FetchNewMessages,
    MESSAGE_FETCH_DELAY * 1000
)