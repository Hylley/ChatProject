const names = ['Hylley', 'Jester', 'Rock', 'Cloud', 'Lisa', 'Popo', 'Neon', 'Sariavo', 'Lia']

const UsernameInput = document.getElementById('username-input');
const MessageInput = document.getElementById('input');
const ProfilePictureInput = document.getElementById('profile-pic-input')
const ProfilePicturePreview = document.getElementById('profile-pic-preview');

UsernameInput.value = names[Math.floor(Math.random() * names.length)] + Math.floor(100 + Math.random()*(999 - 100 + 1));

ProfilePictureInput.addEventListener('keyup', function(event){
    console.log(ProfilePictureInput.value)
    ProfilePicturePreview.src = ProfilePictureInput.value;
})

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

        http.open('POST', `${document.URL}/send`, true);
        //http.setRequestHeader('Content-type', 'application/json')

        let params = new FormData()
        params.append('user', UsernameInput.value)
        params.append('text', MessageInput.value)
        params.append('profile', ProfilePictureInput.value)

        http.send(params);
        
        MessageInput.value = '';
    }
});
