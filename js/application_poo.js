/*
Création d'une carte interactive qui récupère des données à partir d'une API et permet de réserver un vélo
*/





// ------------------------------------- IDENTIFICATION DES ELEMENTS DU DOM ----------------------------- //

let zoneReservation = document.getElementById("reservation"); // Balise <div> ayant pour identifiant "reservation"

let formulaireElt = document.getElementById("formulaire"); // Balise <form> ayant pour identifiant "formulaire"

let adresseElt = document.getElementById("contenuAdresse"); // Balise <span> ayant pour identifiant "contenuAdresse"

let blocAdresseElt = document.getElementById("adresse"); // Balise <div> ayant pour identifiant "adresse"

let placesElt = document.getElementById("nombrePlaces"); // Balise <span> ayant pour identifiant "nombrePlaces"

let blocPlacesElt = document.getElementById("places"); // Balise <div> ayant pour identifiant "places"

let velosElt = document.getElementById("nombreVelos"); // Balise <span> ayant pour identifiant "nombreVelos"

let blocVelosElt = document.getElementById("velos"); // Balise <div> ayant pour identifiant "velos"

let popupElt = document.getElementsByClassName("leaflet-popup-content"); // Balise <div> ayant pour classe "leaflet-popup-content" (contenu des popup)

let dispoElt = document.getElementById("station_disponible"); // Balise <div> ayant pour identifiant station_disponible

let nondispoElt = document.getElementById("station_non_disponible"); // Balise <div> ayant pour identifiant station_non_disponible

let aideNomElt = document.getElementById("aideNom"); // Balise <span> ayant pour identifiant aideNom

let aidePrenomElt = document.getElementById("aidePrenom"); // Balise <span> ayant pour identifiant aidePrenom

let messageElt = document.getElementById("messageReservation") // Balise <div> ayant pour identifiant messageReservation

let timerElt = document.getElementById("timer"); // Balise <div> ayant pour identifiant "timer"

let signatureElt = document.getElementById("blocSignature"); // Balise <div> ayant pour identifiant "blocSignature"

let confirmationElt = document.getElementById("confirmationReservation"); // Balise <div> ayant pour identifiant "confirmationReservation"

let boutonReserver = document.getElementById("reserver"); // Balise <input> ayant pour identifiant "reserver"

let annulerElt = document.getElementById("annuler"); // Balise <button> ayant pour identifiant "annuler"

let informationElt = document.getElementById("information"); // Balise <div> ayant pour identifiant "information"

let alerteElt = document.getElementById("alerte"); // Balise <div> ayant pour identifiant "alerte"

let btnSaveElt = document.getElementById("btnSave"); // Balise <input> ayant pour identifiant "btnSave"

let velosRestantElt = document.getElementById("velosRestant"); // Balise <span> ayant pour identifiant "velosRestant"

let actualisationVelosElt = document.getElementById("actualisationVelos"); // Balise <div> ayant pour identifiant "actualisationVelos"

let cyclisteElt = document.getElementById("image_cycliste"); // Balise <div> ayant pour identifiant image_cycliste

let votreReservationElt = document.getElementById("votre_reservation"); // Balise <div> ayant pour identifiant votre_reservation

let nomElt = document.getElementById("nom"); // Balise <input> ayant pour identifiant nom

let prenomElt = document.getElementById("prenom"); // Balise <input> ayant pour identifiant nom

let noCyclisteElt = document.getElementById("image_nocycliste"); // Balise <img> ayant pour identifiant image_nocycliste












// ------------------------------------- CREATION D'UNE CLASSE OBJET TIMER --------------------------------- //

class Timer {
    constructor(minutesInitial,secondesInitial){

    // Définition d'un constructeur d'objet "Timer" avec ses propriétés :

        this.minutesInitial = minutesInitial;
        this.secondesInitial = secondesInitial;
        this.tempsInitial = this.minutesInitial*60 + this.secondesInitial; // Temps total à décompter (en secondes)
        this.compteur = 0; // Compteur de temps qui s'incrémente (valeur initiale = 0)
    }

    // ... et ses méthodes :

    // Méthode qui gère le décompte du temps restant
    decompter(compteur,tempsInitial){
        //Pendant le décompte, on masque le bouton réserver pour empêcher un nouvel envoi du formulaire
        boutonReserver.style.display = "none";
        // On appelle une fonction qui incrémente le compteur toutes les secondes à l'aide de setInterval
        let intervalId = setInterval(function () {
            // On incrémente le compteur à chaque nouvel appel de la fonction
            compteur++;
            // On définit une variable qui stocke la valeur du temps restant (en secondes)
            let tempsRestant = tempsInitial - compteur;
            // Si le temps restant est supérieur strictement à 0, ...
            if (tempsRestant > 0) {
                // ... alors on appelle ensuite la fonction convertirSecondes() avec le paramètre tempsRestant...
                // ... Ceci afin de convertir le temps restant (exprimé en secondes), en minutes et en secondes
                // On stocke la valeur de retour de la fonction convertirSecondes(tempsRestant) dans la variable tempsConverti
                let tempsConverti = timerReservation.convertirSecondes(tempsRestant);
                // Puis on affiche la valeur du temps restant (après convertion) dans le DOM, actualisé à chaque appel de la fonction ddecompter (soit toutes les secondes)
                timerElt.textContent = "Il vous reste " + tempsConverti + " pour récupérer votre vélo.";
                // On affiche le timer de réservation
                timerElt.style.display = "block";
                timerElt.style.color = "#4f5054";
                // Pour Stopper le décompte avant l'échéance de fin du timer en appuyant sur un bouton...
                // On affiche le bouton annuler
                annulerElt.style.display = "block";
                // ... on définit un gestionnaire d'événement de type click pour stopper le compteur et effacer les données stockées pour la réservation
                annulerElt.addEventListener("click", function(e){
                    // On annule la répétition de la fonction avec setInterval
                    clearInterval(intervalId);
                    // On efface les données stockées en utilisant la méthode storage.clear()
                    sessionStorage.clear();
                    // On affiche un message d'annulation dans le document
                    messageElt.textContent = "Votre réservation est annulée";
                    messageElt.style.backgroundColor = ("#f9cf72");
                    messageElt.style.fontWeight =("bold");
                    // On masque l'information de prise en compte de la réservation
                    votreReservationElt.style.display = ("none");
                    // On vérifie dans la console les valeurs stockées :
                    console.log("Valeur des données stockées : " + window.sessionStorage.length);
                    console.log("Données sauvegardées le :" + sessionStorage.getItem("dateReservation") + " - Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom") + " - Station réservée :  " + sessionStorage.getItem("station"));
                    annulerElt.style.display = "none"; // On masque le bouton annuler
                    timerElt.style.display = "none"; // On masque l'affichage du timer de réservation
                    dispoElt.style.display = ("none"); // On masque le message de disponibilité
                    formulaireElt.style.display = "none"; // On masque le formulaire de réservation
                    blocAdresseElt.style.display = ("none"); // ... on masque l'affichage de l'adresse de la station
                    blocPlacesElt.style.display = ("none"); // ... on masque l'affichage du nombre d'emplacements libres
                    blocVelosElt.style.display = ("none"); // ... on masque l'affichage du nombre de vélos disponibles
                    informationElt.style.display = "block"; // On affiche le message d'information
                    alerteElt.style.display = "none"; // On masque le message d'alerte
                    actualisationVelosElt.style.display = "none"; // On masque l'affichage du nombre de vélos restant
                    cyclisteElt.style.display = ("block"); // On affiche l'image du cycliste
                    noCyclisteElt.style.display = ("none"); // ... on masque l'image no-cycliste
                    nondispoElt.style.display = ("none"); // ... on masque le message d'indisponibilité
                });
            }
            // Si le temps restant est inférieur ou égal à 0) ...
            if (tempsRestant <= 0){
                // On annule la répétition de la fonction avec setInterval
                clearInterval(intervalId);
                // Puis on affiche le message suivant dans le DOM
                timerElt.textContent = "Le temps de validité de votre réservation est expiré.";
                timerElt.style.color = "#d11b1b";
                timerElt.style.fontWeight = "normal";
                // On efface les données stockées en utilisant la méthode storage.clear()
                sessionStorage.clear();
                // ... et on modifie le message destiné à l'utilisateur
                messageElt.textContent = "Vos données de réservation ont été effacées. Veuillez effectuer une nouvelle réservation."
                messageElt.style.backgroundColor = "#d11b1b";
                messageElt.style.color = "#f5f5f5";
                messageElt.style.fontWeight = "bold";
                annulerElt.style.display = "none"; // ... on masque le bouton annuler
                timerElt.style.display = "none"; // On masque l'affichage du timer de réservation
                informationElt.style.display = "block"; // On affiche le message d'information d'accueil
                votreReservationElt.style.display = ("none"); // On masque l'information de prise en compte de la réservation
                alerteElt.style.display = "none"; // On masque le message d'alerte
                signatureElt.style.display = "none"; // On masque l'affichage du bloc de signature
                actualisationVelosElt.style.display = "none"; // On masque l'affichage du nombre de vélos restant
                blocAdresseElt.style.display = ("none"); // ... on masque l'affichage de l'adresse de la station
                blocPlacesElt.style.display = ("none"); // ... on masque l'affichage du nombre d'emplacements libres
                blocVelosElt.style.display = ("none"); // ... on masque l'affichage du nombre de vélos disponibles
                // On vérifie dans la console les valeurs stockées :
                console.log("Valeur des données stockées : " + window.sessionStorage.length);
                console.log("Données sauvegardées le :" + sessionStorage.getItem("dateReservation") + " - Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom") + " - Station réservée :  " + sessionStorage.getItem("station"));
                // A la fin du décompte, on affiche de nouveau le bouton réserver
                boutonReserver.style.display = "block";
            }
        }, 1000); // Fin de la fonction setInterval
    } // Fin de la méthode décompter


    // Méthode qui convertit les secondes en minutes
    convertirSecondes(totalSecondes) {
        // On convertit dans un premier temps les secondes en minutes ...
        // ... Pour cela , on définit une variable qui stocke la valeur du plus grand entier inférieur ou égal,...
        // ... résultat de la division du nombre de secondes par 60 (pour obtenir un nombre entier de minutes)
        let minutes = Math.floor(totalSecondes/60);
        // Puis on calcule le nombre de secondes restantes
        // On définit une variable qui stocke la valeur du modulo (le reste) de la division des secondes par 60,...
        // ... pour obtenir le nombre de secondes restantes
        let secondes = totalSecondes%60;
        // On stocke les valeurs des minutes et des secondes du timer dans le sessionStorage
        sessionStorage.setItem("minutes", minutes); // Pour les minutes restantes
        sessionStorage.setItem("secondes", secondes); // Pour les secondes restantes
        // On définit une valeur de retour à la méthode
        return minutes + " minute(s) et " + secondes + " seconde(s)"
    } // Fin de la méthode convertirSecondes

} // Fin de la classe objet timer



// --------------------------------- CREATION D'UN NOUVEL OBJET "TIMER RESERVATION" -------------------------------

// Création de l'objet timerReservation par instanciation avec les arguments minutes (20) et secondes(00)
// Le timer efface les données sauvegardées dans le sessionStorage à la fin du décompte.
const timerReservation = new Timer(20,00);












// ------------------------------------- CREATION D'UN OBJET RESERVATION -------------------------------- //

// On créée un objet réservation et on le stocke dans une variable
const reservation = {

    // On définit dans un premier temps les propriétés de l'objet réservation

    // Propriété qui stocke la carte de Lyon fournie par l'API Leaflet - Coordonnées setView //
    mymap: L.map('mapid',{scrollWheelZoom:false}).setView([45.75, 4.85], 14),
    // Propriété qui stocke les marqueurs verts utilisés pour la carte des réservations
    greenIcon: L.icon({ // Marqueurs verts
        iconUrl: '../img/map_marker_green.png',
        iconSize:     [35, 35], // Taille de l'icone
        iconAnchor:   [15, 35], // Point de rattachement de l'icone au marqueur de localisation
        popupAnchor:  [3, -35] // Positionnement de la fenêtre popup par rapport au point de rattachement de l'icone
    }),
    // Propriété qui stocke les marqueurs  oranges utilisés pour la carte des réservation
    orangeIcon: L.icon({ // Marqueurs oranges
        iconUrl: '../img/map_marker_orange.png',
        iconSize:     [35, 35],
        iconAnchor:   [15, 35],
        popupAnchor:  [3, -35]
    }),
    // Propriété qui stocke les marqueurs rouges utilisés pour la carte des réservations
    redIcon: L.icon({ // Marqueurs rouges
        iconUrl: '../img/map_marker_red.png',
        iconSize:     [35, 35],
        iconAnchor:   [15, 35],
        popupAnchor:  [3, -35]
    }),
    // Propriété qui fixe la valeur initiale du contenu du canvas "vide" dans la console
    canvasVide: canvas.toDataURL().length,
    // Propriété qui stocke la valeur actualisée du contenu du canvas
    contenuCanvas:"",
    // Propriété qui stocke la valeur booléenne qui va conditionner l'état de la réservation
    validerReservation: "",



    // On définit ensuite les méthodes qui fixent les fonctionnalités de l'objet réservation

    // Méthode qui inttialise les données de réservation stockées au lancement de l'applicationn
    initialisation() {
        // ... On affiche la valeur initiale du contenu du canvas "vide" dans la console
        console.log("La valeur du contenu du canvas est " + canvas.toDataURL().length);
        // On vide la contenu du canvas
        reservation.contenuCanvas ="";
        // ... on masque le bouton annuler
        annulerElt.style.display = "none";
        // ... on affiche dans la console les informations stockées dans la sessionStorage
        console.log("Il y a des infos stockées : " + "Dernières données sauvegardées le :" + sessionStorage.getItem("dateReservation") + " - Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom") + " - Station réservée :  " + sessionStorage.getItem("station") + " - Timer minutes = " + sessionStorage.getItem("minutes") + " - Timer secondes = " + sessionStorage.getItem("secondes"));
        // On préremplit le formulaire si des données sont stockées dans le localStorage
        if (window.localStorage.length > 0){
            // On affiche dans la console les données stockées
            console.log("Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom"));
            // On pré-remplit les champs du formulaire avec les données existantes stockées dans le localStorage
            nomElt.value = localStorage.getItem("nom");
            prenomElt.value = localStorage.getItem("prenom");
        }
        // On affiche les éléments de la dernière réservation en cours si des données sont stockées dans le sessionStorage
        if (window.sessionStorage.length > 0) {
            alerteElt.style.display = "block"; // ... on affiche le message d'alerte indiquant une réservation en cours
            informationElt.style.display = "none"; // On affiche le message d'information d'accueil
            annulerElt.style.display = "block"; // ... on affiche le bouton annuler
            // Puis on affiche le dernier message de réservation dans le DOM
            messageElt.textContent = "Vélo réservé à la station " + sessionStorage.getItem("station") + " par " + localStorage.getItem("prenom") + " " + localStorage.getItem("nom");
            messageElt.style.display = ("block");
            messageElt.style.fontWeight = "bold";
            messageElt.style.backgroundColor = "#bbe4f7";
            // On reprend le décompte en utilisant l'objet "timer" à partir des données stockées dans le sessionStorage
            // On récupère pour cela la valeur des minutes et des secondes stockées dans le sessionStorage et on les convertit en nombre
            let stockageMin = Number.parseInt(sessionStorage.getItem("minutes"), 10); // Pour les minutes restantes
            console.log("Minutes restantes : " + stockageMin); // On affiche les minutes restantes dans la console
            let stockageSec = Number.parseInt(sessionStorage.getItem("secondes"), 10); // Pour les secondes restantes
            console.log("Secondes restantes : " + stockageSec); // On affiche les secondes restantes dans la console
            // On créée ensuite d'un nouvel objet newtimerReservation par instanciation avec les arguments stockageMin et stockageSec
            const newtimerReservation = new Timer(stockageMin, stockageSec);
            // On affiche dans la console, le nouveau temps initial de l'objet newtimerReservation
            console.log("Nouveau temps initial en secondes = " + newtimerReservation.tempsInitial);
            // Puis on appelle la méthode decompter de l'objet timerReservation pour réintialiser le timer avec un nouveau temps initial
            timerReservation.decompter(newtimerReservation.compteur, newtimerReservation.tempsInitial);
            // On affiche de nouveau le timer de réservation
            timerElt.style.display = "block";
        }
        noCyclisteElt.style.display = "none"; // ... on masque l'image no-cycliste
        // On appelle la méthode creerCarte de l'objet réservation
        reservation.creerCarte();
    }, // Fin de la méthode initialisation


    // Méthode qui créée une nouvelle carte pour la réservation à l'aide l'API Leaflet
    creerCarte() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(reservation.mymap);
        // On appelle la méthode getData de l'objet réservation
        reservation.getData();
    }, // Fin de la méthode creerCarte


    // Méthode getData qui lance un appel ajax pour récupérer et exploiter les données dynamiques de l'API JC Decaux "Vélos en libre accès"
    getData(){
        // On lance ensuite un appel Ajax pour récupérer les données dynamiques de l'API qui nous intéressent :
        // - la position GPS des stations de vélos (latitude et longitude)
        // - la disponibilité des vélos en temps réel et le nombre d'emplacements libres
        // Le lancement de l'appel Ajax nécessite :
        // - une clé (api_key) obtenue en créant un compte sur la plateforme JC DECAUX : clé = 96c66ad4dff73ef2c7ec4fe96829b08c6d7100b1
        // - un nom de contrat associé à la ville choisie : Lyon
        ajaxGet("https://api.jcdecaux.com/vls/v3/stations?contract=Lyon&apiKey=96c66ad4dff73ef2c7ec4fe96829b08c6d7100b1", function(reponse){
            // On transforme la réponse JSON en un tableau d'objets de stations de vélos Javascript
            let infoStations = JSON.parse(reponse);
            // On parcourt tous les objets station ...
            infoStations.forEach(station => {
                // On affiche les objets stations dans la console
                console.log(station);
                // Pour chaque objet station, on ajoute un marqueur sur la carte
                // On récupère pour cela les valeurs des propriétés position latitude et longitude des objets station de l'API JC DECAUX...
                // Puis on les utilise pour afficher les marqueurs sur la carte à l'aide de l'API Leaflet
                // On définit pour cela une variable typeIcon pour choisir un type de marqueur selon la disponibilité de la station
                let typeIcon="";
                // Si il n'y a plus de vélo dans la station ou si la station est fermée ...
                if ((station.totalStands.availabilities.bikes === 0) || (station.status === "CLOSED")){
                  // ... Alors les marqueurs sont rouges
                  typeIcon = reservation.redIcon;
                }
                // S'il reste moins de 25% de vélos dans la station,
                if ((station.totalStands.availabilities.bikes > 0 ) && (station.totalStands.availabilities.bikes <= 5)) {
                    // ... Alors les marqueurs sont oranges
                    typeIcon = reservation.orangeIcon;
                }
                if (station.totalStands.availabilities.bikes > 5){
                    // ... Alors les marqueurs sont verts
                    typeIcon = reservation.greenIcon;
                }
                // On ajoute les marqueurs sur la carte
                let marker = L.marker([station.position.latitude, station.position.longitude],{icon: typeIcon}).addTo(reservation.mymap);
                // On indique enfin, sous forme de popup les informations concernant la station à l'aide de la méthode bindPopup de l'API Leaflet...
                marker.bindPopup("<b>Station</b><br>" + station.name + "<br><b>Statut</b><br>" + station.status);
                // On créée un événement de type "click" sur l'élément marker pour récupérer les informations de la station et les afficher dans le bloc de réservation
                marker.addEventListener("click",function(e){
                    // On affiche les informations des stations dans le panneau :
                    // On affecte la valeur de la propriété station.adress à l'élément adresseElt pour afficher l'adresse
                    adresseElt.textContent = station.address;
                    // On affecte la valeur de la propriété station.totalStands.availabilities.stands à l'élément placesElt pour afficher le nombre d'emplacements libres
                    placesElt.textContent = station.totalStands.availabilities.stands;
                    // On affecte la valeur de la propriété station.totalStands.availabilities.bikes à l'élément velosElt pour afficher le nombre de vélos
                    velosElt.textContent = station.totalStands.availabilities.bikes;

                    // On gère ensuite l'accès à la réservation d'un vélo
                    // Si il n'y a plus de vélo dans la station ou si la station est fermée ...
                    if ((station.totalStands.availabilities.bikes === 0) || (station.status === "CLOSED")){
                        // ... Alors ...
                        informationElt.style.display = "block"; // On affiche le message d'information d'accueil
                        blocAdresseElt.style.display = ("none"); // ... on masque l'affichage de l'adresse de la station
                        blocPlacesElt.style.display = ("none"); // ... on masque l'affichage du nombre d'emplacements libres
                        blocVelosElt.style.display = ("none"); // ... on masque l'affichage du nombre de vélos disponibles
                        nondispoElt.style.display = ("block"); // ... on affiche le message d'indisponibilité
                        dispoElt.style.display = ("none"); // ... on supprime le message de disponibilité et le formulaire de réservation
                        signatureElt.style.display = ("none"); // ... on supprime le bloc de signature Canvas
                        cyclisteElt.style.display = ("none"); // ... on masque l'image du cycliste
                        votreReservationElt.style.display = ("none"); // ... on masque l'information de prise en compte de la réservation
                        image_nocycliste.style.display = ("block"); // ... on affiche l'image no-cycliste
                        noCyclisteElt.style.display = ("block"); // ... on affiche l'image no-cycliste
                        alerteElt.style.display = "none"; // ... on masque le message d'alerte indiquant une réservation en cours

                    // S'il y a des vélos dans la station ou si la station est ouverte ...
                    } else {
                        // ... Alors :
                        blocAdresseElt.style.display = ("block"); // ... on affiche l'adresse de la station
                        blocPlacesElt.style.display = ("block"); // ... on affiche le nombre d'emplacements libres
                        blocVelosElt.style.display = ("block"); // ... on affiche le nombre de vélos disponibles
                        dispoElt.style.display = ("block"); // ... on affiche le message de disponibilité et le formulaire de réservation
                        nondispoElt.style.display = ("none"); // ... on supprime le message d'indisponibilité
                        boutonReserver.style.display = "block"; // ... on affiche le bouton réserver du formulaire
                        signatureElt.style.display = ("none"); // ... on masque le bloc de signature Canvas
                        cyclisteElt.style.display = ("none"); // ... on masque l'image du cycliste
                        votreReservationElt.style.display = ("none"); // ... on masque l'information de prise en compte de la réservation
                        noCyclisteElt.style.display = ("none"); // ... on masque l'image no-cycliste

                        // Il est possible de réserver si et seulement si il n'y a pas de réservation en cours
                        // Il faut donc vérifier au préalable qu'il n'y a pas déjà des données stockées dans le sessionStorage,
                        // ... caractérisant une réservation en cours
                        // S'il y a des données stockées et donc une réservation en cours, alors ...
                        if (window.sessionStorage.length > 0){
                            boutonReserver.style.display = "none"; // ... on masque le bouton réserver pour empêcher la réservation
                            informationElt.style.display = "none"; // ... on masque le message d'information d'accueil
                            alerteElt.style.display = "block"; // ... on affiche un message d'alerte pour l'utilisateur pour lui indiquer qu'une réservation est en cours
                            // ... on affiche dans la console les informations stockées dans la sessionStorage
                            console.log("Il y a des infos stockées : " + "Dernières données sauvegardées le :" + sessionStorage.getItem("dateReservation") + " - Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom") + " - Station réservée :  " + sessionStorage.getItem("station") + " - Timer minutes = " + sessionStorage.getItem("minutes") + " - Timer secondes = " + sessionStorage.getItem("secondes"));
                            // ... on affiche le bouton annuler
                            annulerElt.style.display = "block";
                            // Puis on affiche le message de réservation dans le DOM
                            messageElt.textContent = "Vélo réservé à la station " + sessionStorage.getItem("station") + " par " + localStorage.getItem("prenom") + " " + localStorage.getItem("nom");
                            messageElt.style.display = "block";
                            messageElt.style.fontWeight = "bold";
                            messageElt.style.backgroundColor = "#bbe4f7";
                            messageElt.style.color = "#4f5054";
                            confirmationElt.style.marginLeft = "0px";
                        // Sinon (s'il n'y a pas de réservation en cours)...
                        } else {
                            formulaireElt.style.display = "block"; // On affiche le formulaire de réservation
                            boutonReserver.style.display = "block"; // On affiche de nouveau le bouton réserver
                            informationElt.style.display = "block"; // On affiche le message d'information d'accueil
                            alerteElt.style.display = "none"; // On masque le message d'alerte
                            // On appelle la méthode reserver() de l'objet réservation pour réserver la station choisie - Elle prend comme paramètre le nom de la station et le nombre de vélos disponibles de la station
                            reservation.reserver(station.name, station.totalStands.availabilities.bikes);
                         }
                    }
                }); // Fin du gestionnaire d'événement de type "click" sur le marqueur
          }); // Fin de la boucle forEach
        }); // Fin de l'appel AJAX
    },// Fin de la méthode getData()


    // Méthode qui gère la réservation de la station choisie par l'utilisateur
    reserver(stationChoisie, nombreVelosStation){ // Le paramètre stationChoisie prend la valeur de station.name
        // On définit un gestionnaire d'événement pour récupérer et stocker les données
        formulaireElt.addEventListener("submit", function(e){
            // On récupère les valeurs saisies par l'utilisateur dans les champs du formulaire
            let nomUtilisateur = formulaire.elements.nom.value;
            let prenomUtilisateur = formulaire.elements.prenom.value;
            // On affiche ces valeurs dans la console
            console.log("Données en attente - Prénom : " + prenomUtilisateur  + " - Nom : " + nomUtilisateur + " - Station choisie : " + stationChoisie);
            // On annule l'envoi des données vers un serveur avec la méthode preventDefault()
            e.preventDefault();
            // On vérifie la validité du format des informations saisies par l'utilisateur dans le formulaire...
            // Les informations (nom et prénom) doivent obligatoirement être constitués de caractères alphabétiques
            // On utilise la méthode de test regex pour s'assurer que l'expression régulière suivante est vérifiée :
            let regex = /[^a-zA-Z]/;
            // On teste la validité du prénom de l'utilisateur
            // Si le prénom saisi contient d'autres caractères que des caractères alphabétiques,...
            if(regex.test(prenomUtilisateur)){
                // ... alors on affecte le contenu textuel suivant à l'élément aidePrénom
                aidePrenom.textContent = "Prénom invalide";
                // ... puis on annule l'envoi des données avec la méthode preventDefault()
                e.preventDefault();
            } else {
                // ... Sinon on affecte le contenu textuel suivant à l'élément aidePrénom
                aidePrenom.textContent = "";
            }
            // On teste la validité du nom de l'utilisateur
            // Si le nom saisi contient d'autres caractères que des caractères alphabétiques,...
            if (regex.test(nomUtilisateur)){
                // ... alors on affecte le contenu textuel suivant à l'élément aidePrénom
                aideNom.textContent = "Nom invalide";
                // ... puis on annule l'envoi des données avec la méthode preventDefault()
                e.preventDefault();
            } else {
                // ... Sinon on affecte le contenu textuel suivant à l'élément aideNom
                aideNom.textContent = "";
            }
            // On définit ensuite une variable de type booléenne qui va conditionner l'état de la réservation
            reservation.validerReservation = "";

            if (regex.test(prenomUtilisateur) || regex.test(nomUtilisateur)) {
                reservation.validerReservation = false;
            } else {
                reservation.validerReservation = true;
            }
            // ... On affiche le bloc de signature Canvas
            signatureElt.style.display = ("block");
            // ... On affiche le message de réservation
            messageElt.style.display = ("block");
            // ... et on modifie le message destiné à l'utilisateur
            messageElt.textContent = ("Réservation en cours...");
            messageElt.style.backgroundColor = ("#bbe4f7");
            messageElt.style.color = ("#4f5054");
            confirmationElt.style.marginLeft = ("0px");

            // On actualise le nombre de vélos disponibles dans la stations après la réservation
            let velosRestant = nombreVelosStation - 1;
            // Si la réservation est valide ...
            if (reservation.validerReservation){
                boutonReserver.style.display = "none"; // On masque le bouton réserver pour empêcher la réservation
                dispoElt.style.display = ("none"); // On masque le message de disponibilité et le formulaire
                informationElt.style.display = ("none"); // On masque le message d'information initial
                // On affiche le message d'information indiquant à l'utilisateur que la demande de réservation a bien été prise en compte...
                // ... et que la signature est nécessaire pour valider définitivement la réservation
                votreReservationElt.style.display = ("block");
                cyclisteElt.style.display = ("block"); // On affiche l'image du cycliste
                // ... On affiche la valeur initiale du contenu du canvas "vide" dans la console
                console.log("La valeur du contenu du canvas est " + canvas.toDataURL().length);
                // On réinitialise le contenu du canvas (on le vide)
                reservation.contenuCanvas = reservation.canvasVide;
                console.log("La valeur du contenu du canvas vide après annulation est " + reservation.canvasVide);
                // On définit un gestionnaire d'événement sur le bouton valider du bloc signature ...
                // ... Pour valider définitivement la réservation après la signature de l'utilisateur sur le canvas
                btnSaveElt.addEventListener("click", function(e){
                    // Au clic, ...
                    // On récupère la valeur actuelle du contenu du canvas
                    reservation.contenuCanvas = canvas.toDataURL().length;
                    // Si le canvas n'est pas vide (si la signature est présente)
                    if (reservation.contenuCanvas > reservation.canvasVide){
                        // ... on masque le bloc de signature
                        signatureElt.style.display = "none";
                        // ... et on appelle enfin la méthode stockerInfos avec les paramètres suivants :
                        reservation.stockerInfos(nomUtilisateur, prenomUtilisateur, stationChoisie, reservation.validerReservation, velosRestant);
                        // On réinitialise le contenu du canvas (on le vide)
                        reservation.contenuCanvas = reservation.canvasVide;
                        // ... On affiche la valeur du contenu du canvas après la réservation
                        console.log("La valeur du contenu du canvas après réservation est " + reservation.contenuCanvas);
                    } else {
                        // Sinon, si le canvas est vide (il n'y a pas de signature), alors on affiche l'alerte suivante :
                        alert("Attention, votre signature est requise pour valider définitivement votre réservation.");
                    }
                });
            // Si les conditions requises pour la réservation dans le formulaire ne sont pas validées ...
            } else {
                // ... alors on affiche une alerte
                alert("Attention, veuillez vérifier la saisie. Seuls les caractères alphabétiques sont autorisés.");
                // ... On masque le bloc de signature Canvas
                signatureElt.style.display = ("none");
            }
        }); // Fin de l'événement "submit" du formulaireElt
    }, // Fin de la méthode reserver()


    // Méthode qui gère le stockage des informations de la réservation - Utilisation de l'API Web Storage
    stockerInfos(nom, prenom, station, validationOK, velos){
        // On stocke le nom et le prénom de l'utilisateur dans le localStorage : les données ne seront pas effacées après la fermeture de la fenêtre ou du navigateur
        // On accède à l'objet localStorage et on lui ajoute une nouvelle entrée
        let stockageNom = localStorage.setItem ("nom", nom); // Stockage du nom de l'utilisateur dans le localStorage
        let stockagePrenom = localStorage.setItem("prenom", prenom); // // Stockage du prénom de l'utilisateur dans le localStorage
        // On stocke le nom de la station choisie par l'utilisateur dans le sessionStorage : les données seront effacées après la fermeture de la fenêtre ou du navigateur
        let stockageStation = sessionStorage.setItem("station", station);
        // On stocke la date de réservation dans le sessionStorage
        let dateReservation = new Date(); // infos concernant l'heure du clic
        sessionStorage.setItem("dateReservation", dateReservation);
        // On vérifie dans la console les valeurs stockées :
        console.log("Valeur des données stockées : " + window.sessionStorage.length);
        console.log("Données sauvegardées le :" + sessionStorage.getItem("dateReservation") + " - Nom stocké : " + localStorage.getItem("nom") + " - Prénom stocké : " + localStorage.getItem("prenom") + " - Station réservée :  " + sessionStorage.getItem("station"));
        console.log ("Nombre de vélos restant : " + velos);
        // Puis on affiche le message de réservation dans le DOM
        messageElt.textContent = "Vélo réservé à la station " + sessionStorage.getItem("station") + " par " + localStorage.getItem("prenom") + " " + localStorage.getItem("nom");
        messageElt.style.display = "block";
        messageElt.style.fontWeight = "bold";
        messageElt.style.backgroundColor = "#bbe4f7";
        messageElt.style.color = "#4f5054";
        confirmationElt.style.marginLeft = "0px";
        // On lance enfin le décompte en utilisant l'objet "timer"
        // On appelle la méthode decompter de l'objet timerReservation pour intialiser le timer
        timerReservation.decompter(timerReservation.compteur,timerReservation.tempsInitial);
        // On affiche le nombre de vélos restant
        actualisationVelosElt.style.display = "block";
        velosRestantElt.textContent = velos;
        // On actualise également l'affichage du nombre de vélos restant dans le panneau d'information
        velosElt.textContent = velos;
    } // Fin de la méthode stockerInfos()

} // Fin de l'objet reservation









// --------------------------------- LANCEMENT DE L'APPLICATION  - APPEL DE METHODE -------------------------------- //

// Appel de la méthode intialisation() de l'objet reservation
reservation.initialisation();
