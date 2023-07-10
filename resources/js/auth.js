function ScrollIfErrors(){
    const errors = document.querySelector('.bg-danger');
    console.log("errors : ", errors)
    if(errors){
        window.scroll({
            top: window.outerHeight,
            behavior: "smooth"
        })
    }
}

export { ScrollIfErrors }