/*
Activité 7 - Création d'un slider interactif avec Javascript - Exemple 7

- Defilement automatique
- Commande avec flèches et clavier
- Mise en pause avec bouton "pause"
- Mise en lecture avec bouton "play"
- Points indicateurs de défilement

Programmation Orientée Objet
*/





// -------------------------------- IDENTIFICATION DES ELEMENTS DU DOM ---------------------------------- //

let sliderElt = document.getElementById("slider"); // Balise <div> ayant pour identifiant "slider" dans laquelle s'afficheront les images du slider

let imageElt = document.querySelectorAll("#slider img"); // Toutes les balises <img>

let gaucheBtn = document.getElementById("fleche_gauche_slider"); // Balise <div> ayant pour identifiant fleche_gauche_slider

let droiteBtn = document.getElementById("fleche_droite_slider"); // Balise <div> ayant pour identifiant fleche_droite_slider

let pauseBtn = document.getElementById("pause"); // Balise <div> ayant pour identifiant "pause"

let playBtn = document.getElementById("play"); // Balise <div> ayant pour identifiant "play"

let pointElt = document.getElementsByClassName("point"); // Balises <span> ayant pour classe "point"






// ------------------------------------ CREATION D'UN OBJET DIAPORAMA ----------------------------------- //

// On créée l'objet diaporama et on le stocke dans une variable
const diaporama = {

  // On définit dans un premier temps les propriétés de l'objet diaporama

  // Propriété qui fixe la valeur d'un compteur indiquant le numéro de l'image en cours
  compteurImage: 1, // La valeur initiale est "1" pour la première image
  // Propriété qui fixe la valeur de la largeur de référence du slider image
  sizeImage: sliderElt.clientWidth, // Cette valeur correspond au déplacement horizontal que l'on va appliquer sur l'élément sliderElt pour faire défiler les images
  // Propriété qui fixe le nombre total d'images du diaporama (soit 7 au total)
  totalImage: imageElt.length,
  // Propriété qui fixe la valeur du timer du diaporama
  timerImage: 5000, // La valeur par défaut est de 5000 millisecondes (soit 5 secondes) - Cette propriété sera utisée comme paramètre de la fonction setInterval pour l'automatisation du diaporama
  // Propriété intervalSlider qui stocke la méthode setInterval
  intervalSlider: "",


  // On définit ensuite les méthodes qui fixent les fonctionnalités de l'objet diaporama

  // Méthode qui initalise le diaporama au lancement de l'application
  initialiserSlider() {
    // A l'ouverture de la page, on positionne l'affichage du diaporama sur la première image (par défaut la première image est en effet le clone de la dernière image)
    // Pour cela on applique à l'élément sliderElt, une transformation de type 'translateX()' vers la gauche d'une valeur égale à la largeur sizeImage
    // Par défaut, l'élément sliderElt se déplace vers la gauche pour faire défiler les images qu'il contient ...
    // Donc, la valeur de la propriété sizeImage de l'objet diaporama sera par défaut négative. Elle est multipliée par la valeur de la propriété compteurImage de l'objet diaporama (soit initialement 1 pour la première image)
    sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
    // On masque les points indicateurs correspondant aux images "lastClone" et "firstClone"
    pointElt[0].style.display = "none"; // Correspond à l'image lastClone
    pointElt[diaporama.totalImage-1].style.display ="none"; // Correspond à l'image firstClone
    // On active le point indicateur de la première image en lui affectant la classe "active" qui déclenche le hover sur les éléments pointElt //
    pointElt[1].classList.add("activation");
    // On appelle la méthode imageSuivante de l'objet diaporama toutes les 5 secondes à l'aide de la fonction setInterval
    diaporama.intervalSlider = setInterval(diaporama.imageSuivante, diaporama.timerImage);
    // Affichage de la valeur de la largeur de l'image de référence dans la console
    console.log("La largeur de référence des images est : " + diaporama.sizeImage);

    // On définit un gestionnaire d'événement pour gérer le clic de souris sur les flèches du diaporama
    droiteBtn.addEventListener ("click", function(e){ // Evénement sur la flèche de droite
      // On appelle la fonction clicdroitSlider()
      diaporama.clicdroitSlider();
    });
        gaucheBtn.addEventListener ("click", function(e){ // Evénement sur la flèche de gauche
      // On appelle la fonction clicgaucheSlider();
      diaporama.clicgaucheSlider();
    });

    // On définit un gestionnaire d'événement pour gérer la commande du diaporama avec les flèches gauches et droite du clavier
    // L'événement est de type keypress et s'applique sur le corps de la page web
    document.addEventListener("keydown", function(e){
      // On déclare une variable qui récupère la valeur Unicode du caracère de la touche frappée et la convertit en une chaîne représentant le caractère
      let toucheClavier = e.keyCode;
      // Si toucheClavier = 39 (keycode de la flèche directionnelle droite du clavier)...
      if (toucheClavier === 39) {
        // On appelle la méthode clicdroitSlider() de l'objet diaporama
        diaporama.clicdroitSlider();
      }
      // Si toucheClavier = 37 (keycode de la flèche directionnelle gauche du clavier)...
      if (toucheClavier === 37) {
        // On appelle la fonction clicgaucheSlider() de l'objet diaporama
        diaporama.clicgaucheSlider();
      }
    }); // Fin du gestionnaire d'événement de commande du diaporama avec les flèches du clavier

    // On définit un gestionnaire d'événement permettant de gérer le clic clic de la souris sur le bouton "pause"
    pauseBtn.addEventListener("click",function(e){ //
      //On appelle la fonction pauseSlider
      diaporama.pauseSlider(); // Mise en pause du défilement du diaporama
    }); // Fin de l'événement click sur le bouton pause

    // On définit gestionnaire d'événement permettant de gérer le clic de la souris sur le bouton "play"
    playBtn.addEventListener("click",function(e){
      // ... alors on appelle la fonction lectureSlider
      diaporama.lectureSlider(); // Mise en lecture le défilement du diaporama
    }); // Fin de l'événement click sur le bouton play
  }, // Fin de la méthode initialiserSlider


  // Méthode pour activer le défilement automatisé du diaporama de la droite vers la gauche (passage automatique à l'image suivante)
  // Cette méthode est appelée lors de l'initialisation du diaporama à l'aide de la fonction setInterval. Elle est appelée par défaut toutes les 5 secondes
  imageSuivante(){
    // Si le compteur de l'image en cours est inférieur au nombre total d'images (s'il reste des images à afficher dans le diaporama),...
    if (diaporama.compteurImage < diaporama.totalImage - 1) {
      // ... alors on incrémente automatiquement la valeur du compteurImage pour passer à l'image suivante
      diaporama.compteurImage += 1;
      // On définit ensuite une transformation de type transition (effet de défilement) sur l'élément slideElt
      sliderElt.style.transition = "transform 0.8s ease-in-out"; // Départ et fin lents - Durée de transition de 0.8s
      // On appelle la méthode deplacerDroite()
      diaporama.deplacerDroite();
      // On appelle la méthode sliderInfini()
      diaporama.sliderInfini();
    }
  }, // Fin de la méthode imageSuivante()


  // Méthode pour boucler à l'infini le défilement du diaporama
  sliderInfini(){
    // On définit un événement de type "transitionend" qui est déclenché lorsqu'une transition CSS est terminée...
    sliderElt.addEventListener("transitionend", function(){
      // Lors du déplacement du diaporama vers la droite en actionnant la flèche de gauche ...
      // ... si l'identifiant de l'image en cours est "lastClone", c'est à dire le clone de la dernière image placée au début du diaporama, ...
      if (imageElt[diaporama.compteurImage].id === "lastClone"){
        // ... alors on redéfinit la valeur du compteur pour qu'elle corresponde à l'image n°5 (soit dernière image, identique à lastClone)
        diaporama.compteurImage = diaporama.totalImage - 2 ; // compteurImage = 7 - 2, soit 5
        // Puis on applique la transformation définie initialement sur le diaporama pour le repositionner sur l'image n°5 (dernière image identique au clone lastClone)
        sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
        // ... on supprime enfin la transition de type transform sur l'élément slideElt pour masquer le défilement et donner l'illusion que nous sommes toujours sur la même image...
        sliderElt.style.transition = "none";
        // On active le point indicateur correspondant à l'image en cours en lui affectant la classe "activation" qui déclenche le hover (css) sur les éléments pointElt //
        pointElt[diaporama.compteurImage].classList.add("activation");
        // On désactive le point indicateur de la première image (lastClone) en supprimant sa classe "activation"
        pointElt[0].classList.remove("activation");
      }
      // A l'inverse, lors du déplacement du diaporama vers la gauche (en automatique ou en actionnant la flèche de droite) ...
      // ... si l'identifiant de l'image en cours est "firstClone", c'est à dire le clone de la première image placée à la fin du diaporama
      if (imageElt[diaporama.compteurImage].id === "firstClone"){
        // ... alors on redéfinit la valeur du compteur pour qu'elle corresponde à l'image n°1 (soit permière image, identique à firstClone)
        diaporama.compteurImage = diaporama.totalImage - diaporama.compteurImage ; // compteurImage = 7 - 6, soit 1
        // Puis on applique la transformation définie initialement sur le diaporama pour le repositionner sur l'image n°1 (première image identique au clone firstClone)
        sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
        // ... on supprime enfin la transition de type transform sur l'élément slideElt pour masquer le défilement et donner l'illusion que nous sommes toujours sur la même image...
        sliderElt.style.transition = "none";
        // On active le point indicateur correspondant la première image en lui affectant la classe "activation" qui déclenche le hover (css) sur les éléments pointElt //
        pointElt[diaporama.compteurImage].classList.add("activation");
        // On désactive le point indicateur de la dernière image (firstClone) en supprimant sa classe "activation"
        pointElt[diaporama.totalImage-1].classList.remove("activation");
      }
    }); // Fin du gestionnaire d'événement de boucle infinie du diaporama
  }, // Fin de la méthode sliderInfini();


  // Méthode pour déplacer le diaporama de la droite vers la gauche (de façon automatique ou à l'aide du clic droit de la souris ou de la flèche droite du clavier)
  deplacerDroite(){
    // On applique la transformation de type "translation" sur l'élément sliderElt...
    // ... pour provoquer son déplacement horizontal par rapport à sa position d'origine
    sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
    // On active le point indicateur correspondant à l'image en cours en lui affectant la classe "activation" qui déclenche le hover (css) sur les éléments pointElt //
    pointElt[diaporama.compteurImage].classList.add("activation");
    // On désactive le point indicateur précédent en supprimant sa classe "activation"
    pointElt[diaporama.compteurImage-1].classList.remove("activation");
    // On appelle la méthode sliderInfini()
    diaporama.sliderInfini();
  },


  // Méthode pour déplacer le diaporama de la gauche vers la droite (à l'aide du clic gauche ou de la flèche gauche du clavier )
  deplacerGauche(){
    // On applique la transformation de type "translation" définie précédemment sur le slider
    sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
    // On active le point indicateur correspondant à l'image en cours en lui affectant la classe "activation" qui déclenche le hover (css) sur les éléments pointElt //
    pointElt[diaporama.compteurImage].classList.add("activation");
    // On désactive le point indicateur précédent en supprimant sa classe "activation"
    pointElt[diaporama.compteurImage+1].classList.remove("activation");
    // On appelle la méthode sliderInfini()
    diaporama.sliderInfini();
  },


  // Méthode pour gérer les événements "click/keydown droit" (flèche et clavier) du diaporama
  clicdroitSlider(){
    // sliderElt est composé de 5 images (+2 clones).
    // Ainsi, son déplacement à partir de sa position en cours doit être au maximum...
    // ... de 5 images vers la droite lorsque l'on clique sur la flèche gauche (compteurImage Max = totalImage-1)
    // ... de 5 images vers la gauche lorsque l'on clique sur la flèche droite (compteurImage Min = 1)
    // Le présent événement provoque l'incrémentation de +1 du compteurImage
    // Cette incrémentation ne doit donc pas dépasser la valeur seuil du compteurImage fixée à totalImage-1 (au delà de laquelle il n'y a plus d'image)
    // Ainsi, si la valeur de compteurImage >= totalImage - 1 alors on met fin à l'execution de la méthode clicdroitSlider();
    if(diaporama.compteurImage >= diaporama.totalImage - 1)return;
    // On définit une transition de type transform sur l'élément slideElt
    sliderElt.style.transition = "transform 0.7s ease-in-out"; // Départ et fin lents - Durée de transition de 0.7s
    // On incrémente la valeur du compteurImage
    diaporama.compteurImage += 1;
    // On appelle la méthode deplacerDroite()
    diaporama.deplacerDroite();
  }, // Fin de la méthode clicdroitSlider();


  // Méthode pour gérer les événements "click/keydown gauche" (flèche et clavier) du diaporama
  clicgaucheSlider(){
    // Le présent événement provoque l'incrémentation de -1 du compteurImage
    // Cette incrémentation ne doit donc pas être inférieure à la valeur seuil du compteurImage fixée à 0 (au delà de laquelle il n'y a plus d'image)
    // Ainsi, si la valeur de compteurImage <= 0 alors on met fin à l'execution de la fonction clicgaucheSlider();
    if(diaporama.compteurImage <= 0)return;
    // On définit une transition de type transform sur l'élément slideElt
    sliderElt.style.transition = "transform 0.7s ease-in-out"; // Départ et fin lents - Durée de transition de 0.7s
    // On incrémente la valeur du compteurImage
    diaporama.compteurImage -= 1;
    // On appelle la méthode deplacerGauche();
    diaporama.deplacerGauche();
  }, // Fin de la méthode clicgaucheSlider();


  // Méthode pour mettre en pause le diaporama
  pauseSlider(){
    // On annule la répétition de la fonction imageSuivante() en utilisant la fonction clearInterval
    clearInterval(diaporama.intervalSlider);
    // Lorsque la fonction "pause" est activée,le bouton pause est masqué ...
    pauseBtn.style.display = "none";
    // ... et le bouton lecture est visible
    playBtn.style.display = "flex";
    playBtn.style.justifyContent = "center";
    playBtn.style.alignItems = "center";
  }, // Fin de la fonction pauseSlider();


  // Méthode pour mettre en lecture le diaporama
  lectureSlider(){
    // On reprend la répétition de la fonction imageSuivante() en utilisant la fonction setInterval
    diaporama.intervalSlider = setInterval(diaporama.imageSuivante, diaporama.timerImage);
    // Lorsque la fonction "play" est activée, le bouton pause est visible, ...
    pauseBtn.style.display = "flex";
    // ... et le bouton lecture est masqué
    playBtn.style.display = "none";
  }, // Fin de la méthode lectureSlider();


  // Méthode pour gérer l'événement de type clic ("onClic") sur le point indicateur courant -------------- //
  imageClic(n){
    // le paramètre n (number) de la fonction prend la valeur de l'élément "pointElt" courant (1 à 5)
    // Au clic de souris sur un point indicateur, ...
    // ... on désactive le point indicateur courant (correspondant à l'image en cours) en lui supprimant sa classe "activation"
    pointElt[diaporama.compteurImage].classList.remove("activation");
    // ... puis on active le point indicateur cliqué en lui affectant la classe "activation" qui déclenche le hover (css) sur les éléments pointElt //
    pointElt[n].classList.add("activation");
    // ... puis on affecte la valeur n au compteurImage pour faire correpondre la valeur du point indicateur cliqué à l'image correspondante
    diaporama.compteurImage = n;
    // On affiche la valeur de imageClic dans la console
    console.log("Valeur imageClic affecté à compteurImage = " + n);
    // On applique ensuite la transformation de type "translation" sur l'élément sliderElt en prenant en compte la nouvelle valeur de compteurImage ...
    // ... pour provoquer son déplacement horizontal par rapport à sa position d'origine
    sliderElt.style.transform = "translateX(" + (-diaporama.sizeImage * diaporama.compteurImage) + "px)";
    // ... on supprime la transition de type transform sur l'élément slideElt pour masquer le défilement et accéder directement à l'image...
    sliderElt.style.transition = "none";
  }

}; // Fin de l'objet diaporama










// ------------------------------- LANCEMENT DU SLIDER - APPEL DE METHODE ------------------------------ //

// Appel de la méthode initialiserSlider() de l'objet diaporama
diaporama.initialiserSlider();
