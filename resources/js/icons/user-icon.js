import innerUserIcon from "./inner-user-icon";

export default function UserIcon(){
    return  `<svg id="input" aria-type="file" aria-name="profile_photo" class="profile-photo user bg-secondary d-block mt-0 mb-0 ms-auto me-auto" style="width: 150px; height:150px; border-radius: 50%" viewBox="0 0 448 512">
        ${innerUserIcon()}
    </svg>`;
}