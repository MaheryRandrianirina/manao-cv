import { find, includes, isNull, isUndefined, replace } from "lodash";
import DOMInteractions from "./modules/DOMInteractions";
import CameraIcon from "./icons/camera-icon";
import EyeIcon from "./icons/eye-icon";
import DownloadIcon from "./icons/download-icon";
import CheckIcon from "./icons/check-icon";
import innerUserIcon from "./icons/inner-user-icon";
import { formatString, getClassFrom } from "./utils/simplifiers";

export default class CVModels {

    constructor(){
        this.dom = new DOMInteractions();
    }

    createCVForm()
    {
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
        this.modelName = "";
        this.formInputs;
        this.formTextareas;
        this.divFromForm;
        /**
         * @type {HTMLInputElement | undefined}
         */
        this.profilePhotoInput;

        this.numbersStringEquivalents = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            7: "seven",
            8: "eight",
            9: "nine",
            10: "ten"
        };

        this.textStylePerModel = {
            "cv-1" : {
                "name": "uppercase"
            }
        }

        /**
         * @type {{[inputName: string]: string} | {}}
         */
        this.inputsValues = {};

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

        const arrayClassList = Array.from(cv.classList);
        form.className = arrayClassList.join(' ');
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
            const input = this.dom.createElement('input', getClassFrom(element) + " form-control mb-2");
            input.name = inputName ? inputName : "";
            input.type = inputType ? inputType : "text";
            input.setAttribute('aria-nodename', element.nodeName)
            
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

                const separator = parentElement.querySelector('#separator');
                if(separator){
                    parentElement.setAttribute('aria-separator', separator.innerHTML);
                    separator.parentElement.removeChild(separator);
                }
                // const parentElementChildren = Array.from(parentElement.children);
                // if(parentElementChildren.indexOf(element)
                //     === parentElementChildren.length - 1
                // ){
                //     console.log(parentElementChildren[parentElementChildren.length- 1])
                //     parentElementChildren[parentElementChildren.length- 1].style.marginLeft = "5px"
                // }
            }

            if(element.classList.contains('profile-photo')){
                const label = this.dom.createElement('label', 'mb-1');
                element.before(label);
                label.innerText = "Choisir une photo : ";
            }

            element.replaceWith(input);
        })

        const elementsToBeTextarea = document.querySelectorAll('#textarea');
        elementsToBeTextarea.forEach(element => {
            const textareaName = element.getAttribute('aria-name');
            /**
             * @type {HTMLTextAreaElement}
             */
            const textarea = this.dom.createElement('textarea', Array.from(element.classList).join(' ') + " form-control");
            textarea.name = textareaName ? textareaName : "";
            textarea.placeholder = "Ecrire quelque chose";
            textarea.setAttribute('aria-nodename', element.nodeName)

            element.replaceWith(textarea)
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

                add.addEventListener('click', this.handleAddNewList.bind(this));
            }
        })

        this.addListenersToEveryBarLevels();
    }

    throwErrorIfFormUndefined()
    {
        if(!this.form){
            throw new Error('La propriété this.form est undefined');
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleAddNewList(e)
    {
        e.preventDefault();

        /**
         * @type {HTMLButtonElement}
         */
        const addNewListButton = e.target;
        const previousList = addNewListButton.previousElementSibling;
        const newList = addNewListButton.previousElementSibling.cloneNode();  
        newList.innerHTML = previousList.innerHTML
        
        const newListLevelIndicators = Array.from(newList.querySelectorAll('.level-indicator'));
        if(newListLevelIndicators.length > 0){
            const lastListLevelIndicator = newListLevelIndicators[newListLevelIndicators.length - 1];
            lastListLevelIndicator.parentElement.removeChild(lastListLevelIndicator);
        }

        const newListCursors = Array.from(newList.querySelectorAll('.level-cursor'));
        if(newListCursors.length > 0){
            const lastListCursor = newListCursors[newListCursors.length - 1]
            lastListCursor.parentElement.removeChild(lastListCursor)
        }

        addNewListButton.before(newList)
        if(newList.className.includes('one')){
            newList.className = newList.className.replace("one", "two");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace('one', "two");
                });
            }
        }else if(newList.className.includes('two')){
            newList.className = newList.className.replace("two", "three");
            
            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("two", "three");
                    
                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                });
            }
        }else if(newList.className.includes('three')){
            newList.className = newList.className.replace("three", "four");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("three", "four");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                });
            }
        }else if(newList.className.includes('four')){
            newList.className = newList.className.replace("four", "five");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("four", "five");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
        }else if(newList.className.includes('five')){
            newList.className = newList.className.replace("five", "six");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("five", "six");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
            
            if(newList.parentElement.classList.contains('skills-list-left')){
                const skillsListRight = newList.parentElement.nextElementSibling;
                skillsListRight.appendChild(newList);
                skillsListRight.appendChild(addNewListButton);
            }
        }else if(newList.className.includes('six')){
            newList.className = newList.className.replace("six", "seven");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("six", "seven");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
        }else if(newList.className.includes('seven')){
            newList.className = newList.className.replace("seven", "eight");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("seven", "eight");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
        }else if(newList.className.includes('eight')){
            newList.className = newList.className.replace("eight", "nine");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("eight", "nine");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
        }else if(newList.className.includes('nine')){
            newList.className = newList.className.replace("nine", "ten");

            const listsInputs = newList.querySelectorAll('input');
            if(listsInputs){
                listsInputs.forEach(listInput => {
                    listInput.name = listInput.name.replace("nine", "ten");

                    // if(listInput.name.includes('level')){
                    //     listInput.parentElement.removeChild(listInput);
                    // }
                })
            }
        }
        
        if(this.inputWithLevelValue){
            this.inputWithLevelValue = undefined;
        }

        this.addListenersToEveryBarLevels();
    }
    
    addListenersToEveryBarLevels()
    {
        const barLevels = document.querySelectorAll('.level.bar-level')
        barLevels.forEach(barLevel => {
            if(!barLevel.querySelector('.level-cursor')){
                const levelCursor = this.dom.createElement('span', 'level-cursor position-absolute shadow bg-primary')
                barLevel.appendChild(levelCursor);

                levelCursor.addEventListener('mousedown', this.handleLevelCursorMouseDown.bind(this));
                levelCursor.addEventListener('mouseup', this.handleLevelCursorMouseUp.bind(this));
                barLevel.addEventListener('click', this.handleBarLevelClick.bind(this));
                barLevel.addEventListener('mousemove', this.handleLevelCursorMove.bind(this));
                barLevel.addEventListener('mouseleave', this.handleBarLevelMouseleave.bind(this));
            }
        });
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleLevelCursorMouseDown(e)
    {
        e.preventDefault();
        if(isUndefined(this.levelCursor) || this.levelCursor !== e.target){
            this.levelCursor = e.target;
        }

        this.levelCursorOrigin = {x: this.levelCursor.offsetTop, y: this.levelCursor.offsetLeft};
    }

    handleLevelCursorMouseUp(e)
    {
        e.preventDefault();

        this.levelCursorOrigin = undefined;
        this.levelIndicator = undefined;
        this.levelCursor = undefined;
        this.barLevel = undefined;
    }

    handleBarLevelClick(e)
    {
        e.preventDefault();

        if(e.target.classList.contains('bar-level')){
            this.barLevel = e.target;
        }else {
            this.barLevel = e.currentTarget;
        }
        
        this.levelCursorPosition = {x: e.clientX, y: e.clientY};
        if(!this.levelCursorOrigin){
            const barLevelRect = this.barLevel.getBoundingClientRect();
            const barLevelRectPosition = {x: barLevelRect.x, y: barLevelRect.y}
            if(!this.barLevelPosition || this.barLevelPosition !== barLevelRectPosition){
                this.barLevelPosition = barLevelRectPosition;
            }

            const cursorPositionLessThanBarLevelWidthAndPosition = this.levelCursorPosition.x < this.barLevelPosition.x + this.barLevel.offsetWidth;
            if(cursorPositionLessThanBarLevelWidthAndPosition){
                const levelCursor = this.barLevel.querySelector('.level-cursor') ? 
                this.barLevel.querySelector('.level-cursor') : 
                this.barLevel.parentElement.querySelector('.level-cursor');
                levelCursor.style.left =  
                    this.levelCursorPosition.x - this.barLevelPosition.x + "px"
                
                const barLevelIndicator = this.barLevel.querySelector('.level-indicator');
                if(isNull(barLevelIndicator)){
                    this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0');
                    this.barLevel.appendChild(this.levelIndicator);
                }else {
                    this.levelIndicator = barLevelIndicator;
                }
                
                const levelIndicatorWidth = this.levelCursorPosition.x - this.barLevelPosition.x;
                this.levelIndicator.style.width = levelIndicatorWidth + "px";

                if(isUndefined(this.inputWithLevelValue) ||
                    isNull(this.barLevel.querySelector('.level-value'))
                ){
                    this.inputWithLevelValue = this.dom.createElement('input', 'level-value');
                    this.inputWithLevelValue.type = "hidden";

                    const previousElementOfParent = this.barLevel.parentElement.previousElementSibling;
                    let previousElementOfParentLevelInput;
                    if(previousElementOfParent){
                        previousElementOfParentLevelInput = previousElementOfParent.querySelector('.level-value')
                    }
                    
                    if(isNull(previousElementOfParent)){
                        this.inputWithLevelValue.name = "level_one"
                    }else if(previousElementOfParentLevelInput.name.includes('one')){
                        this.inputWithLevelValue.name = "level_two";
                    }else if(previousElementOfParentLevelInput.name.includes('two')){
                        this.inputWithLevelValue.name = "level_three";
                    }else if(previousElementOfParentLevelInput.name.includes('three')){
                        this.inputWithLevelValue.name = "level_four";
                    }else if(previousElementOfParentLevelInput.name.includes('four')){
                        this.inputWithLevelValue.name = "level_five";
                    }else if(previousElementOfParentLevelInput.name.includes('five')){
                        this.inputWithLevelValue.name = "level_six";
                    }else if(previousElementOfParentLevelInput.name.includes('six')){
                        this.inputWithLevelValue.name = "level_seven";
                    }else if(previousElementOfParentLevelInput.name.includes('seven')){
                        this.inputWithLevelValue.name = "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = "level_nine";
                    }else if(previousElementOfParentLevelInput.name.includes("nine")){
                        this.inputWithLevelValue.name = "level_ten";
                    }


                    this.barLevel.appendChild(this.inputWithLevelValue)
                }
                
                this.inputWithLevelValue.setAttribute('value', 
                    `${(levelIndicatorWidth * 100 / this.barLevel.offsetWidth).toFixed(2)}`
                );
            }
            
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleLevelCursorMove(e)
    {
        e.preventDefault();
        if(!this.moveFromBody || (e.currentTarget.classList.contains('bar-level'))){
            /**
             * @type {HTMLParagraphElement}
                */
            this.barLevel = e.currentTarget;
        }
        
        if(this.levelCursorOrigin && this.levelCursor && this.barLevel){
            const barLevelRect = this.barLevel.getBoundingClientRect();
            const barLevelRectPosition = {x: barLevelRect.x, y: barLevelRect.y}
            if(!this.barLevelPosition || this.barLevelPosition !== barLevelRectPosition){
                this.barLevelPosition = barLevelRectPosition;
            }

            this.levelCursorPosition = {x: e.clientX, y: e.clientY};

            const cursorPositionLessThanBarLevelWidthAndPosition = this.levelCursorPosition.x < 
                this.barLevelPosition.x + this.barLevel.offsetWidth;
            const cursorPositionGreaterOrEqualToBarLevelPosition = this.levelCursorPosition.x >= this.barLevelPosition.x;
            const cursorPositionDoesntCollapse = cursorPositionLessThanBarLevelWidthAndPosition && cursorPositionGreaterOrEqualToBarLevelPosition;
            if(cursorPositionDoesntCollapse){
                this.levelCursor.style.left =  this.levelCursorPosition.x - this.barLevelPosition.x + "px";
                
                const barLevelIndicator = this.barLevel.querySelector('.level-indicator');
                if(isNull(barLevelIndicator)){
                    this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0');
                    this.barLevel.appendChild(this.levelIndicator);
                }else {
                    this.levelIndicator = barLevelIndicator;
                }
                
                const levelIndicatorWidth = this.levelCursorPosition.x - this.barLevelPosition.x;
                this.levelIndicator.style.width = levelIndicatorWidth + "px";
                
                if(isUndefined(this.inputWithLevelValue) ||
                    isNull(this.barLevel.querySelector('.level-value'))
                ){
                    this.inputWithLevelValue = this.dom.createElement('input', 'level-value');
                    this.inputWithLevelValue.type = "text";
                    this.inputWithLevelValue.hidden = true;

                    const previousElementOfParent = this.barLevel.parentElement.previousElementSibling;
                    let previousElementOfParentLevelInput;
                    if(previousElementOfParent){
                        previousElementOfParentLevelInput = previousElementOfParent.querySelector('.level-value')
                    }
                    
                    if(isNull(previousElementOfParent)){
                        this.inputWithLevelValue.name = "level_one"
                    }else if(previousElementOfParentLevelInput.name.includes('one')){
                        this.inputWithLevelValue.name = "level_two";
                    }else if(previousElementOfParentLevelInput.name.includes('two')){
                        this.inputWithLevelValue.name = "level_three";
                    }else if(previousElementOfParentLevelInput.name.includes('three')){
                        this.inputWithLevelValue.name = "level_four";
                    }else if(previousElementOfParentLevelInput.name.includes('four')){
                        this.inputWithLevelValue.name = "level_five";
                    }else if(previousElementOfParentLevelInput.name.includes('five')){
                        this.inputWithLevelValue.name = "level_six";
                    }else if(previousElementOfParentLevelInput.name.includes('six')){
                        this.inputWithLevelValue.name = "level_seven";
                    }else if(previousElementOfParentLevelInput.name.includes('seven')){
                        this.inputWithLevelValue.name = "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = "level_nine";
                    }else if(previousElementOfParentLevelInput.name.includes("nine")){
                        this.inputWithLevelValue.name = "level_ten";
                    }

                    this.barLevel.appendChild(this.inputWithLevelValue)
                }

                this.inputWithLevelValue.setAttribute('value', 
                    `${(levelIndicatorWidth * 100 / this.barLevel.offsetWidth).toFixed(2)}`
                );

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
        hiddenInputWithModelname.type = "hidden";
        hiddenInputWithModelname.setAttribute('value', this.form.classList[1]);
        this.form.appendChild(hiddenInputWithModelname);

        this.modelName = hiddenInputWithModelname.value;
    }

    addClickableSeeButton()
    {
        this.throwErrorIfFormUndefined();
        
        const seeButtonContainer = this.dom.createElement('div', 
            'see-button-container position-fixed d-flex justify-content-between p-3 rounded start-0 end-0 m-auto'
        );
        seeButtonContainer.innerHTML = `Voir le CV ${EyeIcon("icon")}`;

        document.body.appendChild(seeButtonContainer);

        const seeButton = document.querySelector('.see-button-container');
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
        this.transformFormToRealCV();
    }

    transformFormToRealCV()
    {
        let formInputs;
        let formTextareas;
        if(this.form){
            formInputs = this.form.querySelectorAll('input')
            formTextareas = this.form.querySelectorAll('textarea');
        }else {
            const form = document.querySelector('form');
            if(form){
                formInputs = form.querySelectorAll('input');
                formTextareas = form.querySelectorAll('textarea')
            }
        }
        
        if(formInputs){
            this.formInputs = formInputs;

            this.transformProfilePhotoInputToImg();

            this.transformEachInputToText();

            this.removeAllAddlistButtons();
        }

        if(formTextareas){
            this.formTextareas = formTextareas;
            this.transformEachTextareaToText();
        }
        
        this.divFromForm = this.transformFormToDiv();
    }

    /**
     * remplace l'élément form par un élément div
     * @returns {HTMLDivElement} div remplaceant l'élément form
     */
    transformFormToDiv()
    {
        this.throwErrorIfFormUndefined();

        const divToReplaceForm = this.dom.createElement('div', getClassFrom(this.form));
        divToReplaceForm.setAttribute("aria-link", this.form.getAttribute("action"));
        divToReplaceForm.innerHTML = this.form.innerHTML;
        this.form.replaceWith(divToReplaceForm);

        return divToReplaceForm;
    }

    transformEachInputToText()
    {
        if(this.formInputs){
            this.formInputs.forEach(formInput => {
                
                if(formInput.getAttribute('type') !== "hidden" 
                    && !formInput.classList.contains('profile-photo')
                    && !formInput.classList.contains('level-value')){
                    const className = getClassFrom(formInput);
                    
                    const elementToReplaceInput = this.dom.createElement(
                        formInput.getAttribute('aria-nodename').toLowerCase(), 
                        className.replace('form-control', '').replace('mb-2', 'mb-0')
                    );
                    
                    const inputValue = formInput.value;
                    this.saveInputsValues(formInput.name, inputValue);

                    let elementInnerText;
                    
                    if(formInput.name === "name"){
                        elementInnerText = this.textStylePerModel[this.modelName].name 
                            === "uppercase" 
                            ? inputValue.toUpperCase() : 
                            inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
                    }else if(formInput.name === "email" || formInput.name === 'url_linkedin'){
                        elementInnerText = inputValue;
                    }else {
                        elementInnerText = inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
                        
                        if(formInput.name === "phone_number"){
                            elementInnerText = formatString(elementInnerText, "phone_number");
                        }
                    }

                    elementToReplaceInput.innerHTML = elementInnerText;
                    if(elementToReplaceInput.nodeName.toLowerCase() === "svg" 
                        && elementToReplaceInput.classList.contains('profile-photo')
                    ){
                        formInput.parentElement.removeChild(formInput.previousElementSibling);
                        elementToReplaceInput.innerHTML = innerUserIcon();
                    }

                    const formInputParent = formInput.parentElement;
                    const formInputParentChildren = Array.from(formInputParent.children);
                    const separator = formInputParent.getAttribute('aria-separator');
                    if(formInputParent.classList.contains('justify-content-between')
                        && separator && formInputParentChildren.length > 1
                        && !formInputParent.querySelector('#separator')
                    ){
                        formInputParent.className = getClassFrom(formInputParent).replace('between', 'start');

                        const separatorSpan = this.dom.createElement('span');
                        separatorSpan.innerText = " " + separator + " ";
                        separatorSpan.setAttribute('id', 'separator');

                        formInputParentChildren[formInputParentChildren.length - 1].before(separatorSpan);
                    }

                    formInput.replaceWith(elementToReplaceInput);
                }else if(!formInput.classList.contains('profile-photo')) {
                    if(formInput.name.includes('level')){
                        this.saveInputsValues(formInput.name, formInput.value);
                        
                        const inputParentElement = formInput.parentElement;

                        const levelCursor = inputParentElement.querySelector('.level-cursor');
                        if(levelCursor){
                            inputParentElement.removeChild(levelCursor)
                        }
                    }
                }
            })
        }
    }

    saveInputsValues(inputName, inputValue)
    {
        if(inputValue){
            this.inputsValues[inputName] = inputValue;
        }
    }

    transformProfilePhotoInputToImg()
    {
        this.throwErrorIfFormUndefined();

        this.profilePhotoInput = this.form.querySelector('.profile-photo');
        
        if(this.profilePhotoInput){
            this.profilePhotoInput.parentElement.removeChild(this.profilePhotoInput.previousElementSibling);

            this.showProfilePhoto();
        }
    }

    showProfilePhoto(e)
    {
        this.throwErrorIfUndefined(this.profilePhotoInput, "this.profilePhotoInput");

        const file = this.profilePhotoInput.files[0];
        if(file){
            /**
            * @type {HTMLImageElement}
            */
            const profilePhotoImg = this.dom.createElement('img', 'profile-photo');
            profilePhotoImg.src = URL.createObjectURL(file);

            this.profilePhotoInput.replaceWith(profilePhotoImg);
        }
        
    }

    transformEachTextareaToText()
    {
        this.throwErrorIfUndefined(this.formTextareas, "this.formTextareas");

        this.formTextareas.forEach(formTextarea => {
            const className = getClassFrom(formTextarea);
            const elementToReplaceInput = this.dom.createElement(
                formTextarea.getAttribute('aria-nodename').toLowerCase(), 
                className.replace('form-control', '').replace('mb-2', 'mb-0')
            );
                    
            const inputValue = formTextarea.value;
            this.saveInputsValues(formTextarea.name, inputValue);
            let elementInnerText;
                    
            if(formTextarea.name === "name"){
                elementInnerText = this.textStylePerModel[this.modelName].name === "uppercase" ? inputValue.toUpperCase() : 
                    inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
            }else {
                elementInnerText = inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
            }

            elementToReplaceInput.innerHTML = elementInnerText;
            formTextarea.replaceWith(elementToReplaceInput);
        })
    }

    removeAllAddlistButtons()
    {
        this.throwErrorIfFormUndefined();

        const addIntoListButtons = this.form.querySelectorAll('.btn.add-into-list');
        if(addIntoListButtons){
            addIntoListButtons.forEach(addIntoListButton => {
                addIntoListButton.parentElement.removeChild(addIntoListButton)
            })
        }
    }

    /**
     * Lève une erreur si une variable est undefined
     * @param {any} variable 
     * @param {string} stringVariable la variable sous forme de chaîne de caractères. ex: throwErrorIfUndefined(this.formInputs, "this.formInputs")
     */
    throwErrorIfUndefined(variable, stringVariable)
    {
        if(isUndefined(variable)){
            throw new Error(stringVariable + " est undefined");
        }
    }

    throwErrorIfDivFromFormUndefined()
    {
        return this.throwErrorIfUndefined(this.divFromForm, "this.divFromForm");
    }

}