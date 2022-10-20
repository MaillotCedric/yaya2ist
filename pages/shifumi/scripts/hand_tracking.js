const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

function main_presente(results) {
    return results.multiHandLandmarks.length === 1;
};

function position(results, id_point, axe) {
    return results.multiHandLandmarks[0][id_point][axe];
};

function distance(results, point_1, point_2, axe) {
    return results.multiHandLandmarks[0][point_1][axe] - results.multiHandLandmarks[0][point_2][axe];
};

function index_leve(results) {
    return position(results, 8, "y") < position(results, 6, "y");
};

function index_baisse(results) {
    return position(results, 8, "y") > position(results, 6, "y");
};

function majeur_baisse(results) {
    return position(results, 12, "y") > position(results, 10, "y");
};

function majeur_leve(results) {
    return position(results, 12, "y") < position(results, 10, "y");
};

function annulaire_baisse(results) {
    return position(results, 16, "y") > position(results, 14, "y");
};

function annulaire_leve(results) {
    return position(results, 16, "y") < position(results, 14, "y");
};

function auriculaire_baisse(results) {
    return position(results, 20, "y") > position(results, 18, "y");
};

function auriculaire_leve(results) {
    return position(results, 20, "y") < position(results, 18, "y");
};

function mode_normal(results) {
    return index_leve(results) && majeur_baisse(results) && annulaire_baisse(results) && auriculaire_baisse(results);
};

function mode_terminator(results) {
    return index_baisse(results) && majeur_baisse(results) && annulaire_baisse(results) && auriculaire_leve(results);
};

function pierre(results) {
    return index_baisse(results) && majeur_baisse(results) && annulaire_baisse(results) && auriculaire_baisse(results);
};

function feuille(results, ratio) {
    return index_leve(results) && majeur_leve(results) && annulaire_leve(results) && auriculaire_leve(results) && ratio <= 0.4;
};

function ciseaux(results) {
    return index_leve(results) && majeur_leve(results) && annulaire_baisse(results) && auriculaire_baisse(results);
};

function lezard(results) {
    return index_leve(results) && majeur_leve(results) && annulaire_leve(results) && auriculaire_baisse(results);
};

function spock(results, ratio) {
    return index_leve(results) && majeur_leve(results) && annulaire_leve(results) && auriculaire_leve(results) && ratio > 0.4;
};

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
        if (main_presente(results)) {
            let ratio = distance(results, 10, 14, "x") / distance(results, 6, 19, "x");

            if (mode_normal(results)) {
                afficher("mode normal");
            } else if (mode_terminator(results)) {
                afficher("mode terminator");
            } else if (pierre(results)) {
                afficher("pierre");
            } else if (feuille(results, ratio)) {
                afficher("feuille");
            } else if (ciseaux(results)) {
                afficher("ciseaux");
            } else if (lezard(results)) {
                afficher("lezard");
            } else if (spock(results, ratio)) {
                afficher("spock");
            } else {
                afficher("figure inconnue");
            };
        };
    };
    canvasCtx.restore();
}

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(
    videoElement,
    {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 1280,
        height: 720
    }
);

camera.start();
