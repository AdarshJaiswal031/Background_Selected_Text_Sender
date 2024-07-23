const socket = io();
const notepad = document.getElementById("notepad");
const send = document.getElementById("send");
// const copy = document.getElementById("copy");
const uploadArea = document.getElementById('uploadArea');
const filesList = document.getElementById('filesList');
const messageList = document.getElementById("messageList");
const copyIcon = `<i class="ri-file-copy-line"></i>`
const deleteIcon = `<i class="ri-delete-bin-6-line"></i>`
const downloadIcon = `<i class="ri-download-cloud-fill"></i>`

// Handle tab switching
document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-tab");

            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            button.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    });
});

// Send text
send.addEventListener("click", function () {
    const text = notepad.value;
    console.log(text)
    socket.emit("text update", text);

    notepad.value = ""; // Clear the notepad after sending
});

// Receive and display text
socket.on("text update", function (data) {
    console.log("text update called")
    const listItem = document.createElement('li');
    listItem.classList.add('message-item');

    const messageText = document.createElement('span');
    messageText.classList.add('message-text');
    messageText.textContent = data;

    const copyButton = document.createElement('button');
    copyButton.innerHTML = copyIcon;
    copyButton.classList.add('copy-btn');
    copyButton.classList.add('grey-btn');
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(data).then(() => {
            console.log("Text copied!!");
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = deleteIcon;
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
        listItem.remove();
    });

    listItem.appendChild(messageText);
    listItem.appendChild(copyButton);
    listItem.appendChild(deleteButton);
    console.log(listItem)
    messageList.appendChild(listItem);
});

// Copy text from notepad to clipboard
// copy.addEventListener("click", function () {
//     navigator.clipboard.writeText(notepad.value).then(() => {
//         console.log("Text copied!!");
//     }).catch(err => {
//         console.error('Error copying text: ', err);
//     });
// });

// Handle file uploads
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragging');

    const files = event.dataTransfer.files;
    const formData = new FormData();
    formData.append('file', files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => {
            alert(data);
            socket.emit('file upload');  // Notify the server to update the file list
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

uploadArea.addEventListener("click", function (event) {
    document.getElementById('fileInput').click()
})
function handleFileUpload(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file)


    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => {
            alert(data);
            socket.emit('file upload');  // Notify the server to update the file list
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Receive and display files
socket.on('files update', () => {
    loadFiles();
});

function loadFiles() {
    fetch('/files')
        .then((response) => response.json())
        .then((files) => {
            files.sort((a, b) => {
                const aTimestamp = parseInt(a.split('-')[0], 10);
                const bTimestamp = parseInt(b.split('-')[0], 10);
                return bTimestamp - aTimestamp; // Newest first
            });

            filesList.innerHTML = '';
            files.forEach((file) => {
                const listItem = document.createElement('li');
                listItem.classList.add('file-item'); // Add a class for styling

                // Create a div for the file name
                const nameDiv = document.createElement('div');
                const link = document.createElement('a');
                link.href = `/uploads/${file}`;
                link.textContent = file;
                link.download = file;
                nameDiv.appendChild(link);

                // Create a div for the buttons
                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('buttons-container'); // Add a class for styling

                const downloadLink = document.createElement('a');
                downloadLink.href = `/uploads/${file}`;
                downloadLink.innerHTML = downloadIcon;
                downloadLink.classList.add('copy-btn');
                downloadLink.classList.add('grey-btn');
                downloadLink.download = file;

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = deleteIcon;
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => {
                    const userConfirmed = confirm("Do you want to proceed ?")
                    if (userConfirmed) {
                        deleteFile(file);
                    }
                });

                buttonsDiv.appendChild(downloadLink);
                buttonsDiv.appendChild(deleteButton);

                // Append both divs to the listItem
                listItem.appendChild(nameDiv);
                listItem.appendChild(buttonsDiv);

                // Append listItem to the filesList
                filesList.appendChild(listItem);
            });

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function deleteFile(file) {
    fetch(`/delete/${file}`, {
        method: 'DELETE',
    })
        .then((response) => response.text())
        .then((data) => {
            alert(data);
            socket.emit('file upload');  // Refresh the file list
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Handle pasting files into the notepad
notepad.addEventListener('paste', (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.text())
                .then((data) => {
                    alert(data);
                    socket.emit('files update');  // Notify the server to update the file list
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }
});

// Load files initially
loadFiles();
