/*
Création d'un bloc permettant de dessiner une signature à l'aide de l'API Canvas
*/





// ------------------------------------- IDENTIFICATION DES ELEMENTS DU DOM ----------------------------- //

let canvas = document.getElementById("canvas");







// -------------------------------- CREATION D'UNE CLASSE OBJET SIGNATURE ------------------------------- //

class Signature {
    constructor(){
    // Définition d'un constructeur d'objet "signature" avec ses propriétés :
        this.beginDraw = false; // Variable booléenne conditionnant le dessin d'un trait lors des événements de type mousedown et mousemove de la souris (valeur par défaut = false)
        this.ctx = canvas.getContext("2d"); // Création d'une variable ctx permettant de stocker la valeur du contexte de rendu du canvas. Il s'agit ici d'un graphique en 2 dimensions
        this.ctx.strokeStyle = "#7a7b7f"; // Couleur du trait
        this.ctx.lineWidth = 2; // Epaisseur du trait
    }

    // ... et ses méthodes :


    // Méthode qui initialise le fonctionnement de l'objet signature
    initialiserCanvas() {
        // On efface le contenu du canvas
        this.ctx.clearRect(0, 0, 300, 150);
        let that = this;

        // On créée un gestionnaire d'événement pour dessiner avec la souris dans le canvas
        // Gestionnaire d'événement de type "mousemove"
        canvas.addEventListener("mousemove", function(e) {
            // Appel de la méthode mouseMove avec le paramètre événement "e"
            that.mouseMove(e);
        });
        // Gestionnaire d'événement de type "mousedown"
        canvas.addEventListener("mousedown", function(e) {
            // Appel de la méthode mouseDown
            that.mouseDown();
        });
        // Gestionnaire d'événement de type "mousemove"
        canvas.addEventListener("mouseup", function(e) {
            // Appel de la méthode mouseUp
            that.mouseUp();
        });

        // On créée un gestionnaire d'événement pour dessiner avec le doigt dans le canvas sur les écrans tactiles
        // Gestionnaire d'événement de type "touchmouve"
        canvas.addEventListener("touchmove", function(e) {
            // Appel de la méthode touchMove avec le paramètre événement "e"
            that.touchMove(e);
        });
        // Gestionnaire d'événement de type "touchstart"
        canvas.addEventListener("touchstart", function(e) {
            // Appel de la méthode touchStart avec le paramètre événement "e"
            that.touchStart(e);
        });
        // Gestionnaire d'événement de type "touchleave"
        canvas.addEventListener("touchend", function(e) {
            // Appel de la méthode touchLeave avec le paramètre événement "e"
            that.touchEnd();
        });

    } // Fin de la méthode initialiserCanvas


    // Méthode qui gère l'événement "clic sur le bouton de souris" de type mousedown
    mouseDown() {
        this.ctx.beginPath(); // Initialisation d'un nouveau "trajet" de dessin à l'aide de la méthode beginPath()
        this.beginDraw = true; // Lorsque l'on clique sur le bouton de la souris, la variable beginDraw passe à true, autorisant ainsi le dessin d'un trait
    }


    // Méthode qui gère l'événement "déplacement de la souris" de type mousemove
    mouseMove(e) {
        // si beginDraw = true (ce qui suppose un événement mousedown préalable - Voir méthode précédente), ...
        if (this.beginDraw) {
            // alors on établit un chemin entre les coordonnées précédentes et les coordonnées actuelles de la souris (position actuelle du curseur : e.offsetX et e.offsetY )
            this.ctx.lineTo(e.offsetX, e.offsetY);
            // Remarque : .offsetX fournit le décalage sur l'axe X du pointeur de la souris entre l'évènement mouseEvent et la bordure de la marge intérieure du noeud cible.
            // ... puis on dessine en traçant une ligne
            this.ctx.stroke();
        // On arrête le dessin si on sort du canvas (à gauche ou en haut du canvas)
        if (e.offsetX < 1 || e.offsetY < 1) {
          this.mouseUp(); // On appelle la méthode mouseUp();
        }
        // On arrête le dessin si on sort du canvas (à droite ou en bas du canvas )
        else if (e.offsetX > (299) || e.offsetY > (149)) {
          this.mouseUp();
        }
      }
    } // Fin de la méthode mouseMove


    // Méthode qui gère l'événement "relâchement du bouton de la souris" de type mouseup
    mouseUp() {
        // si beginDraw = true (ce qui suppose un événement mousedown préalable), ...
        if (this.beginDraw) {
            // ... alors lorsque l'on relâche la souris, la valeur de beginDraw devient false, stoppant ainsi le dessin
            this.beginDraw = false;
        }
    } // Fin de la méthode mouseUp()


    // Méthode qui gère l'événement "toucher sur l'écran tactile" de type touchstart
    touchStart(e) {
        // On appelle au préalable la méthode preventDefault lors de l'événement touchstart pour annuler le déclenchement par défaut de l'événement souris.
        e.preventDefault();
        // Puis on initialise un nouveau "trajet" de dessin à l'aide de la méthode beginPath()
        this.ctx.beginPath();
        // On récupère la taille et la position relative du canvas par rapport au viewport (zone d'affichage)
        let rect = canvas.getBoundingClientRect();
        // On actualise tout d'abord les coordonnées de départ du doigt sur le canvas
        let startPosition = e.touches[0];
        // On positionne ensuite le point de départ du trajet aux coordonnées initiales du doigt sur l'écran
        this.ctx.moveTo(startPosition.clientX - rect.left, startPosition.clientY - rect.top);
        // Lorsque l'on touche l'écran, la variable beginDraw passe à true, autorisant ainsi le dessin d'un trait
        this.beginDraw = true;

    } // Fin de la méthode touchStart()


    // Méthode qui gère l'événement "déplacement du doigt sur l'écran tactile" de type touchmove
    touchMove(e) {
        // si beginDraw = true (ce qui suppose un événement touchstart préalable - Voir méthode précédente), ...
        if (this.beginDraw) {
            // On appelle la méthode preventDefault lors de l'événement touchstart pour annuler le déclenchement par défaut de l'événement souris.
            e.preventDefault();
            // On récupère la taille et la position relative du canvas par rapport au viewport (zone d'affichage)
            let rect = canvas.getBoundingClientRect();
            // Pour chaque position, on actualise les coordonnées du doigt au regard de son déplacement sur le canvas
            let movePosition = e.changedTouches[0];
            // Puis on établit un chemin entre les coordonnées précédentes et les coordonnées actuelles du point de contact (position actuelle du toucher : touchScreen.clientX, touchScreen.clientY)
            this.ctx.lineTo(movePosition.clientX - rect.left, movePosition.clientY - rect.top);
            // ... puis on dessine en traçant une ligne
            this.ctx.stroke();
        }

        // On arrête le dessin si on sort du canvas (à gauche ou en haut du canvas)
        if ((movePosition.clientX - rect.left) < 1 || (movePosition.clientY - rect.top) < 1) {
            // On appelle la méthode touchEnd(); qui gère le retrait du doigt et met fin au dessin
            this.touchEnd();
        }
        // On arrête le dessin si on sort du canvas (à droite ou en bas du canvas )
        else if ((movePosition.clientX - rect.left) > (299) || (movePosition.clientY  - rect.top) > (149)) {
            // On appelle la méthode touchEnd(); qui gère le retrait du doigt et met fin au dessin
            this.touchEnd();
        }
    } // Fin de la méthode touchMove()


    // Méthode qui gère l'événement "retrait du doigt de l'écran tactile" de type touchleave
    touchEnd() {
        // si beginDraw = true (ce qui suppose un événement touchstart préalable), ...
        if (this.beginDraw) {
            // ... alors la valeur de beginDraw devient false, stoppant ainsi le dessin
            this.beginDraw = false;
        }
    } // Fin de la méthode touchEnd()


    // Méthode qui permet d'effacer la signature (activée sur le onclick() du bouton Effacer)
    effacer() {
        let confirmation = confirm("Souhaitez-vous effacer la signature ?"); // La méthode confirm() affiche une boîte de dialogue avec deux boutons (OK et annuler)
        // Si l'utilisateur sélectionne OK alors la variable confirmation prend la valeur booléeene "true"
        // Si confirmation = true, alors ...
        if (confirmation) { //
            // On efface le contenu du canvas (dont les dimensions sont définies par un rectangle ayant pour origine le cois supérieur gauche...
            // ... et ayant pour largeur 300px et pour hauteur 150px
            this.ctx.clearRect(0, 0, 300, 149);
        }
    } // Fin de la méthode effacer()


    // Méthode qui permet de sauvegarder la signature sous forme d'image (activée sur le onclick() du bouton Sauvegarder)
    sauvegarder() {
        let dataURL = canvas.toDataURL(); // La méthode toDataURL permet de renvoyer le dessin du canvas sous forme d'une image...
        // ... Celle-ci est stockée dans la variable dataURL
    } // Fin de la méthode sauvegarder()

} // Fin de la classe objet "signature"




// --------------------------------- CREATION D'UN NOUVEL OBJET "NOUVELLE SIGNATURE" ------------------------------- //

// Création de l'objet signatureCanvas par instanciation

const signatureCanvas = new Signature();









// ------------------------------------ INITIALISATION DU CANVAS - APPEL DE METHODE -------------------------------- //

// On appelle la méthode initialiserCanvas() de l'objet signatureCanvas
signatureCanvas.initialiserCanvas();
