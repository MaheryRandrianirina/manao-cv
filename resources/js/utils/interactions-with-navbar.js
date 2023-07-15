import axios from "axios";
import DOMInteractions from "../modules/DOMInteractions";

const domInteractions = new DOMInteractions();

export default function InteractionsWithNavbar(){
    LogoutButtonInteraction();
    EditPasswordInteraction();
}

function LogoutButtonInteraction(){
    const logoutButton = document.querySelector('.btn.logout-btn');

    if(logoutButton){
        logoutButton.addEventListener('click', handleLogout);

        function handleLogout(e){
            e.preventDefault();

            if(document.querySelector('.logout-modal') === null){
                domInteractions.createModal('logout-modal shadow bg-white p-3 position-absolute start-0 end-0 m-auto', `
                    <form action="/logout" method="post">
                        <p class='text-center'>Vous êtes sûr de vouloir vous déconnecter ?</p>
                        <div class='buttons position-absolute end-0'>
                            <a class='btn btn-secondary no'>Annuler</a>
                            <button class='btn btn-primary sure' type='submit'>Valider</button>
                        </div>
                    </form>
                `);
    ;
                domInteractions.setFormAction("/logout")
                domInteractions.setShowNotification(false);
                domInteractions.handleActionsInModalConfirmation();
            }
            
        }
    }
}

function EditPasswordInteraction(){
    const editPasswordMenu = document.querySelector('.edit-password');
    if(editPasswordMenu){
        editPasswordMenu.addEventListener('click', handleEditPassword);
        
        function handleEditPassword(e){
            e.preventDefault();
            if(document.querySelector('.edit-password-modal') === null){
                domInteractions.createModal('edit-password-modal shadow bg-white p-3 position-absolute top-0 bottom-0 start-0 end-0 m-auto',
                    `<form action="" method="post">
                        <div class='mb-3'>
                            <input type='password' id='current_password' placeholder='Mot de passe actuel' name='current_password' class='form-control' required />
                        </div>
                        <div class='mb-3'>
                            <input type='password' id='password' placeholder='Nouveau mot de passe' name='password' class='form-control' required />
                        </div>
                        <div class='mb-3'>
                            <input type='password' id='password_confirmation' placeholder='Confirmer le nouveau mot de passe' name='password_confirmation' class='form-control' required />
                        </div>
                        <div class='buttons position-absolute end-0'>
                            <a class='btn btn-secondary no'>Annuler</a>
                            <button class='btn btn-primary sure' type='submit'>Valider</button>
                        </div>
                    </form>  
                `);
    
                domInteractions.setFormAction('/password/edit');
                domInteractions.setCurrentClickedBtn(e.target);
                domInteractions.autofocusToInput(1);
                domInteractions.setNotificationContent("Votre mot de passe a été mis à jour avec succès !");
                domInteractions.handleActionsInModalConfirmation();
            }
        }
    }
}