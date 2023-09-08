import axios from "axios";

export default function InteractionsWithSavings(){

    const barsChevron = document.querySelectorAll('.bar .chevron');

    if(barsChevron.length > 0){
        barsChevron.forEach(barChevron => {
            barChevron.addEventListener('click', handleBarChevronClick);
        })
    }

    function handleBarChevronClick(e){
        e.preventDefault();
        
        toggleCvListBy(e.currentTarget)
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

    const inputSearch = document.querySelector('.search_input');
    if(inputSearch){
        inputSearch.addEventListener('keyup', e => {
            e.preventDefault();

            hideLinkByInput(e.currentTarget);
        })

        inputSearch.addEventListener('click', e => {
            const input = e.currentTarget;
            if(input.value.length > 0){
                setTimeout(() => {
                    hideLinkByInput(input);
                }, 100);
            }
        })
    }

    function searchForCvByInput(input){
        if(input){
            const inputValue = input.value;
            let foundLinks = 0;

            let links = document.querySelectorAll('.cvs-list a');
            links.forEach(link => {
                if(link.innerHTML
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                    && inputValue.length > 0
                ){
                    showLink(link);

                    hideWatchMoreButton(link.parentElement);

                    foundLinks++;
                }
            });

            if(foundLinks === 0){
                axios.post("/cv/search", {"degree": inputValue}).then(res => {
                    const cvs = res.data;
                    
                    cvs.forEach(cv => {
                        const cvLink = document.querySelector(`.cvs a.cv${cv.id}`);
                        console.log(cvLink)
                        if(cvLink){
                            showLink(cvLink);

                            hideWatchMoreButton(cvLink.parentElement);
                        }
                    })
                    
                    // AFFICHER LES LIENS QUI CORRESPONDANT AUX CVS RECUPERES
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    }

    function showLink(link){
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

    function hideLinkByInput(input){
        const inputValue = input.value;
        if(inputValue.length === 0){
            let links = document.querySelectorAll('.cvs-list a.block');
            links.forEach(link => {
                hideLink(link);
            });
        }
    }

    function hideLink(link) {
        const bar = link.parentElement.previousElementSibling;
        const chevron = bar.querySelector('.chevron');
        if(chevron.classList.contains('active')){
            chevron.classList.remove('active');
        }

        const cvsElement = chevron.parentElement.nextElementSibling;
        if(cvsElement.classList.contains('active')){
            cvsElement.classList.remove('active');
        }
        
        link.classList.remove('block');
    }

    function hideWatchMoreButton(cvsElement) {
        const watchMore = cvsElement.querySelector('.btn.btn-primary');
        if(watchMore){
            watchMore.style.display = "none";
        }
    }
}