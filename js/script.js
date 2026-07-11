/* =========================================================
   GESTION CLINIQUE — script.js
   Petit script simple, commenté, sans framework.
   Chaque fonction fait une seule chose.
   ========================================================= */

// On attend que la page soit complètement chargée
document.addEventListener("DOMContentLoaded", function () {
    marquerLienActif();
    afficherDateDuJour();
    activerFormulairePatient();
    activerRechercheTableau();
});

/* ---------- 1. Marque automatiquement le lien du menu
   correspondant à la page affichée ---------- */
function marquerLienActif() {
    const pageActuelle = window.location.pathname.split("/").pop();
    const liens = document.querySelectorAll(".menu-lateral a");

    liens.forEach(function (lien) {
        const cible = lien.getAttribute("href");
        if (cible === pageActuelle) {
            lien.classList.add("lien-actif");
        }
    });
}

/* ---------- 2. Affiche la date du jour dans l'en-tête,
   si un élément avec id="date-jour" existe sur la page ---------- */
function afficherDateDuJour() {
    const zoneDate = document.getElementById("date-jour");
    if (!zoneDate) return; // rien à faire si l'élément n'existe pas

    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const aujourdHui = new Date().toLocaleDateString("fr-FR", options);
    zoneDate.textContent = "Nous sommes le " + aujourdHui + ".";
}

/* ---------- 3. Gère l'envoi du formulaire "Nouveau patient"
   (page patients.html). Pour l'instant, sans backend :
   on ajoute simplement la ligne dans le tableau à l'écran. ---------- */
function activerFormulairePatient() {
    const formulaire = document.getElementById("form-patient");
    if (!formulaire) return;

    formulaire.addEventListener("submit", function (evenement) {
        evenement.preventDefault(); // empêche le rechargement de la page

        const nom = formulaire.nom_patient.value.trim();
        const dateNaissance = formulaire.date_naissance.value;
        const telephone = formulaire.telephone.value.trim() || "—";

        if (nom === "" || dateNaissance === "") {
            return; // le "required" du HTML gère déjà la validation de base
        }

        ajouterLignePatient(nom, dateNaissance, telephone);
        afficherMessageConfirmation();
        formulaire.reset();
    });
}

// Ajoute une nouvelle ligne dans le tableau des patients
function ajouterLignePatient(nom, dateNaissance, telephone) {
    const corpsTableau = document.getElementById("corps-tableau-patients");
    if (!corpsTableau) return;

    const prochainId = corpsTableau.querySelectorAll("tr").length + 1;

    const nouvelleLigne = document.createElement("tr");
    nouvelleLigne.innerHTML = `
        <td>${prochainId}</td>
        <td><strong>${nom}</strong></td>
        <td>${dateNaissance}</td>
        <td>${telephone}</td>
        <td><a href="#" class="lien-action">👁️ Voir Fiche</a></td>
    `;

    corpsTableau.appendChild(nouvelleLigne);
}

// Affiche brièvement un message de confirmation sous le formulaire
function afficherMessageConfirmation() {
    const message = document.getElementById("message-confirmation");
    if (!message) return;

    message.style.display = "block";
    setTimeout(function () {
        message.style.display = "none";
    }, 3000);
}

/* ---------- 4. Filtre en direct la liste des patients
   au fur et à mesure que l'on tape dans la barre de recherche ---------- */
function activerRechercheTableau() {
    const champRecherche = document.getElementById("recherche-patient");
    const corpsTableau = document.getElementById("corps-tableau-patients");
    if (!champRecherche || !corpsTableau) return;

    champRecherche.addEventListener("input", function () {
        const texteRecherche = champRecherche.value.toLowerCase();
        const lignes = corpsTableau.querySelectorAll("tr");

        lignes.forEach(function (ligne) {
            const nomPatient = ligne.textContent.toLowerCase();
            const correspond = nomPatient.includes(texteRecherche);
            ligne.style.display = correspond ? "" : "none";
        });
    });
}
