export default function Responsive () {
    handleResponsive();
    
    window.addEventListener('resize', (e)=>{
        handleResponsive();
    })

    function handleResponsive(){
        const emailAdress = document.querySelector('.email-adress p');
        const windowWidth = window.innerWidth;
        if(emailAdress){
            if(windowWidth <= 360){
                let innerText = '';
                const arrayInnerText = emailAdress.innerHTML.split('');
                arrayInnerText.forEach(char => {
                    
                    if(char === "@"){
                        innerText += "\n";
                    }
                    innerText += char
                });

                emailAdress.innerHTML = innerText;
            }
        }
    }
}