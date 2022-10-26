const names = ['Hylley', 'Jester', 'Rock', 'Cloud', 'Lisa', 'Popo', 'Neon', 'Sariavo', 'Lia']

const UsernameInput = document.getElementById('username-input');
UsernameInput.value = names[Math.floor(Math.random() * names.length)] + Math.floor(100 + Math.random()*(999 - 100 + 1));

const MessageInput = document.getElementById('input');


MessageInput.addEventListener('keyup', function(event) {
    if(event.key == 'Enter' & MessageInput.value != '')
    {
        var http = new XMLHttpRequest();

        http.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                console.log(this.responseText);
            }
        }

        http.open('POST', 'http://127.0.0.1:5000/send', true);
        //http.setRequestHeader('Content-type', 'application/json')

        let params = new FormData()
        params.append('user', UsernameInput.value)
        params.append('text', MessageInput.value)

        http.send(params);
        
        MessageInput.value = '';
    }
});
