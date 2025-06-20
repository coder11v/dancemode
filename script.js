const partyLight = document.getElementById('partyLight');
const instructions = document.getElementById('instructions');

let audioContext;
let analyser;
let microphone;

async function setupAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        instructions.style.display = 'none'; // Hide instructions once access is granted
        updateLight();
    } catch (err) {
        console.error('Error accessing microphone:', err);
        instructions.innerHTML = '<p>Could not access microphone. Please allow access and refresh.</p>';
    }
}

function updateLight() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    const average = sum / bufferLength;

    // Simple color change based on average volume
    // More sophisticated color mapping could be implemented here
    if (average > 60) { // Adjust threshold as needed
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        partyLight.style.backgroundColor = `rgb(${r},${g},${b})`;
    } else {
        partyLight.style.backgroundColor = '#555'; // Default color when quiet
    }

    requestAnimationFrame(updateLight);
}

// Check for browser support and start
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    setupAudio();
} else {
    instructions.innerHTML = '<p>Your browser does not support microphone access. Try a different browser.</p>';
    console.error('getUserMedia not supported on your browser!');
}
