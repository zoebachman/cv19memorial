document.addEventListener("DOMContentLoaded", function (event) {
    const image = document.getElementById("audio-image");
    const audio = document.getElementById("world-audio");

    image.addEventListener('click', event => {
        console.log("clickeeeeed")

        const imgData = image.getAttribute('data')
        // const audioSrc = audio.getAttribute('src')

        if (imgData == 'on') {
            // image.src = "../images/icons/sound_off_icon.png"
            image.setAttribute('src', "../images/icons/sound_off_icon.png")
            image.setAttribute('data', 'off')
            audio.pause()
            console.log('turned audio off')
        } else if (imgData == 'off') {
            // image.src = "../images/icons/sound_on_icon.png"
            image.setAttribute('src', "../images/icons/sound_on_icon.png")
            image.setAttribute('data', 'on')
            audio.play()
            console.log('turned audio on')
        }
    });
});

