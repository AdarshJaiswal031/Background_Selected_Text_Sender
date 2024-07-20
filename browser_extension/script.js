const txt = document.getElementById("txt")
const read = document.getElementById("read")
let speeechTrue = false
read.addEventListener("click", function () {
    speeechTrue = speeechTrue ? false : true
    if (speeechTrue) {
        let text = txt.value
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = function (event) {
            speeechTrue = false
        }
        window.speechSynthesis.speak(utterance)
    }
    else {
        window.speechSynthesis.cancel()
    }
})