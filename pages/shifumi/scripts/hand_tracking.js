const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

let tracking = true;

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

function prendre_snap() {
    tracking = true;

    setTimeout(function() {
        tracking = false;
        if (jeu.mon_choix !== "") {
            nouvelle_partie(jeu);
        } else {
            let container_mon_choix = document.getElementById("mon-choix");
            let container_choix_robot = document.getElementById("choix-robot");
            let container_message = document.getElementById("message");
            let container_mon_score = document.getElementById("mon-score");
            let container_score_robot = document.getElementById("score-robot");

            container_mon_choix.innerHTML = "x";
            container_choix_robot.innerHTML = "o";
            container_message.innerHTML = "Rien n'a été joué || La figure choisie est inconnue";
        };
    }, 70);
};

function lancer_decompte() {
    let x = 3;
    let compteur = document.getElementById("compteur");
    let container_image = document.getElementById("image-divers");

    let interval = setInterval(function() {
        container_image.innerHTML = "";
        compteur.innerHTML = x;
        x--;

        // If the count down is finished, ...
        if (x < 0) {
            clearInterval(interval);
            compteur.innerHTML = "";
            container_image.innerHTML = `<img src="./assets/images/thinking-robot.png" alt="thinking robot">`;
            x = 3;
            prendre_snap();
            
            setTimeout(function() { // on laisse 2 secondes à l'utilisateur pour qu'il retire sa main de l'écran
                tracking = true;
                // container_image.innerHTML = `<img src="./assets/images/welcome-robot.png" alt="welcome robot">`;
            }, 2000);
        }
    }, 1000)
};

function lancer_partie() {
    tracking = false;
    lancer_decompte();
};

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && tracking) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
        if (main_presente(results)) {
            let ratio = distance(results, 10, 14, "x") / distance(results, 6, 19, "x");

            if (mode_normal(results)) {
                afficher("mode normal");
                jeu.mon_choix = "";
                jeu.mode_jeu = "normal";
                lancer_partie();
            } else if (mode_terminator(results)) {
                afficher("mode terminator");
            } else if (pierre(results)) {
                afficher("pierre");
                jeu.mon_choix = "pierre";
            } else if (feuille(results, ratio)) {
                afficher("feuille");
                jeu.mon_choix = "feuille";
            } else if (ciseaux(results)) {
                afficher("ciseaux");
                jeu.mon_choix = "ciseaux";
            } else if (lezard(results)) {
                afficher("lezard");
                jeu.mon_choix = "lezard";
            } else if (spock(results, ratio)) {
                afficher("spock");
                jeu.mon_choix = "spock";
            } else {
                afficher("figure inconnue");
                jeu.mon_choix = "";
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
