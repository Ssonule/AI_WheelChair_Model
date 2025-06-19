const URL = "https://teachablemachine.withgoogle.com/models/QRPqDNgum/";

let lastCommand = "";
let recognizer;

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();

    return recognizer;
}

async function init() {
    document.getElementById("status-text").innerText = "Initializing...";

    const recognizer = await createModel();
    const labels = recognizer.wordLabels();
    
    document.getElementById("status-text").innerText = "Listening";

    recognizer.listen(result => {
        const scores = result.scores;
        let maxScore = -Infinity;
        let predictedClass = "";

        scores.forEach((score, i) => {
            if (score > maxScore) {
                maxScore = score;
                predictedClass = labels[i];
            }
        });

        // Only update if the command has changed and score is confident
        if (predictedClass !== lastCommand && maxScore >= 0.75) {
            lastCommand = predictedClass;
            document.getElementById("command-text").innerText = predictedClass;
            console.log("Detected Command:", predictedClass);
        }
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: false,
        overlapFactor: 0.5
    });
}
