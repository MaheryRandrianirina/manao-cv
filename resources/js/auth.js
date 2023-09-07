function ScrollIfErrors(){
    const errors = document.querySelector('.bg-danger');
    if(errors){
        window.scroll({
            top: window.outerHeight,
            behavior: "smooth"
        })
    }
}

export { ScrollIfErrors }