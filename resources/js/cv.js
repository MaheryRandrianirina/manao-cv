import { find, includes, replace } from "lodash";
import DOMInteractions from "./modules/DOMInteractions";
import CameraIcon from "./icons/camera-icon";

export default class CVModels {

    constructor(){
        this.dom = new DOMInteractions();

        const cvForm = document.querySelector('.cv-form .cv');
        if(cvForm){
            this.transformIntoForm();
            this.filling();
        }
    }

    transformIntoForm()
    {
        const cv = document.querySelector('.cv');
        const form = this.dom.createElement('form');
        form.href = cv.getAttribute('aria-link');
        form.action = "POST";
        form.className = cv.className;
        form.innerHTML = cv.innerHTML;
        cv.replaceWith(form);
    }

    /**
     * Remplissage du modèle de CV par les infos personnelles de la personne.
     * Survient après l' ouverture d' un modèle en particulier
     */
    filling()
    {
        /**
         * @type {HTMLElement[]}
         */
        const elementsToBeInputs = Array.from(document.querySelectorAll("#input"));
        elementsToBeInputs.forEach(element => {
            const inputName = element.getAttribute('aria-name');
            const inputType = element.getAttribute('aria-type');
            const parentElement = element.parentElement 
            
            /**
             * @type {HTMLInputElement}
             */
            const input = this.dom.createElement('input', element.className + " form-control mb-2");
            input.name = inputName ? inputName : "";
            input.type = inputType ? inputType : "text";
            
            if(inputName.includes("level")){
                input.placeholder = "Niveau";
            }else if(inputName.includes("graduation")){
                input.placeholder = "Diplôme";
            }else if(inputName.includes('year_debut')){
                input.placeholder = "Date de début";
            }else if(inputName.includes('year_end')) {
                input.placeholder = "Année de fin";
            }else if(inputName.includes('language')) {
                input.placeholder = "Langue";
            }else if(inputName.includes('year_month_debut')){
                input.placeholder = "Mois et année de début"
            }else if(inputName.includes('year_month_end')){
                input.placeholder = "Mois et année de fin"
            }else if(inputName.includes('skill')){
                input.placeholder = "Compétence";
            }else { 
                input.placeholder = element.innerText;
            }

            const inputNumber = parentElement.getAttribute('aria-input-number')
            if(inputNumber){
                parentElement.classList.add('d-flex', 'justify-content-between')
            }

            if(element.classList.contains('profile-photo')){
                element.before(this.dom.createElement('label', 'mb-1').innerText = "Choisir une photo : ")
            }

            element.replaceWith(input);
        })

        const elementsToBeTextarea = document.querySelectorAll('#textarea');
        elementsToBeTextarea.forEach(element => {
            const textareaName = element.getAttribute('aria-name');
            /**
             * @type {HTMLTextAreaElement}
             */
            const textarea = this.dom.createElement('textarea', element.className + " form-control");
            textarea.name = textareaName ? textareaName : "";
            textarea.placeholder = "Ecrire quelque chose"

            element.replaceWith(textarea)
        })

        const separators = document.querySelectorAll('#separator');
        separators.forEach(separator => {
            separator.parentElement.removeChild(separator)
        })

        const lists = document.querySelectorAll('.list.customizable-list')
        lists.forEach(list => {
            const listChildren = Array.from(list.children)
            const childrenLength = listChildren.length
            for(let i = 0; i < childrenLength; i++){
                if(listChildren[i+1]){
                    list.removeChild(listChildren[i+1])
                }
            }

            if(list.classList.contains('skills-list-right')){
                list.innerHTML = ""
            }else {
                const add = this.dom.createElement('button', 'btn btn-secondary add-into-list')
                add.innerText = "En ajouter une autre"
                listChildren[0].after(add)
            }
        })

        const barLevels = document.querySelectorAll('.level.bar-level')
        barLevels.forEach(barLevel => {
            barLevel.appendChild(this.dom.createElement('span', 'level-cursor position-absolute start-0 shadow bg-primary'))
        })
    }
}