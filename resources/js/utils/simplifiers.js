
/**
 * 
 * @param {HTMLElement} element 
 * @param {string} className 
 */
function hasClass(element, className){
    return element.classList.contains(className)
}

/**
 * 
 * @param {HTMLElement} element 
 */
function getClassFrom(element) {
    return Array.from(element.classList).join(' ');

}

/**
 * 
 * @param {string} text 
 * @param {"phone_number"} type
 */
function formatString(text, type){
    if(type === "phone_number"){
        return text.slice(0, 3) + " " 
            + text.slice(3, 5) + " "
            + text.slice(5, 8) + " "
            + text.slice(8, 10);
        
    }else {
        throw new Error("Le type de formatage " + type + " n'existe pas.");
    }
}

export {hasClass, getClassFrom, formatString}