const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");

const template = "<li class=\"list-group-item\">%MES</li>";
const messages = [];

const socket = io();
const modal = document.getElementById('myModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButtons = document.querySelectorAll('#closeModalButton, #closeModalButtonFooter');
const submitNameButton = document.getElementById('submitName');
const nomeUtenteInput = document.getElementById('nomeUtente');
let f = false;


const openModal = () => {
    if(!f){
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
        document.body.classList.add('modal-open'); 
    }
};

const closeModal = () => {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
};
openModal();

document.getElementById("openModalButton").onclick = ()=> {
    if (!f) {
        openModal(); //solo se l'utente non ha ancora inserito il nome
    }
};

document.getElementById("closeModalButton").onclick= () => {
    closeModal();
}


document.getElementById("submitName").onclick = () => {
  //user entra
    const nome = nomeUtenteInput.value
    if (nome) {
        f = true;
        socket.emit("name", nome)
        console.log('Nome inserito:', nome);
    }
    closeModal(); 
};


input.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
}

button.onclick = () => {
    socket.emit("message", input.value);
    input.value = "";
}

socket.on("chat", (message) => {
    console.log(message);
    messages.push(message);
    render();
})

socket.on("list", (users) => {
    const usElement = document.getElementById("userList");
    usElement.innerHTML = '';
    users.forEach(user => {
        li.textContent = user.name;
    });
});

const render = () => {
    let html = "";
    messages.forEach((message) => {
        const row = template.replace("%MES", message);
        html += row;
    });
    chat.innerHTML = html;
  
}