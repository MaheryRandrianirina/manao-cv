import { isNull } from "lodash";
import DOMInteractions from "../modules/DOMInteractions";
import { hasClass } from "./simplifiers";

export default function InteractionsWithCVModels(){
    const CVModels = document.querySelectorAll('.cv-models .cv');

    if(CVModels){
        CVModels.forEach(model => {
            model.addEventListener("mouseenter", handleModelHover);
            model.addEventListener("mouseover", handleModelHover);
        })

        function handleModelHover(e){
            e.stopPropagation()

            /**
             * @type {HTMLDivElement}
             */
            const model = e.currentTarget
            const modelRect = model.getBoundingClientRect();
            const dom = new DOMInteractions();
            const modelHoverStyle = document.querySelector('.model-hover-style')

            if(isNull(modelHoverStyle)){
                const modelHoverStyle = dom.createElement('div', 'position-absolute model-hover-style');
                const modelHoverStyleParagraph = dom.createElement('p')
                modelHoverStyleParagraph.innerText = "Remplir"
                modelHoverStyle.appendChild(modelHoverStyleParagraph)

                if(model.classList.contains('cv-1') || model.classList.contains('cv-3')){
                    modelHoverStyle.style.left = 0;
                }else if(model.classList.contains('cv-2') || model.classList.contains('cv-4')){
                    modelHoverStyle.style.right = 0;
                }

                if(model.parentElement.classList.contains('row-one')){
                    modelHoverStyle.style.top = 0;
                }else if(model.parentElement.classList.contains('row-two')){
                    modelHoverStyle.style.top = 469 + 9 + "px";
                }

                modelHoverStyle.style.width = modelRect.width  + "px";
                modelHoverStyle.style.height = modelRect.height  + "px";

                const cmModelsContainer = document.querySelector('.cv-models-container');
                cmModelsContainer.appendChild(modelHoverStyle);
                modelHoverStyle.offsetWidth;
                modelHoverStyle.classList.add('active')

                modelHoverStyle.addEventListener('mouseleave', handleModelMouseLeave)
                modelHoverStyle.addEventListener('click', (e)=>{
                    e.preventDefault();

                    handleModelClick(model)
                })
            }
        }

        function handleModelMouseLeave(e){
            e.stopPropagation();
            
            const modelHoverStyle = document.querySelector('.model-hover-style');
            if(modelHoverStyle){
                modelHoverStyle.parentElement.removeChild(modelHoverStyle);
            }
            
            e.target.addEventListener('mouseenter', handleModelHover);
        }

        /**
         * 
         * @param {HTMLDivElement} model 
         */
        function handleModelClick(model){
            document.location.href = model.getAttribute('aria-link');
        }
    }
}