let speechTrue = false
console.log(document)
document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key == 'r') {
        console.log("Hello")
        speechTrue = speechTrue ? false : true
        console.log(window.getSelection().toString())
        if (window.getSelection) {
            let selectedText = window.getSelection().toString()
            console.log(selectedText)
            sendTextToClipboard(selectedText)
            // if (speechTrue) {
            //     const utterance = new SpeechSynthesisUtterance(selectedText)
            //     utterance.onend = function (event) {
            //         speeechTrue = false
            //     }
            //     window.speechSynthesis.speak(utterance)
            // }
            // else {
            //     window.speechSynthesis.cancel()
            // }
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