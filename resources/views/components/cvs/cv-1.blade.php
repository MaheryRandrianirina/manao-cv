<?php use App\Helpers\NumberFormatter; ?>

<div class="cv cv-1 d-flex col" aria-link="/cv/1">
    @csrf
    <div class="left bg-indigo p-4 text-white">
        <div class="about mb-5">
            @if(isset($cv) && $image !== null)
            <img id="input" aria-type="file" aria-name="profile_photo" 
                class="profile-photo user bg-secondary d-block mt-0 mb-0 ms-auto me-auto" 
                src="{{ $image }}" alt="photo de profile">
            @else
            <svg id="input" aria-type="file" aria-name="profile_photo" class="profile-photo user bg-secondary d-block mt-0 mb-0 ms-auto me-auto" viewBox="0 0 448 512">
                <path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h452c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/>
            </svg>
            @endif
            <h2 id="input" aria-name="firstname" class="firstname mt-2">{{ isset($cv) ? $cv->firstname : "Prénom" }}</h2>
            <h2 id="input" aria-name="name" class="name">{{ isset($cv) ? $cv->name : "NOM" }}</h2>
            <p id="input" aria-name="work" class="work">{{ isset($cv) ? $cv->current_work : "Poste occupé" }}</p>
        </div>
        <div class="contact mb-5">
            <h3 class='mb-3'>CONTACT</h3>
            <div class="contact-list list">
                <div class="phone-number d-flex justify-content-start mb-2">
                    <svg class="icon phone-icon" viewBox="0 0 512 512">
                        <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                    </svg>
                    <p id="input" aria-type='number' aria-name="phone_number" class="mb-0 ms-3">{{ isset($cv) ? NumberFormatter::phone("0" . $cv->contact->phone_number) : "Téléphone" }}</p>
                </div>
                <div class="adress d-flex justify-content-start mb-2">
                    <svg class="icon adress-icon" viewBox="0 0 384 512">
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                    </svg>
                    <p id="input" aria-name="adress" class="mb-0 ms-3">{{ isset($cv) ? $cv->contact->adress : "Adresse" }}</p>
                </div>
                <div class="email-adress d-flex justify-content-start mb-2">
                    <svg class="icon email-icon" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/>
                    </svg>
                    <p id="input" aria-type="email" aria-name="email" class="mb-0 ms-3">{{ isset($cv) ? $cv->contact->email : "Email" }}</p>
                </div>
                <div class="linkedin-url d-flex justify-content-start">
                    
                    @if(isset($cv))
                        @if(($cv->contact->linkedin_url !== null))
                        <svg class="icon linkedin-icon" viewBox="0 0 448 512">
                            <path d="M416 32h41.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                        </svg>
                        <p id="input" aria-name="linkedin_url" class="mb-0 ms-3">{{ $cv->contact->linkedin_url }}</p>
                        @endif
                    
                    @else
                    <svg class="icon linkedin-icon" viewBox="0 0 448 512">
                        <path d="M416 32h41.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                    </svg>
                    <p id="input" aria-name="linkedin_url" class="mb-0 ms-3">Url linkedin</p>
                    @endif
                </div>
            </div>
        </div>
        <div class="formation mb-5">
            <h3 class='mb-3'>FORMATION</h3>
            <div class="formation-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0;?>
                    @foreach($cv->formations as $formation)
                    <?php $i++;?>
                    <div class="formation-{{$stringNumber[$i]}}"> 
                       <div class="degree">
                            <h4 id="input" aria-name="degree_{{$stringNumber[$i]}}">{{ $formation->degree }}</h4>
                            <p id="input" aria-name="etablissement_{{$stringNumber[$i]}}" class="college">{{ $formation->etablissement }}</p>
                            <p class="date" aria-input-number="2">
                                <span aria-name="year_debut_formation_{{$stringNumber[$i]}}" id="input" aria-type="date">{{ $formation->getDateDebut() }}</span> 
                                <span data-value="{{ $formation->format("Y-m-d") }}" hidden></span>
                                <span id="separator">-</span> 
                                <span aria-name="year_end_formation_{{$stringNumber[$i]}}" id="input" aria-type="date">{{ $formation->getDateEnd() }}</span>
                                <span data-value="{{ $formation->format("Y-m-d", false) }}" hidden></span>
                            </p>
                        </div>
                    </div>
                    @endforeach
                @else
                <div class="formation-one">
                    <div class="degree">
                        <h4 id="input" aria-name="degree_one">DIPLOME XXXXXXXXX</h4>
                        <p id="input" aria-name="etablissement_one" class="college">Université ou école</p>
                        <p class="date" aria-input-number="2">
                            <span aria-name="year_debut_formation_one" id="input" aria-type="date">20XX</span> 
                            <span id="separator">-</span> 
                            <span aria-name="year_end_formation_one" id="input" aria-type="date">20XX</span>
                        </p>
                    </div>
                </div>
                <div class="formation-two">
                    <div class="degree">
                        <h4 id="input" aria-name="degree_two">DIPLOME XXXXXXXXX</h4>
                        <p id="input" aria-name="etablissement_two" class="college">Université ou école</p>
                        <p class="date" aria-input-number="2">
                            <span aria-name="year_debut_formation_two" id="input" aria-type="date">20XX</span> 
                            <span id="separator">-</span> 
                            <span aria-name="year_end_formation_two" id="input" aria-type="date">20XX</span>
                        </p>
                    </div>
                </div>
                @endif
            </div>

        </div>
        <div class="languages mb-5">
            <h3 class='mb-3'>LANGUES</h3>
            <div class="languages-list list customizable-list">
                @if(isset($cv))
                <?php $i = 0; ?>
                @foreach($cv->languages as $language)
                    <?php $i++;?>
                    <div class="language-{{ $stringNumber[$i] }} d-flex justify-content-start mb-2">
                        <svg class='icon check-icon' viewBox="0 0 512 512">
                            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                        </svg>
                        <p class="language-with-level mb-0 ms-3" aria-input-number="2">
                            <span id="input" aria-name="language_{{ $stringNumber[$i] }}">{{ $language->name }}</span> 
                            <span id="separator">:</span> 
                            <span id="select" aria-options="Bilingue, Avancé, Intermédiaire, Débutant" aria-name="language_level_{{ $stringNumber[$i] }}">{{ $language->string_level }}</span>
                        </p>
                    </div>
                @endforeach
                @else
                <div class="language-one d-flex justify-content-start mb-2">
                    <svg class='icon check-icon' viewBox="0 0 512 512">
                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                    <p class="language-with-level mb-0 ms-3" aria-input-number="2">
                        <span id="input" aria-name="language_one">Français</span> <span id="separator">:</span> <span id="select" aria-options="Bilingue, Avancé, Intermédiaire, Débutant" aria-name="language_level_one">Bilingue</span>
                    </p>
                </div>
                <div class="language-two d-flex justify-content-start">
                    <svg class='icon check-icon' viewBox="0 0 512 512">
                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                    <p class="language-with-level mb-0 ms-3" aria-input-number="2">
                        <span id="input" aria-name="language_two">Anglais</span> <span id="separator">:</span> <span id="select" aria-options="Bilingue, Avancé, Intermédiaire, Débutant" aria-name="language_level_two">Courant</span>
                    </p>
                </div>
                @endif
            </div>
        </div>
    </div>
    <div class="right bg-white p-5">
        <div class="profil mt-3 mb-5">
            <h3 class='mb-3'>PROFIL</h3>
            <p id="textarea" aria-name="profile_description">{{ isset($cv) ? $cv->profile : "Lorem ipsum dolor sit, amet consectetur adipisicing elit." }}</p>
        </div>
        <div class="experiences mb-5">
            <h3 class='mb-3'>EXPERIENCE PROFESSIONNELLE</h3>
            <div class="experiences-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0;?>
                    @foreach($cv->experiences as $experience)
                        <?php $i++;?>
                        <div class="experience experience-{{ $stringNumber[$i] }}">
                            <h4 class="company-name" aria-input-number="2">
                                <span id="input" aria-name="company_name_{{ $stringNumber[$i] }}">{{ $experience->entreprise_name }}</span> 
                                <span id="separator">|</span> 
                                <span id="input" aria-name="company_work_{{ $stringNumber[$i] }}">{{ $experience->work }}</span>
                            </h4>
                            <p class="date" aria-input-number="2">
                                <span id="input" aria-type="date" aria-name="year_debut_experience_{{ $stringNumber[$i] }}">{{ $experience->getDateDebut() }}</span> 
                                <span data-value="{{ $experience->format("Y-m-d") }}" hidden></span>
                                <span id="separator">-</span> 
                                <span id="input" aria-type="date" aria-name="year_end_experience_{{ $stringNumber[$i] }}">{{ $experience->getDateEnd() }}</span>
                                <span data-value="{{ $experience->format("Y-m-d", false) }}" hidden></span>
                            </p>
                            <div class="task">
                                <p>
                                    <span class="task-label">Tâches réalisées : </span>
                                    <span id="textarea" aria-name="experience_{{ $stringNumber[$i] }}_task_one">{{ $experience->task }}</span> 
                                </p>
                            </div>
                        </div>
                    @endforeach
                @else
                <div class="experience experience-one">
                    <h4 class="company-name" aria-input-number="2">
                        <span id="input" aria-name="company_name_one">NOM DE L'ENTREPRISE</span> <span id="separator">|</span> <span id="input" aria-name="company_work_one">Poste occupé</span>
                    </h4>
                    <p class="date" aria-input-number="2">
                        <span id="input" aria-type="date" aria-name="year_debut_experience_one">Sept. 20XX</span> 
                        <span id="separator">-</span> 
                        <span id="input" aria-type="date" aria-name="year_end_experience_one">Juil. 20XX</span>
                    </p>
                    <div class="task">
                        <p>
                            <span >Tâches réalisées : </span>
                            <span id="textarea" aria-name="experience_one_task_one">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</span> 
                        </p>
                    </div>
                </div>
                <div class="experience experience-two">
                    <h4 class="company-name" aria-input-number="2">
                        <span id="input" aria-name="company_name_two">NOM DE L'ENTREPRISE</span> <span id="separator">|</span> <span id="input" aria-name="company_work_two">Poste occupé</span>
                    </h4>
                    <p class="date" aria-input-number="2">
                        <span id="input" aria-type="date" aria-name="year_debut_experience_two">Sept. 20XX</span> 
                        <span id="separator">-</span> 
                        <span id="input" aria-type="date" aria-name="year_end_experience_two">Juil. 20XX</span>
                    </p>
                    <div class="task">
                        <p>
                            <span class="task-label">Tâches réalisées : </span>
                            <span id="textarea" aria-name="experience_two_task_one">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</span> 
                        </p>
                    </div>
                </div>
                @endif
            </div>
        </div>
        <div class="skills">
            <h3 class='mb-3'>COMPETENCES</h3>
            <div class="skills-list d-flex justify-content-between">
                <?php $i = 0; ?>
                <div class="skills-list-left list customizable-list">
                    @if(isset($cv))
                    @foreach($cv->skills as $skill)
                        @if($i < 3)
                        <?php $i++;?>
                        <div class="skill skill-{{ $stringNumber[$i] }}">
                            <p id="input" aria-name="skill_{{ $stringNumber[$i] }}" class="name mb-0">{{ $skill->name }}</p>
                            @if($skill->level)
                            <p id="skill_level" class="level bg-gray bar-level" aria-level="{{ $skill->level }}"></p>
                            @endif
                        </div>
                        @endif
                    @endforeach
                    @else
                    <div class="skill skill-one">
                        <p id="input" aria-name="skill_one" class="name mb-0">Pack Office</p>
                        <p id="skill_level" aria-level="0" class="level bg-gray bar-level"></p>
                    </div>
                    <div class="skill skill-two">
                        <p id="input" aria-name="skill_two" class="name mb-0">Photoshop</p>
                        <p id="skill_level" aria-level="0" class="level bg-gray bar-level"></p>
                    </div>
                    <div class="skill skill-three">
                        <p id="input" aria-name="skill_three" class="name mb-0">Compétence</p>
                        <p id="skill_level" aria-level="0" class="level bg-gray bar-level"></p>
                    </div>
                    @endif
                </div>
                <div class="skills-list-right list customizable-list">
                    @if(isset($cv))
                        @foreach($cv->skills as $skill)
                        @if($i >= 3)
                        <?php $i++;?>
                            <div class="skill skill-{{ $stringNumber[$i] }}">
                                <p id="input" aria-name="skill_four" class="name mb-0">{{ $skill->name }}</p>
                                @if($skill->level)
                                <p id="skill_level" class="level bg-gray bar-level" aria-level="{{ $skill->level }}"></p>
                                @endif
                            </div>
                        
                        @endif
                        @endforeach
                    @endif
                    
                </div>
            </div>
        </div>
    </div>
</div>