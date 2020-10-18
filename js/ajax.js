// FONCTION AJAX "GET" GENERIQUE POUR RECEVOIR DES DONNEES D'UN SERVEUR //

// Définition de la fonction générique//
// La fonction exécute un appel AJAX GET. La fonction ajaxGet permet d'exécuter une requête HTTP asynchrone.
// Une requête asynchrone permet au navigateur de pouvoir continuer à interagir avec l'utilisateur...
// ... jusqu'à l'arrivée de la réponse du serveur.
// La fonction prend en paramètres l'URL cible et la fonction callback appelée en cas de succès...
// ... callback désigne une fonction appelée ultérieurement, en réaction à un certain événement.
function ajaxGet(url, callback) {
    // on créee un nouvel objet nommé req en utilisant le constructeur XMLHttpRequest (l'objet XMLHttpRequest permet de créer une requête HTTP en Javascript)
    let req = new XMLHttpRequest();
    // La méthode open de req permet de configurer la requête HTTP avant son lancement...
    // ... Elle prend en paramètres le type de requête HTTP (le plus souvent GET, POST ou PUT),...
    // ... l'URL cible, ainsi qu'un booléen indiquant si la requête sera asynchrone ou non
    // La requête est asynchrone lorsque le 3ème paramètre vaut true ou est absent
    req.open("GET", url, true);
    // On créée un événement de type load qui indique la fin du traitement de la requête par le serveur...
    req.addEventListener("load", function () {
        // La propriété status donne le code de retour de la requête et indique son résultat
        // Un code supérieur ou égal à 200 et strictement inférieur à 400 signale la réussite de la requête.
        if (req.status >= 200 && req.status < 400) {
            // Dans ce cas on appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else { // Sinon on affiche un message d'erreur en affichant le code de retour
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });

    // La méthode send de req envoie la requête HTTP vers l'URL cible fournie à open...
    // ... Elle prend en paramètre l'éventuelle information envoyée au serveur (requêtes POST ou PUT),...
    // ... ou bien null dans le cas d'une requête GET.
    req.send(null);
}
// Cette fonction est dite générique : elle n'est pas spécifique à un contexte ou des données particuliers, ...
// ... et peut être utilisée dans tout programme JavaScript qui a besoin d'effectuer des appels AJAX (dans le cas où plusieurs requêtes HTTP sont à effectuer).
