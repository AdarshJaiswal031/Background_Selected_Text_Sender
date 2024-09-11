let speechTrue = false
console.log(document)
document.addEventListener("keydown", async function (event) {
    console.log(event.key)
    if (event.altKey && event.key == 'r') {
        console.log("Hello")
        speechTrue = speechTrue ? false : true
        console.log(window.getSelection().toString())
        if (window.getSelection) {
            let selectedText = window.getSelection().toString()
            console.log(selectedText)
            sendTextToClipboard(selectedText)

        }
    }
})

function sendTextToClipboard(text) {
    console.log(text)
    fetch('http://localhost:3000/clipboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}





