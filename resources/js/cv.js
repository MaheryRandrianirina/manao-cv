import { find, includes, isNull, isUndefined, replace } from "lodash";
import DOMInteractions from "./modules/DOMInteractions";
import CameraIcon from "./icons/camera-icon";
import EyeIcon from "./icons/eye-icon";
import DownloadIcon from "./icons/download-icon";
import CheckIcon from "./icons/check-icon";

export default class CVModels {

    constructor(){
        this.dom = new DOMInteractions();
        this.form;
        this.levelIndicator;
        /**
         * @type {HTMLSpanElement | undefined}
         */
        this.levelCursor;
        /**
         * @type {{x: number, y: number} | undefined}
         */
        this.levelCursorOrigin;
        this.barLevelPosition;
        this.moveFromBody = false;
        this.inputWithLevelValue;

        const cvForm = document.querySelector('.cv-form .cv');
        if(cvForm){
            this.transformToForm();
            this.filling();
            this.addClickableSeeButton();
        }
    }

    transformToForm()
    {
        const cv = document.querySelector('.cv');
        const form = this.dom.createElement('form');
        form.action = cv.getAttribute('aria-link');
        form.method = "POST";
        form.className = cv.className;
        form.innerHTML = cv.innerHTML;
        cv.replaceWith(form);

        this.form = form
    }

    /**
     * Remplissage du modèle de CV par les infos personnelles de la personne.
     * Survient après l' ouverture d' un modèle en particulier
     */
    filling()
    {
        this.throwErrorIfFormUndefined();

        this.createHiddenInputForCvModel();

        /**
         * @type {HTMLElement[]}
         */
        const elementsToBeInputs = Array.from(this.form.querySelectorAll("#input"));
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

            const inputNumber = parentElement.getAttribute('aria-input-number');
            if(inputNumber){
                parentElement.classList.add('d-flex', 'justify-content-between');
                // const parentElementChildren = Array.from(parentElement.children);
                // if(parentElementChildren.indexOf(element)
                //     === parentElementChildren.length - 1
                // ){
                //     console.log(parentElementChildren[parentElementChildren.length- 1])
                //     parentElementChildren[parentElementChildren.length- 1].style.marginLeft = "5px"
                // }
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
            const levelCursor = this.dom.createElement('span', 'level-cursor position-absolute shadow bg-primary')
            barLevel.appendChild(levelCursor);

            levelCursor.addEventListener('mousedown', this.handleLevelCursorMouseDown.bind(this));
            levelCursor.addEventListener('mouseup', this.handleLevelCursorMouseUp.bind(this));
            barLevel.addEventListener('click', this.handleBarLevelClick.bind(this));
            barLevel.addEventListener('mousemove', this.handleLevelCursorMove.bind(this));
            barLevel.addEventListener('mouseleave', this.handleBarLevelMouseleave.bind(this));
        })
    }

    throwErrorIfFormUndefined(){
        if(!this.form){
            throw new Error('La propriété this.form est undefined');
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleLevelCursorMouseDown(e)
    {
        e.preventDefault();
        this.levelCursor = e.target;

        this.levelCursorOrigin = {x: this.levelCursor.offsetTop, y: this.levelCursor.offsetLeft};
    }

    handleLevelCursorMouseUp(e)
    {
        e.preventDefault();

        this.levelCursorOrigin = undefined;
    }

    handleBarLevelClick(e)
    {
        e.preventDefault();
        this.barLevel = e.target;
        const barLevelRect = this.barLevel.getBoundingClientRect();
        if(!this.barLevelPosition){
            this.barLevelPosition = {x: barLevelRect.x, y: barLevelRect.y};
        }
        
        this.levelCursorPosition = {x: e.clientX, y: e.clientY};
        if(!this.levelCursorOrigin && (
            this.levelCursorPosition.x < this.barLevelPosition.x + this.barLevel.offsetWidth
        )){
            const levelCursor = this.barLevel.querySelector('.level-cursor') ? 
                this.barLevel.querySelector('.level-cursor') : 
                this.barLevel.parentElement.querySelector('.level-cursor');
            levelCursor.style.left =  
                this.levelCursorPosition.x - this.barLevelPosition.x + "px"
            
            if(isUndefined(this.levelIndicator)){
                
                this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0')
                
                this.barLevel.appendChild(this.levelIndicator)
            
            }
                
            
            this.levelIndicator.style.width = this.levelCursorPosition.x - this.barLevelPosition.x + "px";
        }
        
        
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleLevelCursorMove(e)
    {
        e.preventDefault();
        
        if(!this.moveFromBody){
            /**
             * @type {HTMLParagraphElement}
                */
            this.barLevel = e.currentTarget;
        }
        
        const barLevelRect = this.barLevel.getBoundingClientRect();
        if(!this.barLevelPosition){
            this.barLevelPosition = {x: barLevelRect.x, y: barLevelRect.y};
        }

        if(this.levelCursorOrigin && this.levelCursor){
            this.levelCursorPosition = {x: e.clientX, y: e.clientY};
            const cursorPositionLessThanBarLevelWidthAndPosition = this.levelCursorPosition.x < 
                this.barLevelPosition.x + this.barLevel.offsetWidth;
            const cursorPositionGreaterOrEqualToBarLevelPosition = this.levelCursorPosition.x >= this.barLevelPosition.x;
            const cursorPositionDoesntCollapse = cursorPositionLessThanBarLevelWidthAndPosition && cursorPositionGreaterOrEqualToBarLevelPosition;
            if(cursorPositionDoesntCollapse){
                this.levelCursor.style.left =  this.levelCursorPosition.x - this.barLevelPosition.x + "px";
                if(isUndefined(this.levelIndicator)){
                    this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0')
                    this.barLevel.appendChild(this.levelIndicator)
                    
                }
                
                const levelIndicatorWidth = this.levelCursorPosition.x - this.barLevelPosition.x;
                this.levelIndicator.style.width = levelIndicatorWidth + "px";

                
                if(isUndefined(this.inputWithLevelValue)){
                    this.inputWithLevelValue = this.dom.createElement('input', 'level-value');
                    this.inputWithLevelValue.type = "text";
                    this.inputWithLevelValue.hidden = true;
                    this.inputWithLevelValue.name = "level_one";
                    this.barLevel.appendChild(this.inputWithLevelValue)
                }
                
                this.inputWithLevelValue.setAttribute('value', `${(levelIndicatorWidth * 100 / this.barLevel.offsetWidth).toFixed(2)}`);

            }
        }
    }

    handleBarLevelMouseleave(e)
    {
        e.preventDefault();

        if(this.levelCursorOrigin){
            document.body.addEventListener('mousemove', e => {
                e.preventDefault();
                this.moveFromBody = true
                this.handleLevelCursorMove(e)
            });
            document.body.addEventListener('click', e => {
                e.preventDefault();
                this.levelCursorOrigin = undefined;
            });
        }
    }

    createHiddenInputForCvModel()
    {
        /**
         * @type {HTMLInputElement}
         */
        const hiddenInputWithModelname = this.dom.createElement('input');
        hiddenInputWithModelname.name = "model";
        hiddenInputWithModelname.hidden = true;
        hiddenInputWithModelname.setAttribute('value', this.form.classList[1]);
        this.form.appendChild(hiddenInputWithModelname);
    }

    addClickableSeeButton()
    {
        this.throwErrorIfFormUndefined();
        
        const seeButtonContainer = this.dom.createElement('div', 
            'see-button-container position-fixed d-flex justify-content-between p-3 rounded start-0 end-0 m-auto'
        );
        seeButtonContainer.innerHTML = `Voir le CV ${EyeIcon("icon")}`;

        document.body.appendChild(seeButtonContainer);

        const seeButton = document.querySelector('.see-button-container eye-icon');
        if(seeButton){
            seeButton.addEventListener('click', this.handleSeeCV.bind(this))
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleSeeCV(e)
    {
        e.preventDefault();

        const eyeIcon = e.target;

    }
}