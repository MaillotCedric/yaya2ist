// shifumi

let jeu = {
    "choix_robot": "",
    "mon_choix": "",
    "figure_gagnante": "",
    "figure_perdante": "",
    "message": "",
    "score_robot": 0,
    "mon_score": 0,
    "mode_jeu": "normal"
};

/**
 * 
 * @example
 * // returns "pierre" || "feuille" || "ciseaux" || "lezard" || "spock"
 * figure_aleatoire();
 * @returns {String} Une figure ∈ ["pierre", "feuille", "ciseaux", "lezard", "spock"]
 */
function figure_aleatoire() {
    let figures = ["pierre", "feuille", "ciseaux", "lezard", "spock"];
    let nb_figures = figures.length;
    let index_aleatoire = rand_pos_int(nb_figures - 1);

    return figures[index_aleatoire];
};

function partie_nulle(jeu) {
    return jeu.choix_robot === jeu.mon_choix;
};

function robot_gagne(jeu) {
    let choix_robot = jeu.choix_robot;
    let mon_choix = jeu.mon_choix;

    return  choix_robot === "pierre" ? (mon_choix === "lezard" || mon_choix === "ciseaux")
        :   choix_robot === "feuille" ? (mon_choix === "pierre" || mon_choix === "spock")
        :   choix_robot === "ciseaux" ? (mon_choix === "feuille" || mon_choix === "lezard")
        :   choix_robot === "lezard" ? (mon_choix === "spock" || mon_choix === "feuille")
        :   (mon_choix === "ciseaux" || mon_choix === "pierre"); // choix_robot === "spock"
};

function nouveau_message(jeu) {
    let figure_gagnante = jeu.figure_gagnante;
    let figure_perdante = jeu.figure_perdante;

    return  figure_gagnante === "pierre" && figure_perdante === "lezard" ? "La pierre écrase le lézard"
        :   figure_gagnante === "pierre" && figure_perdante === "ciseaux" ? "La pierre écrase les ciseaux"
        :   figure_gagnante === "feuille" && figure_perdante === "pierre" ? "La feuille enveloppe la pierre"
        :   figure_gagnante === "feuille" && figure_perdante === "spock" ? "La feuille désavoue Spock"
        :   figure_gagnante === "ciseaux" && figure_perdante === "feuille" ? "Les ciseaux coupent la feuille"
        :   figure_gagnante === "ciseaux" && figure_perdante === "lezard" ? "Les ciseaux décapitent le lézard"
        :   figure_gagnante === "lezard" && figure_perdante === "spock" ? "Le lézard empoisonne Spock"
        :   figure_gagnante === "lezard" && figure_perdante === "feuille" ? "Le lézard mange la feuille"
        :   figure_gagnante === "spock" && figure_perdante === "ciseaux" ? "Spock écrase les ciseaux"
        :   "Spock détruit la pierre"; // figure_gagnante === "spock" && figure_perdante === "pierre"
};

function figure_bat(mon_choix) {
    let choix_possibles = [];
    
    mon_choix === "pierre" ? choix_possibles.push("feuille", "spock")
    :   mon_choix === "feuille" ? choix_possibles.push("ciseaux", "lezard")
    :   mon_choix === "ciseaux" ? choix_possibles.push("pierre", "spock")
    :   mon_choix === "lezard" ? choix_possibles.push("pierre", "ciseaux")
    :   choix_possibles.push("lezard", "feuille"); // mon_choix === "spock"

    return choix_possibles[rand_pos_int(1)];
};

function partie_normale(jeu) {
    jeu.choix_robot = figure_aleatoire();
    jeu.mon_choix = figure_aleatoire();

    if (partie_nulle(jeu)) {
        jeu.message = "Égalité";
    } else if (robot_gagne(jeu)) {
        jeu.figure_gagnante = jeu.choix_robot;
        jeu.figure_perdante = jeu.mon_choix;
        jeu.score_robot++;
        jeu.message = nouveau_message(jeu);
    } else { // je gagne
        jeu.figure_gagnante = jeu.mon_choix;
        jeu.figure_perdante = jeu.choix_robot;
        jeu.mon_score++;
        jeu.message = nouveau_message(jeu);
    };
};

function partie_terminator(jeu) {
    jeu.mon_choix = figure_aleatoire();
    jeu.choix_robot = figure_bat(jeu.mon_choix);

    jeu.figure_gagnante = jeu.choix_robot;
    jeu.figure_perdante = jeu.mon_choix;
    jeu.score_robot++;
    jeu.message = nouveau_message(jeu);
};

function nouvelle_partie(jeu) {
    if (jeu.mode_jeu === "normal") {
        partie_normale(jeu);
    } else { // jeu.mode_jeu === "terminator"
        partie_terminator(jeu);
    }
};
