const names = ['Hylley', 'Jester', 'Rock', 'Cloud', 'Lisa', 'Popo', 'Neon', 'Sariavo', 'Lia']

const UsernameInput = document.getElementById('username-input');
const MessageInput = document.getElementById('message-input');
const ProfilePictureInput = document.getElementById('profile-pic-input')
const ProfilePicturePreview = document.getElementById('profile-pic-preview');

UsernameInput.value = names[Math.floor(Math.random() * names.length)] + Math.floor(100 + Math.random()*(999 - 100 + 1));


function InsertMessage(user, content, pfp_url, time)
{
    let message = document.createElement('div');
    message.classList.add('message')
    message.innerHTML = `
        <img src="${pfp_url}"/>
        <h3>${user} <span>${time}</span></h3>
        <p>${content}</p>
    `;

    container.insertBefore(
        message,
        container.firstChild
    );
}

// Update profile picture everytime the input is changed.
ProfilePictureInput.addEventListener('keyup', function(event){
    console.log(ProfilePictureInput.value)
    ProfilePicturePreview.src = ProfilePictureInput.value;
})

MessageInput.addEventListener('keyup', function(event) {
    if(event.key == 'Enter' & MessageInput.value != '')
    {
        SendMessage(UsernameInput.value, MessageInput.value, ProfilePictureInput.value);
        MessageInput.value = '';
    }
})