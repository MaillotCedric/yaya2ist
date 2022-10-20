// outils

function afficher(...objets) {
    objets.forEach(objet => {
        console.log(objet);
    });
};

/**
 * 
 * @param {Int} nombre 
 * @example
 * // returns 8
 * partie_entiere(8.76);
 * @returns {Int} La partie entière d'un nombre
 */
function partie_entiere(nombre) {
    return Math.trunc(nombre);
};

/**
 * 
 * @param {Int} max 
 * @example
 * // returns 0 || 1 || 2 || 3 || 4 || 5
 * rand_pos_int(5);
 * @returns {Int} Un entier naturel ∈ [0, max]
 */
function rand_pos_int(max) {
    return partie_entiere(Math.random() * (max + 1));
};
