
/**
 * 
 * @param {HTMLElement} element 
 * @param {string} className 
 */
function hasClass(element, className){
    return element.classList.contains(className)
}

export {hasClass}