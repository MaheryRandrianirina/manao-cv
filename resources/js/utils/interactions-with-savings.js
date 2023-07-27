export default function InteractionsWithSavings(){
    const barsChevron = document.querySelectorAll('.bar .chevron');
    if(barsChevron.length > 0){
        barsChevron.forEach(barChevron => {
            barChevron.addEventListener('click', handleBarChevronClick);
        })
    }

    function handleBarChevronClick(e){
        e.preventDefault();
        
        const chevron = e.currentTarget;
        toggleCvListBy(chevron)
    }

    /**
     * 
     * @param {SVGElement} chevron 
     */
    function toggleCvListBy(chevron) {
        toggleElementClass(chevron, "active");

        const cvsElement = chevron.parentElement.nextElementSibling;
        if(!cvsElement.classList.contains('active')){
            cvsElement.classList.add('active');

            setTimeout(()=>{
                let countLinks = 1;

                const links = Array.from(cvsElement.querySelectorAll('a'));
                links.forEach(link => {
                    if(countLinks < 11){
                        countLinks++;

                        link.classList.add('block');
                    }
                })

                const watchMore = cvsElement.querySelector('.btn.btn-primary');

                if(countLinks > 10){
                    watchMore.style.opacity = 1;
                    watchMore.addEventListener('click', (e)=>{
                        e.preventDefault();

                        if(countLinks === 11){
                            const watchLess = document.createElement('button');
                            watchLess.className = "btn btn-secondary mt-3 ms-2";
                            watchLess.innerText = "Voir moins";

                            watchMore.after(watchLess);

                        watchLess.addEventListener('click', e => {
                            e.preventDefault();
    
                            let less = countLinks - 10;
                            const reversedLinks = links.reverse();
                            reversedLinks.forEach(link => {
                                if(link.classList.contains('block') && countLinks > less){
                                    countLinks--;
                                    link.classList.remove('block');
                                }
                            })
                            console.log(countLinks, links.length)
                            if(countLinks <= 11){
                                watchLess.parentElement.removeChild(watchLess)
                            }else if(countLinks >= links.length - 10){
                                watchMore.style.display = "inline-block";
                                watchMore.style.opacity = 1;
                            }
                        })
                    }

                        let more = countLinks + 10;
                        
                        links.forEach(link => {
                            if(!link.classList.contains("block") && countLinks < more){
                                countLinks++;
                                link.classList.add('block');
                            }
                        })

                        if(countLinks === links.length + 1){
                            watchMore.style.opacity = 0;
                            watchMore.style.display = "none";
                        }
                    })
                }else{
                    watchMore.style.display = "none";
                }
                
            }, 300)
        }else {
            cvsElement.classList.remove('active');
            
            const watchMore = cvsElement.querySelector('.btn.btn-primary');
            if(watchMore){
                watchMore.style.opacity = 0;
            }

            setTimeout(()=>{
                const links = cvsElement.querySelectorAll('a');
                links.forEach(link => {
                    link.classList.remove('block');
                })
            }, 300)
        }
    }

    function toggleElementClass(element, className){
        if(!element.classList.contains(className)){
            element.classList.add(className)
        }else {
            element.classList.remove(className);
        }
    }

    const searchButton = document.querySelector('.search-button');
    if(searchButton){
        searchButton.addEventListener('click', e => {
            e.preventDefault();

            searchForCvByInput(e.currentTarget.previousElementSibling);
        })
    }

    function searchForCvByInput(input){
        if(input){
            let links = document.querySelectorAll('.cvs-list a');
            links.forEach(link => {
                if(link.innerHTML.toLowerCase().includes(input.value.toLowerCase())){
                    console.log(link)
                    showLink(link);
                }
            });
        }
    }

    function showLink(link) {
        const bar = link.parentElement.previousElementSibling;

        const chevron = bar.querySelector('.chevron');
        if(!chevron.classList.contains('active')){
            chevron.classList.add('active');
        }

        const cvsElement = chevron.parentElement.nextElementSibling;
        if(!cvsElement.classList.contains('active')){
            cvsElement.classList.add('active');
        }
        
        link.classList.add('block');
    }
}