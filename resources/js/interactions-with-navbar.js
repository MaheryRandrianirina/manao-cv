import DOMInteractions from "./modules/DOMInteractions";

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

            domInteractions.createModal('logout-modal shadow bg-white p-3 position-absolute top-0 start-0 end-0 m-auto', `
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

function EditPasswordInteraction(){
    const editPasswordMenu = document.querySelector('.edit-password');
    if(editPasswordMenu){
        editPasswordMenu.addEventListener('click', handleEditPassword);
        
        function handleEditPassword(e){
            e.preventDefault();

            domInteractions.createModal('edit-password-modal shadow bg-white p-3 position-absolute top-0 bottom-0 start-0 end-0 m-auto',
                `<form action="/logout" method="post">
                    <div class='form-group mb-3'>
                        <input type='password' placeholder='Ancien mot de passe' name='ancient-password' class='form-control mb-3'/>
                        <input type='password' placeholder='Nouveau mot de passe' name='new-password' class='form-control mb-3'/>
                        <input type='password' placeholder='Confirmer le nouveau mot de passe' name='password-confirm' class='form-control mb-3'/>
                    </div>
                    <div class='buttons position-absolute end-0'>
                        <a class='btn btn-secondary no'>Annuler</a>
                        <button class='btn btn-primary sure' type='submit'>Valider</button>
                    </div>
                </form>  
            `);

            domInteractions.setFormAction('/')
            domInteractions.handleActionsInModalConfirmation();
    }
        }
}