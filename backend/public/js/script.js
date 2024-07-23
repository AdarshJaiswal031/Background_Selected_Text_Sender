const socket = io();
const notepad = document.getElementById("notepad");
const send = document.getElementById("send");
const copy = document.getElementById("copy");
const uploadArea = document.getElementById('uploadArea');
const filesList = document.getElementById('filesList');

send.addEventListener("click", function () {
    const text = notepad.value;
    socket.emit("text update", text);
});

socket.on("text update", function (data) {
    notepad.value = data;
    navigator.clipboard.writeText(data).then(() => {
        console.log("Text copied!!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
});

copy.addEventListener("click", function () {
    navigator.clipboard.writeText(notepad.value).then(() => {
        console.log("Text copied!!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
});

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

socket.on('files update', (files) => {
    console.log("Files update received");
    loadFiles();
});

function loadFiles() {
    fetch('/files')
        .then((response) => response.json())
        .then((files) => {
            // Sort files by timestamp (newest first)
            files.sort((a, b) => {
                const aTimestamp = parseInt(a.split('-')[0], 10);
                const bTimestamp = parseInt(b.split('-')[0], 10);
                return bTimestamp - aTimestamp; // Newest first
            });

            filesList.innerHTML = '';
            files.forEach((file) => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/uploads/${file}`;
                link.textContent = file;
                link.download = file;

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '×'; // Cross sign
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => {
                    deleteFile(file);
                });

                listItem.appendChild(link);
                listItem.appendChild(deleteButton);
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
