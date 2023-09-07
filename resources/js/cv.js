import { find, includes, isNull, isNumber, isUndefined, replace } from "lodash";
import DOMInteractions from "./modules/DOMInteractions";
import EyeIcon from "./icons/eye-icon";
import DownloadIcon from "./icons/download-icon";
import CheckIcon from "./icons/check-icon";
import innerUserIcon from "./icons/inner-user-icon";
import { formatString, getClassFrom, hasClass } from "./utils/simplifiers";
import SaveIcon from "./icons/save-icon";
import CloseIcon from "./icons/close-icon";
import UserIcon from "./icons/user-icon";
import axios from "axios";
import EditIcon from "./icons/edit-icon";
import DeleteIcon from "./icons/delete-icon";
import { months } from "./utils/date";

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

        this.modelName = "";

        this.formInputs;
        this.formTextareas;
        this.formSelects;

        this.elementsToBeInputs;
        this.elementsToBeTextareas;
        this.elementsToBeSelect;

        this.formErrors;

        this.divFromForm;

        this.seeButtonContainer;

        this.console;

        this.closeIconContainer;

        this.shownProfilePhoto = false;

        this.pathname;

        this.editCvClicked = false;

        this.cv_id_input;

        this.csrfInput;

        this.closeButtonClickNumber = 0;
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
                "name": "uppercase",
            },
            "cv-2": {
                "name" : "uppercase",
                "firstname": "uppercase",
                "work": "uppercase"
            },
            "cv-3": {
                "name": "uppercase"
            },
            "cv-4": {
                "name": "uppercase",
                "firstname": "uppercase"
            }
        }

        /**
         * @type {{[inputName: string]: string} | {}}
         */
        this.inputsValues = {};
        this.inputsValuesLength = 0;
        /**
         * @type {{[inputName: string]: string} | {}}
         */
        this.inputsPlaceholders = {};

        /**
         * @type {{[ariaName: string]: string} | {}}
         */
        this.elementsInnerText = {};
        this.elementsInnerTextLength = 0;

        this.mustUpdateWhenSaving = false;
        this.lastInsertedCvId

        this.saved = false;

        this.newListElement;
    }

    createCVForm()
    {
        const cvForm = document.querySelector('.cv-form .cv');
        
        this.pathname = document.location.pathname;
        if(this.pathname.includes('/cv/show')){
            if(!this.editCvClicked){
                this.createConsole("cv-show-console");

                this.fetchElementsToBeInputs();

                this.saveElementsToBeInputsInnerText();

                this.saveProfilePhotoImg();
    
                this.fetchElementsToBeTextareas();
                
                this.saveElementsToBeTextareasInnerText();
                
                const csrfInput = document.querySelector("input[type='hidden']");

                const cv_id = document.querySelector('.cv-id');

                this.elementsInnerText[csrfInput.name] = csrfInput.value;
                this.elementsInnerText[cv_id.name] = parseInt(cv_id.value);
                
                this.addLevelIndicators();

                this.addClickEventToConsoleButtons();

            }else if(this.editCvClicked && cvForm){
                if(this.console.classList.contains('cv-show-console')){
                    this.removeConsole();
                }
                
                this.transformToForm();
    
                this.filling();
    
                this.addClickableSeeButton();
            }
            
            return;
        }

        if(cvForm){
            this.transformToForm();

            this.filling();

            this.addClickableSeeButton();
        }
    }

    

    fetchElementsToBeInputs()
    {
        this.elementsToBeInputs = Array.from(document.querySelectorAll("#input"));
    }

    saveElementsToBeInputsInnerText()
    {
        this.throwErrorIfUndefined(this.elementsToBeInputs, "this.elementsToBeInputs");

        this.elementsToBeInputs.forEach(element => {
            this.saveInnerText(element);
            this.elementsInnerTextLength++;
        })
    }

    saveInnerText(element)
    {
        if(!element.classList.contains('profile-photo')){
            this.elementsInnerText[element.getAttribute('aria-name')] = element.innerText;
        }
    }

    saveProfilePhotoImg(){
        const profilePhotoImg = document.querySelector('img.profile-photo');
        if(profilePhotoImg){
            this.profilePhotoImg = profilePhotoImg;
        }
    }

    fetchElementsToBeTextareas()
    {
        this.elementsToBeTextareas = Array.from(document.querySelectorAll("#textarea"));
    }

    saveElementsToBeTextareasInnerText()
    {
        this.throwErrorIfUndefined(this.elementsToBeTextareas, "this.elementsToBeTextareas");

        this.elementsToBeTextareas.forEach(element => {
            this.saveInnerText(element);
        })
    }

    addLevelIndicators(){
        const barLevels = document.querySelectorAll('.bar-level');
        barLevels.forEach(barLevel => {
            this.levelIndicator = barLevel.parentElement.querySelector('.level-indicator');
            if(isNull(this.levelIndicator)){
                this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0');
                barLevel.appendChild(this.levelIndicator);
            }
        
            const barLevelRect = barLevel.getBoundingClientRect();
            const levelIndicatorWidth = barLevelRect.width * parseFloat(barLevel.getAttribute('aria-level')) / 100;

            this.levelIndicator.style.width = 100 * levelIndicatorWidth / barLevelRect.width + "%";
        })
        
    }

    createConsole(className)
    {
        this.console = this.dom.createElement('div', 
            `console-container ${className ? className : ""} position-fixed d-flex justify-content-between p-3 rounded start-0 end-0 m-auto`
        );

        this.console.innerHTML = `
        ${DownloadIcon()}
        ${this.pathname && this.pathname.includes('show') && !this.editCvClicked ? DeleteIcon() : ""}
        ${this.pathname && this.pathname.includes('show') && !this.editCvClicked ? EditIcon() : SaveIcon()}
        ${CheckIcon()}
        `;

        document.body.appendChild(this.console);
    }

    transformToForm()
    {
        const cv = document.querySelector('.cv');

        const form = this.dom.createElement('form');
        form.action = cv.getAttribute('aria-link');
        form.method = "POST";
        form.setAttribute('enctype', "multipart/form-data");

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
            input.setAttribute('aria-nodename', element.nodeName);
            input.setAttribute('autocomplete', "off");
            
            if(inputName.includes("level")){
                input.placeholder = "Niveau";
                input.setAttribute('required', "true");
            }else if(inputName.includes("degree")){
                input.placeholder = "Diplôme";
                input.setAttribute('required', "true");
            }else if(inputName.includes('year_debut')){
                input.placeholder = "Année de début";
                input.setAttribute('required', "true");
            }else if(inputName.includes('year_end')) {
                input.placeholder = "Année de fin";
                input.setAttribute('required', "true");
            }else if(inputName.includes('language')) {
                input.placeholder = "Langue";
                input.setAttribute('required', "true");

                if(this.modelName === "cv-2" || this.modelName === "cv-3"){
                    this.addLevelCursorWithIndicatorIfThereIsValue(element);
                }
            }else if(inputName.includes('year')){
                input.setAttribute('required', "true");
            }else if((inputName.includes('skill') &&
                this.modelName !== "cv-3") || (
                this.modelName === "cv-2" && inputName.includes('lang')
            )){
                input.placeholder = "Compétence";
                input.setAttribute('required', "true");

                this.addLevelCursorWithIndicatorIfThereIsValue(element);
            }else { 
                if(this.inputsPlaceholders
                    && this.inputsPlaceholders[input.name]
                ){
                    input.placeholder = this.inputsPlaceholders[input.name];
                }else if(!this.pathname.includes('/cv/show')) {
                    input.placeholder = element.innerText;
                }

                if(inputName.includes('profile-photo') ||
                    inputName.includes('name') || inputName.includes('work')
                    || inputName.includes('phone') || inputName.includes('email')
                    || inputName.includes('adress') || inputName.includes('profile-photo')
                ){

                    input.setAttribute('required', "true");

                    if(element.parentElement.classList.contains('about')
                        && isNull(element.parentElement.querySelector('.sex'))
                    ){
                        const sex = this.dom.createElement('div', 'sex');
                        const manContainer = this.dom.createElement('div', 'man-container');
                        const womanContainer = this.dom.createElement('div', 'woman-container');
                        const manLabel = this.dom.createElement('label', 'man-label ms-1');
                        const womanLabel = this.dom.createElement('label', 'woman-label ms-1');
                        const man = this.dom.createElement('input', 'man');
                        const woman = this.dom.createElement('input', 'woman');

                        manLabel.innerText = "Homme";
                        man.type = "radio";
                        man.name = "sex";
                        man.setAttribute("value", "man");

                        womanLabel.innerText = "Femme";
                        woman.type = "radio";
                        woman.name = "sex";
                        woman.setAttribute("value", "woman");
                        
                        element.parentElement.appendChild(sex);

                        sex.appendChild(manContainer);
                        manContainer.appendChild(man);
                        manContainer.appendChild(manLabel);

                        sex.appendChild(womanContainer);

                        womanContainer.appendChild(woman);
                        womanContainer.appendChild(womanLabel);

                        man.addEventListener('click', (e)=>{
                            if(woman.getAttribute('selected') === "true" ||
                                !man.getAttribute('selected') ||
                                !woman.getAttribute('selected')
                            ){
                                woman.setAttribute('selected', "false")
                                man.setAttribute('selected', "true");
                            }
                        });

                        woman.addEventListener('click', (e)=>{
                            if(man.getAttribute('selected', "true") ||
                                !woman.getAttribute('selected') ||
                                !man.getAttribute('selected')
                            ){
                                man.setAttribute('selected', "false")
                                woman.setAttribute('selected', "true");
                            }
                        });
                    }
                }
            }
            
            if(this.inputsValuesLength > 0 && this.inputsValues[input.name]){
                input.setAttribute('value', this.inputsValues[input.name]);
            }

            if(this.pathname.includes('/cv/show')){
                input.setAttribute('value', element.innerText);

                if(input.hasAttribute('required')){
                    input.setAttribute('required', "false");
                }
                
                const ariaName = element.getAttribute('aria-name');
                if(ariaName === "phone_number"){
                    input.setAttribute('value', element.innerText.split(' ').join(''));
                }else if(ariaName === "email"){
                    input.setAttribute('value', element.innerText.replace(' ', ''));
                }else if(ariaName.includes('year')){
                    const elementAfterCurrentElement = element.nextElementSibling;
                    const dataValue = elementAfterCurrentElement ? elementAfterCurrentElement.getAttribute('data-value') : null;

                    if(!isNull(elementAfterCurrentElement) 
                        && !isNull(dataValue) 
                        && dataValue.length > 0
                    ){
                        input.setAttribute('value', dataValue);
                    }
                    
                }
            }

            const inputNumber = parentElement.getAttribute('aria-input-number');
            if(inputNumber){
                parentElement.classList.add('d-flex', 'justify-content-between');

                const separator = parentElement.querySelector('#separator');
                if(separator){
                    parentElement.setAttribute('aria-separator', separator.innerHTML);
                    separator.parentElement.removeChild(separator);
                }
            }

            if(element.classList.contains('profile-photo')){
                const label = this.dom.createElement('label', 'mb-1');
                element.before(label);
                label.innerText = "Choisir une photo : ";
            }

            this.addLabelInputDate(input, inputName, element);

            element.replaceWith(input);
        })

        let elementsToBeTextarea = Array.from(document.querySelectorAll('#textarea'));
        this.transformElementsToTextarea(elementsToBeTextarea);

        // ON RESELECTIONNE LES ELEMENTS QUI DEVIENDRONT DES TEXTAREA POUR VOIR S'IL EN EXISTE ENCORE
        elementsToBeTextarea = document.querySelectorAll('#textarea');
        if(elementsToBeTextarea.length > 0){
            this.transformElementsToTextarea(elementsToBeTextarea);
        }

        this.transformElementsToBeSelect();

        const lists = document.querySelectorAll('.list.customizable-list')
        lists.forEach(list => {
            const listChildren = Array.from(list.children);
            const childrenLength = listChildren.length;

            const levelValueInput = list.querySelector('.level-value');

            // SUPPRIMER TOUS LES ELEMENTS DE LA LISTE A PART LE PREMIER LORSQUE 
            // L'UTILISATEUR ARRIVE DANS LA PAGE. SEULEMENT LORSQU'IL CREE MAIS PAS LORSQU'IL VEUT MODIFIER
            
            if((!this.pathname.includes('/cv/show') 
                    && this.closeButtonClickNumber === 0
                ) 
                || (this.pathname.includes('/cv/show') && !this.editCvClicked )
            ){
                for(let i = 0; i < childrenLength; i++){
                    if(listChildren[i+1] 
                        && isNull(levelValueInput)
                    ){
                        list.removeChild(listChildren[i+1]);
                    }
                }
            }

            if(list.classList.contains('skills-list-right') && this.inputsValuesLength === 0){
                list.innerHTML = "";

            }else {
                let addIntoListButton = list.querySelector('.add-into-list');
                if(isNull(addIntoListButton) 
                ){
                    if(this.inputsValuesLength > 0 
                        && list.classList.contains('skills-list-left')
                        && list.nextElementSibling.children.length > 0
                    ){
                        return;
                    }

                    addIntoListButton = this.dom.createElement('button', 'btn btn-secondary add-into-list');
                }
                
                addIntoListButton.innerText = "En ajouter une autre";

                const lastChild = listChildren[childrenLength - 1];
                if(lastChild){
                    if(lastChild.className.includes('task') 
                    ){
                        addIntoListButton.innerText = "Ajouter une autre tâche";
                    }else if(lastChild.className.includes('experience') 
                        || (lastChild.className.includes('task') 
                            && (lastChild.nodeName.toLowerCase() === "div"
                                || lastChild.nodeName.toLowerCase() === "button"
                            )
                        )
                    ){
                        addIntoListButton.innerText = "Ajouter une autre expérience";
                    }else if(lastChild.className.includes('skill')){
                        addIntoListButton.innerText = "Ajouter une autre compétence";
                    }else if(lastChild.className.includes('langua')){
                        addIntoListButton.innerText = "Ajouter une autre langue";
                    }else if(lastChild.className.includes('formation')){
                        addIntoListButton.innerText = "Ajouter une autre formation";
                    }else if(lastChild.className.includes('hobb')){
                        addIntoListButton.innerText = "Ajouter un autre intérêt";
                    }
                    
                    if(isNull(levelValueInput) 
                        && this.closeButtonClickNumber === 0
                    ){
                        listChildren[0].after(addIntoListButton);
                    }else {
                        lastChild.after(addIntoListButton);
                    }
                    
                    addIntoListButton.addEventListener('click', this.handleAddNewListElement.bind(this));
                }
                
                if(this.pathname.includes('/cv/show') && this.closeButtonClickNumber === 0){
                    lastChild.after(addIntoListButton);
                }
            }
        })

        this.addListenersToEveryBarLevels();
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     * @param {string} inputName 
     * @param {HTMLElement} element
     */
    addLabelInputDate(input, inputName, element){
        let label;
        let wrapper;
        
        if(inputName.includes('year')){
            label = this.dom.createElement('label', 'mb-1 text-white');

            wrapper = this.dom.createElement('div', 'inputs-date-wrapper');
            wrapper.appendChild(label);
            wrapper.appendChild(input);
        }

        if(label && inputName.includes('year_debut')){
            label.innerText = "Date de début";
        }else if(label && inputName.includes('year_end')){
            label.innerText = "Date de fin";
        }
        
        if(wrapper){
            element.replaceWith(wrapper)
        }

        return;
    }

    /**
     * 
     * @param {HTMLTextAreaElement[]} elementsToBeTextarea 
     */
    transformElementsToTextarea(elementsToBeTextarea)
    {
        elementsToBeTextarea.forEach(element => {
            const textareaName = element.getAttribute('aria-name');

            /**
             * @type {HTMLTextAreaElement}
             */
            const textarea = this.dom.createElement(
                'textarea', 
                Array.from(element.classList).join(' ') + " form-control"
            );

            textarea.name = textareaName ? textareaName : "";
            textarea.placeholder = "Ecrire quelque chose";
            textarea.setAttribute('aria-nodename', element.nodeName)

            if(this.inputsValuesLength > 0 && this.inputsValues[textarea.name]){
                textarea.setAttribute('value', this.inputsValues[textarea.name])
                textarea.innerHTML = this.inputsValues[textarea.name];
            }
            
            if(this.pathname.includes('/cv/show')){
                textarea.setAttribute('value', element.innerText.trim().toLowerCase());
                textarea.innerText = element.innerText.trim().toLowerCase();
            }
            
            element.replaceWith(textarea);

            const textareaParent = textarea.parentElement;
            const textareaParentInnerHTML = textareaParent.innerHTML;

            if(textareaParent.nodeName === "UL"){
                const divToReplaceTextareaParent = this.dom.createElement('div', getClassFrom(textareaParent));
                
                textareaParent.replaceWith(divToReplaceTextareaParent);

                divToReplaceTextareaParent.innerHTML = textareaParentInnerHTML;

                if(this.modelName !== "cv-1"){
                    const label = this.dom.createElement('p', 'mb-1');
                    label.innerText = "Tâches réalisées :";
                    divToReplaceTextareaParent.before(label);
                }
            }
        })
    }

    transformElementsToBeSelect()
    {
        const elementsToBeSelect = Array.from(this.form.querySelectorAll('#select'));
        
        if(elementsToBeSelect && elementsToBeSelect.length > 0){
            elementsToBeSelect.forEach(element => {
                const selectName = element.getAttribute('aria-name');
                if(selectName === null){
                    console.error("L'element n'a pas d'attribut 'aria-name'");

                    return;
                }
                
                /**
                 * @type {HTMLSelectElement}
                 */
                const select = this.dom.createElement('select', getClassFrom(element) + " form-control mb-2");
                select.name = selectName;
                
                const ariaOptions = element.getAttribute('aria-options');
                if(ariaOptions === null){
                    console.error("L'élément ne possède pas l'attribute 'aria-options'");
                }
                
                const selectOptions = ariaOptions.split(", ");
                selectOptions.forEach(option => {
                    /**
                     * @type {HTMLOptionElement}
                     */
                    const optionElement = this.dom.createElement('option');
                    optionElement.innerText = option;
                    optionElement.value = option.toLowerCase();
                    
                    if(option.toLowerCase() === element.innerHTML.toLowerCase()){
                        optionElement.selected = true;
                    }

                    select.appendChild(optionElement);
                })
                
                select.setAttribute('aria-nodename', element.nodeName);

                element.replaceWith(select)
            })
        }
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    addLevelCursorWithIndicatorIfThereIsValue(element)
    {
        if(this.inputsValuesLength > 0 || this.pathname.includes('/cv/show')){
            this.barLevel = element.parentElement.querySelector('.bar-level');
            this.levelCursor = this.dom.createElement('span', 'level-cursor position-absolute shadow bg-primary');
            
            if(this.barLevel){
                this.barLevel.appendChild(this.levelCursor);
            
                this.levelIndicator = element.parentElement.querySelector('.level-indicator');
                if(this.levelIndicator){
                    this.levelCursor.style.left = this.levelIndicator.offsetWidth + "px";
                }
                
                if(this.pathname.includes('/cv/show')){
                    this.createInputWithLevelValue();

                    this.inputWithLevelValue.setAttribute('value', 
                    `${(this.levelIndicator.offsetWidth * 100 / this.barLevel.offsetWidth).toFixed(2)}`
                );
                }
            }
        }
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
    handleAddNewListElement(e)
    {
        e.preventDefault();

        /**
         * @type {HTMLButtonElement}
         */
        const addNewListElementButton = e.target;
        const previousList = addNewListElementButton.previousElementSibling;
        this.newListElement = addNewListElementButton.previousElementSibling.cloneNode();  
        this.newListElement.innerHTML = previousList.innerHTML
        
        this.organizeIfInputsDateWrappersExist();

        this.addClickEventToNewButtonIfExist();

        if(this.newListElement.classList.contains('experience')){
            const experienceTextareas = Array.from(this.newListElement.querySelectorAll('textarea'));
            if(experienceTextareas.length > 1){
                for(let i = 0; i < experienceTextareas.length; i++){
                    if(i > 0){
                        experienceTextareas[i].parentElement.removeChild(experienceTextareas[i]);
                    }
                }
            }
        }
        
        const newListElementLevelIndicators = Array.from(this.newListElement.querySelectorAll('.level-indicator'));
        if(newListElementLevelIndicators.length > 0){
            const lastListLevelIndicator = newListElementLevelIndicators[newListElementLevelIndicators.length - 1];
            lastListLevelIndicator.parentElement.removeChild(lastListLevelIndicator);
        }

        const newListElementCursors = Array.from(this.newListElement.querySelectorAll('.level-cursor'));
        if(newListElementCursors.length > 0){
            const lastListCursor = newListElementCursors[newListElementCursors.length - 1]
            lastListCursor.parentElement.removeChild(lastListCursor)
        }

        addNewListElementButton.before(this.newListElement);
        
        if(this.newListElement.className.includes('one')){

            this.dynamiseFieldsName("one", "two");

        }else if(this.newListElement.className.includes('two')){
            this.dynamiseFieldsName("two", "three");
        }else if(this.newListElement.className.includes('three')){
            this.dynamiseFieldsName("three", "four");
        }else if(this.newListElement.className.includes('four')){
            this.dynamiseFieldsName("four", "five");
        }else if(this.newListElement.className.includes('five')){
            this.dynamiseFieldsName("five", "six");
            
            const insideSkillsListLeft = this.newListElement.parentElement.classList.contains('skills-list-left');
            if(insideSkillsListLeft){
                const skillsListRight = this.newListElement.parentElement.nextElementSibling;
                skillsListRight.appendChild(this.newListElement);
                skillsListRight.appendChild(addNewListElementButton);
            }
        }else if(this.newListElement.className.includes('six')){
            this.dynamiseFieldsName("six", "seven");
        }else if(this.newListElement.className.includes('seven')){
            this.dynamiseFieldsName("seven", "eught");
        }else if(this.newListElement.className.includes('eight')){
            this.dynamiseFieldsName("eight", "nine");
        }else if(this.newListElement.className.includes('nine')){
            this.dynamiseFieldsName("nine", "ten");
        }
        
        if(this.inputWithLevelValue){
            this.inputWithLevelValue = undefined;
        }

        this.addListenersToEveryBarLevels();
    }

    organizeIfInputsDateWrappersExist()
    {
        const inputsDateWrappers = this.newListElement.querySelectorAll('.inputs-date-wrapper');

        let span;

        const dateContainer = this.newListElement.querySelector('.date.justify-content-between');
        if(dateContainer){
            span = dateContainer.querySelector('span.d-flex');
        }

        if(inputsDateWrappers && dateContainer){
            if(this.modelName === "cv-4" 
                && span 
                && dateContainer.parentElement.classList.contains('degree')
            ){
                inputsDateWrappers.forEach(dateWrapper => {
                    span.appendChild(dateWrapper);
                });
            }else {
                inputsDateWrappers.forEach(dateWrapper => {
                    dateContainer.appendChild(dateWrapper);
                });                
            }
            
        }
    }

    addClickEventToNewButtonIfExist()
    {
        this.throwErrorIfUndefined(this.newListElement, "this.newListElement");

        const addIntoListButton = this.newListElement.querySelector('.add-into-list');
        if(addIntoListButton){
            addIntoListButton.addEventListener('click', this.handleAddNewListElement.bind(this));
        }
    }

    /**
     * 
     * @param {HTMLElement} newListElement nouvelle élément ajoutée dans la liste
     * @param {string} from 
     * @param {string} to 
     */
    dynamiseFieldsName(from, to)
    {
        this.newListElement.className = this.newListElement.className.replace(from, to);

        const listsInputs = [...Array.from(this.newListElement.querySelectorAll('input')), 
            ...Array.from(this.newListElement.querySelectorAll('select')),
            ...Array.from(this.newListElement.querySelectorAll('textarea'))
        ];
            
        if(listsInputs.length > 0){
            listsInputs.forEach(listInput => {
                listInput.name = listInput.name.replace(from, to);
            });
        }else {
            this.newListElement.name = this.newListElement.name.substring(0, this.newListElement.name.lastIndexOf(from)) + to;
        }
    }
    
    addListenersToEveryBarLevels()
    {
        const barLevels = document.querySelectorAll('.level.bar-level');
        barLevels.forEach(barLevel => {

            let levelCursor = barLevel.querySelector('.level-cursor');
            
            if(isNull(levelCursor)){
                levelCursor = this.dom.createElement('span', 'level-cursor position-absolute shadow bg-primary');
                barLevel.appendChild(levelCursor);   
            }

            if(this.pathname.includes('/cv/show')){
                this.levelIndicator = barLevel.parentElement.querySelector('.level-indicator');
                if(isNull(this.levelIndicator)){
                    this.levelIndicator = this.dom.createElement('span', 'level-indicator position-absolute top-0 start-0');
                    barLevel.appendChild(this.levelIndicator);
                }

                const barLevelRect = barLevel.getBoundingClientRect();
                const levelCursorPosPx = barLevelRect.width * parseFloat(barLevel.getAttribute('aria-level')) / 100;
                levelCursor.style.left = (100 * levelCursorPosPx / barLevelRect.width) + "%";

                const levelCursorRect = levelCursor.getBoundingClientRect();
                
                const levelIndicatorWidth = levelCursorRect.x - barLevelRect.x;

                this.levelIndicator.style.width = levelIndicatorWidth + "px";
            }

            levelCursor.addEventListener('mousedown', this.handleLevelCursorMouseDown.bind(this));
            levelCursor.addEventListener('mouseup', this.handleLevelCursorMouseUp.bind(this));

            barLevel.addEventListener('click', this.handleBarLevelClick.bind(this));
            barLevel.addEventListener('mousemove', this.handleLevelCursorMove.bind(this));
            barLevel.addEventListener('mouseleave', this.handleBarLevelMouseleave.bind(this));
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

                const barLevelInputWithLevelValue = this.barLevel.querySelector('.level-value');
                if(isNull(barLevelInputWithLevelValue)){
                    this.inputWithLevelValue = this.dom.createElement('input', 'level-value');
                    this.inputWithLevelValue.type = "hidden";

                    const previousElementOfParent = this.barLevel.parentElement.previousElementSibling;

                    let previousElementOfParentLevelInput;

                    if(previousElementOfParent){
                        previousElementOfParentLevelInput = previousElementOfParent.querySelector('.level-value')
                    }
                    
                    if(isNull(previousElementOfParent)){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_one"
                    }else if(previousElementOfParentLevelInput.name.includes('one')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_two";
                    }else if(previousElementOfParentLevelInput.name.includes('two')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_three";
                    }else if(previousElementOfParentLevelInput.name.includes('three')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_four";
                    }else if(previousElementOfParentLevelInput.name.includes('four')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_five";
                    }else if(previousElementOfParentLevelInput.name.includes('five')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_six";
                    }else if(previousElementOfParentLevelInput.name.includes('six')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_seven";
                    }else if(previousElementOfParentLevelInput.name.includes('seven')){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_eight";
                    }else if(previousElementOfParentLevelInput.name.includes("eight")){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_nine";
                    }else if(previousElementOfParentLevelInput.name.includes("nine")){
                        this.inputWithLevelValue.name = 
                            this.barLevel.getAttribute('id')
                                .replace('level', '') + "level_ten";
                    }

                    this.barLevel.appendChild(this.inputWithLevelValue)
                }else {
                    this.inputWithLevelValue = barLevelInputWithLevelValue;
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
        
        if(this.levelCursorOrigin 
            && this.levelCursor 
            && this.barLevel
        ){
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
                
                const barLevelInputWithLevelValue = this.barLevel.querySelector('.level-value');
                if(isUndefined(this.inputWithLevelValue) ||
                    isNull(barLevelInputWithLevelValue)
                ){
                    this.createInputWithLevelValue();
                    
                }else if(barLevelInputWithLevelValue){
                    this.inputWithLevelValue = barLevelInputWithLevelValue;
                }

                this.inputWithLevelValue.setAttribute('value', 
                    `${(levelIndicatorWidth * 100 / this.barLevel.offsetWidth).toFixed(2)}`
                );

            }
        }
    }

    createInputWithLevelValue()
    {
        this.inputWithLevelValue = this.dom.createElement('input', 'level-value');
        this.inputWithLevelValue.type = "text";
        this.inputWithLevelValue.hidden = true;

        const previousElementOfParent = this.barLevel.parentElement.previousElementSibling;
        let previousElementOfParentLevelInput;
        if(previousElementOfParent){
            previousElementOfParentLevelInput = previousElementOfParent.querySelector('.level-value')
        }
                    
        if(isNull(previousElementOfParent)){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_one"
        }else if(previousElementOfParentLevelInput.name.includes('one')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_two";
        }else if(previousElementOfParentLevelInput.name.includes('two')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_three";
        }else if(previousElementOfParentLevelInput.name.includes('three')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_four";
        }else if(previousElementOfParentLevelInput.name.includes('four')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_five";
        }else if(previousElementOfParentLevelInput.name.includes('five')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_six";
        }else if(previousElementOfParentLevelInput.name.includes('six')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_seven";
        }else if(previousElementOfParentLevelInput.name.includes('seven')){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_eight";
        }else if(previousElementOfParentLevelInput.name.includes("eight")){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_eight";
        }else if(previousElementOfParentLevelInput.name.includes("eight")){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_nine";
        }else if(previousElementOfParentLevelInput.name.includes("nine")){
            this.inputWithLevelValue.name = this.barLevel.getAttribute('id').replace('level', '') + "level_ten";
        }

        this.barLevel.appendChild(this.inputWithLevelValue)
    }

    handleBarLevelMouseleave(e)
    {
        e.preventDefault();

        if(this.levelCursorOrigin){
            document.body.addEventListener('mousemove', e => {
                e.preventDefault();
                
                this.moveFromBody = true;

                this.handleLevelCursorMove(e);
            });
            document.body.addEventListener('click', e => {
                e.preventDefault();
                this.levelCursorOrigin = undefined;
            });
        }
    }

    createHiddenInputForCvModel()
    {
        if(isNull(this.form.querySelector('.cv-model'))){
            /**
             * @type {HTMLInputElement}
             */
            const hiddenInputWithModelname = this.dom.createElement('input', 'cv-model');
            hiddenInputWithModelname.name = "model";
            hiddenInputWithModelname.type = "hidden";
            hiddenInputWithModelname.setAttribute('value', this.form.classList[1]);
            this.form.appendChild(hiddenInputWithModelname);
            this.modelName = hiddenInputWithModelname.value;
        }
    }

    addClickableSeeButton()
    {
        this.throwErrorIfFormUndefined();
        
        this.seeButtonContainer = this.dom.createElement('div', 
            'see-button-container position-fixed d-flex justify-content-between p-3 rounded start-0 end-0 m-auto'
        );

        this.seeButtonContainer.innerHTML = `Voir le CV ${EyeIcon("icon")}`;

        document.body.appendChild(this.seeButtonContainer);

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

        this.transformFormToRealCV();
    }

    transformFormToRealCV()
    {
        let formInputs;
        let formTextareas;
        let formSelects;

        if(this.form){
            formInputs = this.form.querySelectorAll('input')
            formTextareas = this.form.querySelectorAll('textarea');
            formSelects = this.form.querySelectorAll('select');
        }else {
            const form = document.querySelector('form');
            if(form){
                formInputs = form.querySelectorAll('input');
                formTextareas = form.querySelectorAll('textarea');
                formSelects = form.querySelectorAll('select')
            }
        }
        
        this.addCloseButton();

        this.removeLevelCursors();

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

        if(formSelects){
            this.formSelects = formSelects;
            this.transformEachSelectToText();
        }
        
        this.divFromForm = this.transformFormToDiv();

        this.replaceSeeButtonContainerToConsole();

        this.addClickEventToConsoleButtons();

        const svgProfilePhoto = document.querySelector('svg.profile-photo');

        if(this.pathname.includes('/cv/show')
            && this.editCvClicked && this.profilePhotoImg
            && svgProfilePhoto !== null
        ){
            svgProfilePhoto.replaceWith(this.profilePhotoImg);
        }

        this.removeLevelCursorsIfExist();
    }

    addCloseButton()
    {
        this.closeIconContainer = this.dom.createElement('div', "close-icon-container position-fixed");
        this.closeIconContainer.innerHTML = CloseIcon();

        document.body.appendChild(this.closeIconContainer);

        this.closeIconContainer.addEventListener('click', this.handleCloseFinalCV.bind(this));
    }

    handleCloseFinalCV(e)
    {
        e.preventDefault();

        this.closeButtonClickNumber++;

        this.createCVForm();

        this.removeConsole();

        this.removeCloseButton();
    }

    removeCloseButton()
    {
        if(this.closeIconContainer){
            this.closeIconContainer.parentElement.removeChild(this.closeIconContainer);
        }
    }

    removeConsole()
    {
        if(this.console){
            this.console.parentElement.removeChild(this.console);
        }
    }

    removeLevelCursors()
    {
        const levelValueInputs = this.form.querySelectorAll('.level-value');
        
        if(levelValueInputs.length > 0){
            const levelCursors = this.form.querySelectorAll('.level-cursor');
            
            levelCursors.forEach(levelCursor => {
                levelCursor.parentElement.removeChild(levelCursor);
            })
        }
    }

    transformEachInputToText()
    {
        if(this.formInputs){
            this.formInputs.forEach(formInput => {
                const formInputIsHidden = formInput.type === "hidden" ;
                if(!formInputIsHidden
                    && !formInput.classList.contains('profile-photo')
                    && !formInput.classList.contains('level-value')
                    && !formInput.classList.contains('man')
                    && !formInput.classList.contains('woman')
                    && !formInput.classList.contains('')
                ){
                    let formInputParent = formInput.parentElement;

                    const className = getClassFrom(formInput);
                    
                    const elementToReplaceInput = this.dom.createElement(
                        formInput.getAttribute('aria-nodename').toLowerCase(), 
                        className.replace('form-control', '').replace('mb-2', 'mb-0')
                    );

                    const inputValue = formInput.files !== null ? formInput.files[0] : formInput.value;
                    if(inputValue && inputValue.length > 0){
                        this.saveInputsValues(formInput.name, inputValue);
                    }else {
                        this.savePlaceholder(formInput.name, formInput.getAttribute('placeholder'));
                    }

                    let elementInnerText;
                    
                    if(formInput.name === "name"){
                        elementInnerText = this.textStylePerModel[this.modelName].name 
                            === "uppercase" 
                            ? inputValue.toUpperCase() : 
                            inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
                    }else if(formInput.name === "firstname"){
                        elementInnerText = this.textStylePerModel[this.modelName].firstname 
                            === "uppercase" 
                            ? inputValue.toUpperCase() : 
                            inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
                    }else if(formInput.name === "work"){
                        elementInnerText = this.textStylePerModel[this.modelName].work 
                            === "uppercase" 
                            ? inputValue.toUpperCase() : 
                            inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
                    }else if(formInput.name === "email" || formInput.name === 'url_linkedin'){
                        elementInnerText = inputValue;
                    }else if(formInput.name.includes("year")){
                        const splittedDate = inputValue.split('-');

                        const formInputGrandParent = formInputParent.parentElement;
                        formInputGrandParent.appendChild(formInput);

                        const inputsDateWrappers = formInputGrandParent.querySelector('.inputs-date-wrapper');
                        
                        if(!isNull(inputsDateWrappers)){
                            formInputParent.parentElement.removeChild(inputsDateWrappers);
                        }

                        if(formInput.name.includes("formation")){
                            elementInnerText = splittedDate[0];
                        }else {
                            elementInnerText = months[parseInt(splittedDate[1])] + " " + splittedDate[0];
                        }
                       
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

                    const formInputParentChildren = Array.from(formInputParent.children);
                    const separator = formInputParent.getAttribute('aria-separator');
                    
                    const secondLoopForInputTypeDate = formInputParent.classList.contains('justify-content-start')
                        && formInput.name.includes('year');

                    if((formInputParent.classList.contains('justify-content-between')
                        || secondLoopForInputTypeDate
                        )
                        && separator && formInputParentChildren.length > 1
                    ){
                        
                        formInputParent.className = getClassFrom(formInputParent).replace('between', 'start');

                        this.insertSeparatorSpanBeforeLastFormInput(
                            formInputParent, 
                            formInputParentChildren, 
                            separator
                        )
                    }

                    elementToReplaceInput.setAttribute('id', "input");
                    elementToReplaceInput.setAttribute('aria-name', formInput.name);
                    
                    if(formInput.type !== "text"){
                        elementToReplaceInput.setAttribute('aria-type', formInput.type);
                    }

                    const formInputNextElement = formInput.nextElementSibling;
                    if(formInputNextElement 
                        && formInputNextElement.classList.contains('text-danger')
                    ){
                        formInput.parentElement.removeChild(formInputNextElement);
                    }

                    formInput.replaceWith(elementToReplaceInput);

                    const dateValuesHolders = Array.from(
                        elementToReplaceInput.parentElement.querySelectorAll('span[hidden]')
                    );
                    
                    const ariaName = elementToReplaceInput.getAttribute('aria-name');

                    if(this.pathname.includes('/cv/show') 
                        && ariaName.includes('year')
                    ){
                        elementToReplaceInput.after(dateValuesHolders[0]);
                    }
                }else if(!formInputIsHidden && !formInput.classList.contains('profile-photo')
                    && !formInput.classList.contains('man')
                    && !formInput.classList.contains('woman')
                ) {
                    if(formInput.name.includes('level')){
                        this.saveInputsValues(formInput.name, formInput.value);
                        
                        const inputParentElement = formInput.parentElement;

                        const levelCursor = inputParentElement.querySelector('.level-cursor');
                        if(levelCursor){
                            inputParentElement.removeChild(levelCursor)
                        }
                    }
                }else if(formInput.classList.contains('profile-photo')) {
                    if(!this.shownProfilePhoto){
                        formInput.innerHTML = UserIcon(getClassFrom(formInput));
                        
                        const userIcon = formInput.querySelector('.profile-photo');
                        formInput.replaceWith(userIcon);
                    }
                }else if(formInputIsHidden) {
                    this.saveInputsValues(formInput.name, formInput.value);
                }else if(formInput.classList.contains('man')
                    || formInput.classList.contains('woman')
                ){
                    if(formInput.getAttribute('selected') === "true"){
                        this.saveInputsValues(formInput.name, formInput.value);
                    }
                    
                    if(this.form.querySelector('.sex')){
                        const formInputGrandParent = formInput.parentElement.parentElement;
                        formInputGrandParent.parentElement.removeChild(formInputGrandParent);
                    }
                }
            })
        }
    }

    saveInputsValues(inputName, inputValue)
    {
        if(this.closeButtonClickNumber > 0
            && (inputName === "email" || inputName === "phone_number" || inputName === "profile_photo")
            && this.inputsValues[inputName] === inputValue
            && this.saved
        ){
            console.log('mustupdate')
            this.mustUpdateWhenSaving = true;
        }

        if(inputValue){
            this.inputsValues[inputName] = (inputName !== "profile_photo" && !inputName.includes('year')) 
                ? inputValue.toLowerCase() 
                : inputValue;

            this.inputsValuesLength++;
        }
    }

    /**
     * 
     * @param {HTMLDivElement|HTMLParagraphElement} formInputParent 
     * @param {HTMLInputElement[]} formInputParentChildren 
     * @param {string} separator
     */
    insertSeparatorSpanBeforeLastFormInput(formInputParent, formInputParentChildren, separator)
    {
        const separatorSpan = this.dom.createElement('span');
        separatorSpan.innerText = separator;
        separatorSpan.style.marginLeft = "5px";
        separatorSpan.style.marginRight = "5px";
        separatorSpan.setAttribute('id', 'separator');
                        
        const previousSeparatorSpan = formInputParent.querySelector('#separator');
        if(previousSeparatorSpan 
            && previousSeparatorSpan.parentElement === formInputParent 
        ){
            formInputParent.removeChild(previousSeparatorSpan);
            //previousSeparatorSpan.parentElement.removeChild(previousSeparatorSpan);
        }else if(previousSeparatorSpan 
            && previousSeparatorSpan.parentElement !== formInputParent
        ){
            formInputParent.querySelector('span').removeChild(previousSeparatorSpan);
        }

        formInputParentChildren[formInputParentChildren.length - 1].before(separatorSpan);
    }

    savePlaceholder(inputName, inputPlacehoder)
    {
        this.inputsPlaceholders[inputName] = inputPlacehoder;
    }

    transformProfilePhotoInputToImg()
    {
        this.throwErrorIfFormUndefined();

        this.profilePhotoInput = this.form.querySelector('input.profile-photo');
        
        if(this.profilePhotoInput){
            this.profilePhotoInput.parentElement.removeChild(this.profilePhotoInput.previousElementSibling);

            const file = this.profilePhotoInput.files[0];
            if(file){
                this.saveInputsValues(this.profilePhotoInput.name, file);
                this.showProfilePhoto(file);
            }
        }
    }

    showProfilePhoto(file)
    {
        this.throwErrorIfUndefined(this.profilePhotoInput, "this.profilePhotoInput");

        /**
        * @type {HTMLImageElement}
        */
        const profilePhotoImg = this.dom.createElement('img', 'profile-photo');
        profilePhotoImg.src = URL.createObjectURL(file);
        profilePhotoImg.id = "input";
        profilePhotoImg.setAttribute('aria-type', "file");
        profilePhotoImg.setAttribute("aria-name", "profile_photo" );

        this.profilePhotoInput.replaceWith(profilePhotoImg);

        this.shownProfilePhoto = true;
    }

    transformEachTextareaToText()
    {
        this.throwErrorIfUndefined(this.formTextareas, "this.formTextareas");

        this.transformToText(this.formTextareas, "textarea");
    }

    /**
     * 
     * @param {HTMLTextAreaElement[] | HTMLSelectElement[]} elements 
     */
    transformToText(elements, elementNode) {
        elements.forEach(element => {
            const className = getClassFrom(element);
            const elementOfReplacement = this.dom.createElement(
                element.getAttribute('aria-nodename').toLowerCase(), 
                className.replace('form-control', '').replace('mb-2', 'mb-0')
            );
                    
            const inputValue = element.value;
            this.saveInputsValues(element.name, inputValue);

            let elementInnerText;
                    
            if(element.name === "name"){
                elementInnerText = this.textStylePerModel[this.modelName].name === "uppercase" ? inputValue.toUpperCase() : 
                    inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
            }else {
                elementInnerText = inputValue.substring(0, 1).toUpperCase() + inputValue.slice(1, inputValue.length);
            }

            elementOfReplacement.innerHTML = elementInnerText;

            elementOfReplacement.setAttribute('id', elementNode);
            elementOfReplacement.setAttribute('aria-name', element.name);

            if(elementNode === "select"){
                let ariaOptions = "";

                const options = Array.from(element.querySelectorAll('option'));
                if(options.length > 0){
                    ariaOptions = options.map(option => {
                        return option.innerText;
                    }).join(', ');
                }
                elementOfReplacement.setAttribute('aria-options', ariaOptions)
            }

            const nextElement = element.nextElementSibling;
            if(nextElement 
                && nextElement.classList.contains('text-danger')
            ){
                element.parentElement.removeChild(nextElement);
            }

            element.replaceWith(elementOfReplacement);
        })
    }

    transformEachSelectToText()
    {
        this.throwErrorIfUndefined(this.formSelects, "this.formSelects");

        this.transformToText(this.formSelects, "select");
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

    replaceSeeButtonContainerToConsole()
    {
        if(this.seeButtonContainer){
            this.createConsole();

            this.seeButtonContainer.replaceWith(this.console);
        }
    }

    addClickEventToConsoleButtons()
    {
        this.throwErrorIfUndefined(this.console, "this.console");
        
        const consoleButtons = this.console.querySelectorAll('.icon');
        consoleButtons.forEach(consoleButton => {
            consoleButton.addEventListener('click', this.handleConsoleButtonClick.bind(this));
        })
    }

    handleConsoleButtonClick(e)
    {
        e.preventDefault();
        
        const button = e.currentTarget;
        if(hasClass(button, "save-icon") 
            && this.inputsValuesLength > 0
        ){
            this.handleSaveCV();
        }else if(hasClass(button, "download-icon") 
            && (this.inputsValuesLength > 0 || this.elementsInnerTextLength > 0)
        ) {
            this.handleDownloadCV();
        }else if(hasClass(button, "delete-icon")){
            this.handleDeleteCV();
        }else if(hasClass(button, "edit-icon")){
            this.handleEditCV();
        }
    }

    handleSaveCV(download = false)
    {
        const formData = new FormData();
        
        for(const name in this.inputsValues){
            formData.append(name, this.inputsValues[name]);
        }

        if(this.pathname.includes('/cv/show')
            || this.mustUpdateWhenSaving
        ){
            const cv_id_input = document.querySelector('.cv-id');
                
            if(cv_id_input){
                formData.append(cv_id_input.name, cv_id_input.value);
            }else if(this.lastInsertedCvId){
                formData.append("cv_id", this.lastInsertedCvId);
            }

            axios.post('/cv/edit', formData).then(res => {
                this.processCvPostingRes(res, download);

                this.saved = true;
            }).catch(err => {
                this.processCvPostingError(err);
            })

            return;
        }

        console.log(this.inputsValues, formData)
        debugger
        axios.post("/cv/save", formData).then(res => {
            this.processCvPostingRes(res, download);

            this.saved = true;
        }).catch(err => {
            this.processCvPostingError(err);
        });
    }

    /**
     * prend en charge les choses à faire après l'envoi de la requête d'enregistrement ou
     * de modification du CV
     * 
     * @param {import("axios").AxiosResponse<any>} response 
     * @param {boolean} download 
     */
    processCvPostingRes(response, download)
    {
        if(response.data.success){
            this.showNotificationAndActivateFinishButton();

            if(download){
                this.launchDownload();
            }
        }

        if(response.data.cv_id){
            this.lastInsertedCvId = parseInt(response.data.cv_id);
        }
    }

    /**
     * prend en charge les choses à faire après une erreur d'envoi de la requête d'enregistrement ou
     * de modification du CV
     * @param {import("axios").AxiosResponse<any>} response 
     */
    processCvPostingError(err)
    {
        const errorData = err.response.data;
        if("errors" in errorData){
            this.createCVForm();

            this.removeConsole();

            this.removeCloseButton();

            for(const name in errorData.errors){
                const input = this.form.querySelector(`input[name="${name}"]`);
                if(input){
                    const error = this.dom.createElement('small', "text text-danger fs-6");
                    error.innerText = errorData.errors[name];

                    if(!input.classList.contains('man') || !input.classList.contains('woman')){
                        input.after(error)
                    }else {
                        input.nextElementSibling.after(error);
                    }
                    
                }else {
                    const textarea = this.form.querySelector(`textarea[name="${name}"]`); 
                    const error = this.dom.createElement('small', "text text-danger fs-6");
                    error.innerText = errorData.errors[name];

                    textarea.after(error)
                }
            }
        }
    }

    showNotificationAndActivateFinishButton()
    {
        this.dom.createModal(
            "alert-success-cv-saving p-3 position-absolute start-0 end-0 m-auto alert alert-success", 
            "Votre CV a été enregistré !",
            false
        );
        
        setTimeout(()=>{
            this.dom.closeModal();
        }, 3000);

        const finishButton = this.console.querySelector('.check-icon');
        finishButton.classList.add('active');

        finishButton.addEventListener('click', this.handleFinishCVModeling.bind(this));
    }

    handleDownloadCV()
    {
        if(this.pathname.includes('/cv/show')){
            this.launchDownload(false);
        }else {
            this.handleSaveCV(true);
        }
        
    }

    launchDownload(withInputsValues = true)
    {
        axios.post("/cv/download", withInputsValues ? this.inputsValues : this.elementsInnerText).then(res => {
            this.showNotificationAndActivateFinishButton();
            
            this.saved = true;
        }).catch(err => {
            const errorString = err.toString();
            if(errorString.toLowerCase().includes('network error')){
                this.showNotificationAndActivateFinishButton();
            }
        })
    }

    handleDeleteCV()
    {
        if(isUndefined(this.cv_id_input)
            && isUndefined(this.csrfInput)
        ){
            this.cv_id_input = document.querySelector('input.cv-id');
        
            this.csrfInput;

            const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
            hiddenInputs.forEach(hiddenInput => {
                if(hiddenInput.name === "_token"){
                    this.csrfInput = hiddenInput;
                }
            })
        }
        
        
        if(this.cv_id_input 
            && isNumber(parseInt(this.cv_id_input.value)) 
            && this.csrfInput
        ){
            this.dom.createModal('delete-cv-modal shadow bg-white p-3 position-absolute start-0 end-0 m-auto', `
                <form action="/cv/delete" method="post">
                    <p class='text-center'>Êtes-vous sûr de vouloir supprimer ce CV ?</p>
                    <div class='buttons position-absolute end-0'>
                        <a class='btn btn-secondary no'>Annuler</a>
                        <button class='btn btn-danger sure' type='submit'>Oui, supprimer</button>
                    </div>
                </form>
            `);

            this.dom.modal.appendChild(this.cv_id_input);
            this.dom.modal.appendChild(this.csrfInput);

            this.dom.setFormAction("/cv/delete");

            this.dom.setUrlForRedirection('/cvs');

            this.dom.setNotificationContent("Le CV a été supprimé avec succès");

            this.dom.handleActionsInModalForm();
        }
        
    }

    handleEditCV()
    {
        this.editCvClicked = true;

        this.createCVForm();
    }

    handleFinishCVModeling(e)
    {
        document.location.href = "/";
    }

    removeLevelCursorsIfExist()
    {
        this.throwErrorIfFormUndefined();

        const levelCursors = document.querySelectorAll('.level-cursor');
        if(levelCursors.length > 0){
            levelCursors.forEach(levelCursor => {
                levelCursor.parentElement.removeChild(levelCursor);
                
            })
        }
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