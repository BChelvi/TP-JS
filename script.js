//declaration de variables globales

//tableau des input
const inputDevises = document.querySelectorAll("input");//node Array qui comporte tous nos inputs

//fonctions

//fonction qui se lance au chargement de la page
//options : sauvegarder le dernier taux de change récupérer en local et vérifier si le fetch est possible
function Init(){
    prevent("form","submit");
    getChange();//on va d'abord récupérer le taux de change avant de pouvoir exécuter le reste
}

//function qui prévient le comportement natif d'un element html
function prevent(htmlElement,comportement){
    const elt = document.querySelector(htmlElement);
    elt.addEventListener(comportement,(element)=>{
        element.preventDefault();
    })

}

//function qui récupère le taux de change en asynchrone
function getChange(){
    return fetch(` https://coopernet.fr/ratechf.php`)
    .then(response => {
        console.log("data reçues dans getChange avant json() :", response);
        if (response.status === 200) return response.json();
        else throw new Error("Problème de réponse ", response);
        //options : utilisée la valeur de taux sauvergardée en locale
      })
      .then(data => {
        console.log("data reçues dans getChange :", data);
        if (data) {
            //une fois le taux de change récupéré en asynchrone on peut lancer le reste du script
            ListenAllInputs(data.rate);
        } else {
          throw new Error("Problème de data ", data);
          //options : utilisée la valeur de taux sauvergardée en locale
        }
      })
      .catch(error => { console.error("Erreur attrapée dans getChange", error); });
  };

//function qui crée un listener sur chaque input en conserevant le taux de change fetché

function ListenAllInputs(tauxChange){
    inputDevises.forEach((element)=>{
        listenInput(element,tauxChange);
    })
}

//fonction qui crée un listener sur un input, récuère sa valeur, son id et appelle la foncion de change puis modifie l'autre input

function listenInput(input,tauxChange){
    input.addEventListener("input",()=>{
        isNbr(input.value,input.id);//on verifie si c'est bien des nombres
        let deviseChange = caclculDevise(input.value,input.id,tauxChange);//on enregistre le calcul
        let inputChange = changeInput(input.id);//on enregistre l'input cible
        showChange(inputChange,deviseChange);//on appelle la fonction qui modifie l'affichage de l'autre inpu
    })
}


//function qui calcule le taux de change avec en argument le nombre, la devise d'origine et le taux de change
//option : rajouté un math round pour arrondir ; rajouter une devise finale;

function caclculDevise(nombre,devise,tauxChange){
    let taux;
    let result;
    devise == "euros" ? taux = tauxChange : taux =(1/tauxChange); //opérateur ternaire pour choisir le sens de conversion
    result = nombre*taux;
    return result;
}

//function qui modifie l'input opposé
function changeInput(inputId){
    let inputOpposed;
    inputId == "euros" ? inputOpposed = "fs" : inputOpposed = "euros";
    return inputOpposed;
}

//function qui modifie l'affichage d'un input
function showChange(inputId,nbr){
    let newInput = document.getElementById(inputId);
    newInput.value = nbr;
}

//function qui vérifie si la valeur rentrée est bien un nombre
//option : vérifié en amont l'entrée sur un "onchange" avant de modifié la value dans l'input
function isNbr(inputValue,inputId){
   if (isNaN(inputValue)) {
    alert("Veuillez rentrer un nombre");
    clearInput(inputId);
   }
}

//function qui efface la valeur d'un input
function clearInput(inputId){
    let input = document.getElementById(inputId);
    input.value = "";
}





