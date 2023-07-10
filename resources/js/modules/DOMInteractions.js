import { isEmpty } from "lodash"
import CloseIcon from "../icons/close-icon"
import axios from "axios"

export default class DOMInteractions {

    formAction = ''
    notificationClassName = ''
    showNotification = true

    constructor()
    {
        this.emptyInputsMessage = []
        this.timeOutForReload = 1000
        this.modalHeightToAdd = 0
        this.responseJSON
        this.modalFormMethod = "post"
    }

    animateElementFromClassname(element, classNameForAnimation)
    {
        element.offsetWidth
        element.classList.add(classNameForAnimation)
    }

    createCircleLoader()
    {
        this.createCircle()
    }

    removeModalFromDOMWithAnimation()
    {
        this.modal.classList.remove('active-modal')
        this.modal.addEventListener('transitionend', ()=>{
            if(
                this.modalContainer
                && this.modalContainer.parentElement !== null
            ){
                this.modalContainer.parentElement.removeChild(this.modalContainer)
            }  
        })
    }
    
    /**
     * @return {HTMLElement} element
     */
    createElement(type, className = null) 
    {
        let element = document.createElement(type);
        if (className !== null) {
            element.className = className;
        }
        return element;
    }

    createModal(className, content)
    {
        this.modalContainer = this.createElement('div', 'modal-container position-relative')
        this.modal = this.createElement('div', `main-modal ${className}`)

        this.appendModalToDOM()
        this.innerModalDefaultContent()
        this.animateElementFromClassname(this.modal, 'active-modal')
        this.innerElementContentHTML(this.modal,  content)
        this.modalContainer.addEventListener('click', this.closeModalThenRemoveHisEventListener.bind(this))
        this.avoidCloseModalOnClickIn()

        return this.modal
    }

    innerModalDefaultContent(){
        this.modal.innerHTML = `
            <div class='w-100 close-btn-container'>
                ${CloseIcon("close-btn float-end mb-2")}
            </div>
            <div class='content'></div>
        `
    }
    
    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} contentHTML 
     */
    innerElementContentHTML(element, contentHTML)
    {
        if(typeof contentHTML === "object") {
            element.appendChild(contentHTML)
        }else {
            if(element === this.modal){
                const contentElement = element.querySelector('.content')
                if(contentElement){
                    contentElement.innerHTML = contentHTML
                }

                return
            }

            element.innerHTML = contentHTML
        }
        
    }

    appendModalToDOM()
    {
        document.body.appendChild(this.modalContainer)
        this.modalContainer.appendChild(this.modal)
    }

    avoidCloseModalOnClickIn()
    {
        this.modal.addEventListener('click', (e)=>{
            e.stopPropagation()
        })
    }

    closeModal()
    {
        this.removeModalFromDOMWithAnimation()
    }

    handleActionsInModalContent()
    {
        if(this.isModalAForm()){
            this.handleActionsInModalForm()
        }else if(this.isModalConfirmation()){
            this.handleActionsInModalConfirmation()
        }else {
            this.handleActionsInSimpleModal()
        }
    }

    isModalAForm()
    {
        const modalForm = this.modal.querySelector('form')
        const noBtn = this.modal.querySelector(".no")

        return modalForm !== null && noBtn === null
    }

    isModalConfirmation()
    {
        return this.modal.classList.contains('sure')
    }

    handleActionsInModalForm()
    {
        this.primaryButton = this.modal.querySelector('.btn.btn-primary')
        this.primaryButton.addEventListener('click', this.handleModalPirmaryButtonClick.bind(this))
        this.ClickOnCloseModalButton()
    }

    handleActionsInModalConfirmation()
    {
        const noBtn = this.modal.querySelector('.no')
        const validateButton = this.modal.querySelector('.sure')

        noBtn?.addEventListener('click', ()=>{
            this.removeModalFromDOMWithAnimation()
        })

        if(this.modal.querySelector('form')){
            this.handleActionsInModalForm();
        }else {
            validateButton.addEventListener('click', (e)=>{
                e.preventDefault();
            })
        }
        

        this.ClickOnCloseModalButton()
    }

    ClickOnCloseModalButton()
    {
        this.modalCloseBtn = this.modal.querySelector('.close-btn')
        this.modalCloseBtn.addEventListener('click', this.closeModalThenRemoveHisEventListener.bind(this))
    }

    handleActionsInSimpleModal()
    {
        this.ClickOnCloseModalButton()
    }
    
    /**
     * 
     * @param {MouseEvent} e 
     */
    handleModalPirmaryButtonClick(e)
    {
        e.preventDefault();
        
        this.createDataToPostObj();
        this.handleDataPosting();
    }

    /**
     * 
     * @param {Event} e 
     */
    closeModalThenRemoveHisEventListener(e)
    {
        this.closeModal()
        e.target.removeEventListener('click', this.closeModalThenRemoveHisEventListener)
    }
    
    /**
     * @var currentClickedButton est déclarée dans une méthode là où l'on a besoin qu'elle
     * ne soit plus undefined prochainement
     */
    createDataToPostObj()
    {
        this.modalInputs
        if(this.modal){
            this.modalInputs = [].slice.call(this.modal.querySelectorAll('input'))
        }
        
        this.inputs = [].slice.call(document.querySelectorAll('input'))

        if(this.currentClickedButton){
            this.hiddenInputsContainingDataNeededForDeletion = [].slice.call(this.currentClickedButton.parentElement.querySelectorAll('input[type="hidden"]'))
        }
        
        this.dataToPostObj = {}
        
        if(this.modalInputs && !isEmpty(this.modalInputs)){
            this.modalInputs.forEach(input => {
                this.setIntoDataToPostValueOf(input) 
            })
        }else if(!isEmpty(this.hiddenInputsContainingDataNeededForDeletion)) {
            this.hiddenInputsContainingDataNeededForDeletion.forEach(input => {
                this.setIntoDataToPostValueOf(input)
            })
        }else if(this.inputs && !isEmpty(this.inputs)){
            this.inputs.forEach(input => {
                this.setIntoDataToPostValueOf(input) 
            })
        }
        
    }

    setIntoDataToPostValueOf(input)
    {
        if(
            input.type === 'text' || 
            input.type === 'number' || 
            input.type === 'email' ||
            input.type === 'hidden' || 
            input.type === 'password'
        ){
            this.dataToPostObj[input.name] = input.value
        }else if(input.type === 'file'){
            this.dataToPostObj[input.name] = input.files[0]
        }
    }

    handleDataPosting(urlForRedirection = null)
    {
        if(this.isDataPostValid()){
            this.postForm(urlForRedirection)
        }else{
            this.alertEmptyInputs()
        }
    }

    /**
     * @return {boolean} retourne s'il y a un input vide
     */
    isDataPostValid()
    {
        let isInputEmpty = true
        
        for(const name in this.dataToPostObj){
            if(this.dataToPostObj[name] === null ||
                this.dataToPostObj[name] === '' || 
                this.dataToPostObj[name] === undefined
            ){
                this.emptyInputsMessage[name] = "Ce champ ne peut pas être vide."
                isInputEmpty = false
            }
        }

        return isInputEmpty
    }

    postForm(urlForRedirection = null)
    {
        if(this.showNotification){
            this.postContentWithNotification(urlForRedirection)
        }else{
            this.submitDirectyly()
        }
    }
    
    alertEmptyInputs()
    {
        if(this.modalInputs){
            this.modalInputs.forEach(input => {
                if(this.isMessageCorrespondsTo(input.name)){
                    this.showErrorMessage(input)
                }
            })
        }else if(this.inputs){
            this.inputs.forEach(input => {
                if(this.isMessageCorrespondsTo(input.name)){
                    this.showErrorMessage(input)
                }
            })
        }
    }
    

    /**
     * 
     * @param {string} inputName 
     * @returns {boolean} Est-ce qu'il y a un message d'erreur correspondant au nom de l'input ?
     */
    isMessageCorrespondsTo(inputName)
    {
        return this.emptyInputsMessage[inputName] !== null || this.emptyInputsMessage[inputName] !== undefined
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     */
    showErrorMessage(input)
    {
        if(input.name === 'image'){
            this.alertEmptyImage(input)
        }else{
            this.showMessageAfter(input)
        }
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     */
    alertEmptyImage(input)
    {
        input.focus()
        this.showMessageAfter(input)
    }

    createFailParapgraph(inputName)
    {
        let failParagraph = this.createElement('small', 'form-text text-muted fail')
        failParagraph.innerHTML = this.emptyInputsMessage[inputName]

        return failParagraph
    }
    
    showAlertMsgBeforeBtn(inputName)
    {
        this.form.removeChild(this.modalAddBtn)
        let failParagraph = this.createFailParapgraph(inputName)

        this.form.appendChild(failParagraph)
        this.form.appendChild(this.modalAddBtn)
    }

    showMessageAfter(input)
    {
        const failParagraph = this.createFailParapgraph(input.name)
        const elementAfterInput = input.nextElementSibling

        if(elementAfterInput === null){
            input.after(failParagraph)
            if(this.modal){
                this.modalHeightToAdd = failParagraph.offsetHeight
                this.growModalHeigth()
            }
        }
    }

    growModalHeigth()
    {
        this.modal.style.height = this.modal.offsetHeight + this.modalHeightToAdd + 'px'
    }

    postContentWithNotification(urlForRedirection)
    {
        axios.post(this.formAction, this.dataToPostObj)
            .then(response => {
                if(this.modal){
                    this.closeModal()
                }
                
                if(this.showNotification) {
                    this.showNotificationWithDataInMilliseconds({
                        className: this.notificationClassName, 
                        content: JSON.parse(response).success
                    }, 2000)
                    
                    if(urlForRedirection){
                        document.location.href = urlForRedirection
                    }else {
                        this.reloadPage()
                    }
                    
                }
            }).catch(error => {
                const errorResponseJSON = JSON.parse(error.response)
                if("message" in errorResponseJSON){
                    this.createErrorAlertAfterElement(
                        "#image", 
                        errorResponseJSON.message.includes("invalid") ? 
                        "Fichier invalide" : errorResponseJSON.message
                    )
                }
            })
    }

    submitDirectyly()
    {
        if(this.modalFormMethod.toLocaleLowerCase() === "get"){
            this.modal.querySelector('form').submit()
        }else if(this.modalFormMethod.toLocaleLowerCase() === "post"){
            axios.post(this.formAction, this.dataToPostObj)
                .then(response => {
                    //
                }).catch(error => {
                    const errorData = error.response.data
                    if("message" in errorData && errorData.message === "Unauthenticated."){
                        document.location.href = "/login"
                    }
                })
        }
        
    }

    setFormAction(url){
        this.formAction = url
    }

    /**
     * 
     * @param {boolean} value 
     */
    setShowNotification(showNotification){
        this.showNotification = showNotification
    }

    reloadPage()
    {
        setTimeout(()=>{
            location.reload()
        }, this.timeOutForReload)
        
    }

    /**
     * 
     * @param {{className: string, content: string}} data 
     * @param {number} timeInMilliseconds 
     */
    showNotificationWithDataInMilliseconds(data, timeInMilliseconds)
    {
        this.createModal(data.className, data.content)

        setTimeout(()=>{
            this.closeModal()
        }, timeInMilliseconds)
    }

    stopEventPropagationInBody()
    {
        document.body.addEventListener('click', e => {
            e.stopPropagation()
        })
    }

    /**
     * 
     * @param {Event} e 
     * @param {{className: string, content: string | {}, appendTo: HTMLElement | null}} data 
     */
    toggleMenu(e, data)
    {   
        this.menu = document.querySelector(".menu." + data.className)
        if(this.menu === null){
            this.showMenu(data, e.currentTarget)
        }else{
            this.hideMenu()
        }
    }

    /**
     * 
     * @param {{className: string, content: string}} data 
     */
    showMenu(data, btnClickedForMenu)
    {
        this.btnClickedForMenu = btnClickedForMenu
        this.menu = this.createElement('div', `menu ${data.className}`)
        document.body.appendChild(this.menu) 

        this.setMenuPositionByBtnClickedAndMenuWidth()
        this.innerElementContentHTML(this.menu, data.content)
        this.animateElementFromClassname(this.menu, 'active-menu')
    }
    

    hideMenu()
    {
        if(this.menu){
            this.menu.classList.remove('active-menu')
            this.menu.addEventListener('transitionend', ()=>{
                if(this.menu.parentElement){
                    this.menu.parentElement.removeChild(this.menu)
                }
            })
        }
    }

    hideMenuWhenBodyClick()
    {
        document.body.addEventListener('click', (e)=>{
            this.hideMenu()
        })
    }

    setMenuPositionByBtnClickedAndMenuWidth()
    {
        let buttonRect = this.btnClickedForMenu.getBoundingClientRect()
        let overflow
        const leftAndWidthSum = buttonRect.left + this.menu.offsetWidth
        if(window.innerWidth < leftAndWidthSum){
            overflow = leftAndWidthSum - window.innerWidth
            this.menu.style.left = buttonRect.left - overflow - 10 + "px"
        }else {
            this.menu.style.left = buttonRect.left - 10 + "px"
        }
        
        this.menu.style.top = buttonRect.top + this.btnClickedForMenu.offsetHeight + 'px'
        
    }

    createTooltipMenu(e, data)
    {
        this.toggleMenu(e, data)
    }

    removeElementFromDOM(element)
    {
        element?.parentElement.removeChild(element)
    }

    createErrorAlertAfterElement(elementId, errorMessage)
    {
        let smallElement = this.createElement('small', 'text-muted') 
        smallElement.innerHTML = errorMessage
        this.modal.querySelector(elementId).after(smallElement)
        this.modalHeightToAdd = smallElement.offsetHeight
        this.growModalHeigth()
    }

    static removeCircleLoader()
    {
        const circleLoader = document.querySelector('.circle_loader')
        if(circleLoader !== null){
            document.body.removeChild(circleLoader)
        }   
    }

    static resetCategoryNameMarginBottom()
    {
        const categoriesNames = document.querySelectorAll('.category_name')
        if(categoriesNames){
            categoriesNames.forEach(categoryName => {
                categoryName.style.marginBottom = "30px"
            })
        }
    }

    static resetOwlCarouselMarginBottom()
    {
        const owlCarousel = document.querySelector('.owl-carousel')
        if(owlCarousel){
            owlCarousel.style.marginBottom = "40px"
        }
    }

    handleModalSubmit()
    {
        e.preventDefault()

        this.createDataToPostObj()
    }

    /**
     * 
     * @param {"text" | "number" | "email" | "password"} type 
     * @param {{name: string, class?: string, id?: string}} attributes 
     * @return {HTMLInputElement}
     */
    createInput(type, attributes) 
    {
        /**
         * @type {HTMLInputElement}
         */
        const input = this.createElement('input', attributes.class)
        input.name = attributes.name
        input.id = attributes.id
        input.type = type

        return input
    }

    /**
     * @param {string} inputId
     */
    createLabel(inputId, title)
    {
        /**
         * @type {HTMLLabelElement}
         */
        const label = this.createElement('label')
        label.setAttribute('for', inputId)
        label.innerText = title

        return label
    }

    /**
     * 
     * @param {HTMLElement} element L'élément à ajouter
     * @param {"after" | "before" | "child"} appendType Le type d'ajout
     * @param {HTMLElement} reference L'élément de référence qui sera devant ou derrière ou parent de
     * l'élément à ajouter
     */
    appendElement(element, appendType, reference)
    {
        if(element && reference){
            switch(appendType) {
                case "before":
                    reference.before(element)
                    break
                case "after":
                    reference.after(element)
                    break
                case "child":
                    reference.appendChild(element)
                    break
                default:
                    console.error(appendType + " n'existe pas.")
                    break
            }
        }else {
            throw new Error("L'un des paramètres 'element' et 'reference' est null.")
        }
    }
}