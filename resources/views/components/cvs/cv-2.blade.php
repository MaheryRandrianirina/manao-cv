<?php use App\Helpers\NumberFormatter; ?>
<div class="cv cv-2 d-flex col ms-4" aria-link="/cv/2">
    @csrf
    <div class="left bg-white text-white border-end">
        <div class="about bg-success p-4 mb-3 text-center">
            @if(isset($cv) && $image !== null)
            <img id="input" aria-type="file" aria-name="profile_photo" class="profile-photo user bg-secondary d-block mt-0 mb-0 ms-auto me-auto" src="{{ $image }}" alt="photo de profile">
            @else
            <svg id="input" aria-type="file" aria-name="profile_photo" class="profile-photo user bg-secondary d-block mt-0 mb-0 ms-auto me-auto" style="width: 150px; height:150px; border-radius: 50%" viewBox="0 0 448 512">
                <path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h452c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/>
            </svg>
            @endif
            <h2 id="input" aria-name="firstname" class="firstname mt-2">{{ isset($cv) ? $cv->firstname : "PRENOM" }}</h1>
            <h2 id="input" aria-name="name" class="name">{{ isset($cv) ? $cv->name : "NOM" }}</h1>
            <p id="input" aria-name="work" class="work text-uppercase fw-lighter">{{ isset($cv) ? $cv->current_work : "Poste occupé" }}</p>
        </div>
        <div class="contact p-4 mb-3 text-black border-top">
            <h3 class="mb-3">CONTACT</h3>
            <div class="contact-list">
                <div class="adress d-flex justify-content-start mb-2">
                    <svg class="icon adress-icon" viewBox="0 0 384 512">
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                    </svg>
                    <p id="input" aria-name="adress" class="mb-0 ms-3">{{ isset($cv) ? $cv->contact->adress : "Adresse" }}</p>
                </div>
                <div class="email-adress d-flex justify-content-start mb-2">
                    <svg class="icon email-icon" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/>
                    </svg>
                    <p id="input" aria-type="email"aria-name="email" class="mb-0 ms-3">{{ isset($cv) ? $cv->contact->email : "Email" }}</p>
                </div>
                <div class="phone-number d-flex justify-content-start">
                    <svg class="icon phone-icon" viewBox="0 0 512 512">
                        <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                    </svg>
                    <p id="input" aria-type="number" aria-name="phone_number" class="mb-0 ms-3">{{ isset($cv) ? NumberFormatter::phone("0" . $cv->contact->phone_number) : "Téléphone" }}</p>
                </div>
            </div>
        </div>
        <div class="hobbies p-4 mb-3 text-black">
            <h3 class='mb-3'>INTERETS</h3>
            <div class="hobbies-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0;?>
                    @foreach($cv->hobbies as $hobby)
                    <?php $i++;?>
                    <div class="hobby-{{ $stringNumber[$i] }} d-flex justify-content-start mb-2">
                        <svg class='icon check-icon' viewBox="0 0 512 512">
                            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                        </svg>
                        <p id="input" aria-name="hobby_{{ $stringNumber[$i] }}" class="hobby mb-0 ms-3">{{ $hobby->name }}</p>
                    </div>
                    @endforeach
                @else
                <div class="hobby-one d-flex justify-content-start mb-2">
                    <svg class='icon check-icon' viewBox="0 0 512 512">
                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                    <p id="input" aria-name="hobby_one" class="hobby mb-0 ms-3">Intérêt : XXX</p>
                </div>
                <div class="hobby-two d-flex justify-content-start">
                    <svg class='icon check-icon' viewBox="0 0 512 512">
                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                    <p id="input" aria-name="hobby_two" class="hobby mb-0 ms-3">Intérêt : XXX</p>
                </div>
                @endif
            </div>
        </div>
        <div class="languages p-4 mb-3 text-black">
            <h3 class='mb-3'>LANGUES</h3>
            <div class="languages-list list customizable-list">
                @if(isset($cv))
                <?php $i = 0; ?>
                    @foreach($cv->languages as $language)
                    <?php $i++;?>
                    <div class="language language-{{ $stringNumber[$i] }}">
                        <p id="input" aria-name="language_{{ $stringNumber[$i] }}" class="language-with-level mb-0 ms-0 d-inline-block" style="width: 50%">{{ $language->name }}</p>
                        <p id="language_level" aria-level="{{ $language->level }}" class="level bar-level bg-gray d-inline-block mb-0" style="width: 47%"></p>
                    </div>
                    @endforeach
                @else
                    <div class="language language-one">
                        <p id="input" aria-name="language_one" class="language-with-level mb-0 ms-0 d-inline-block" style="width: 50%">Français</p>
                        <p id="language_level" class="level bar-level bg-gray d-inline-block mb-0" style="width: 47%"></p>
                    </div>
                    <div class="language language-two">
                        <p id="input" aria-name="language_two" class="language-with-level mb-0 ms-0 d-inline-block" style="width: 50%">Anglais</p>
                        <p id="language_level" class="level bar-level bg-gray d-inline-block mb-0" style="width:40%"></p>
                    </div>
                    <div class="language language-three">
                        <p id="input" aria-name="language_three" class="language-with-level mb-0 ms-0 d-inline-block" style="width: 50%">Allemand</p>
                        <p id="language_level" class="level bar-level bg-gray d-inline-block mb-0" style="width:30%"></p>
                    </div>
                @endif
            </div>
        </div>
        <div class="skills p-4 text-black">
            <h3 class='mb-3'>COMPETENCES</h3>
            <div class="skills-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0; ?>

                    @foreach($cv->skills as $skill)
                    <?php $i++; ?>
                    <div class="skill skill-{{ $stringNumber[$i] }}">
                        <p id="input" aria-name="skill_{{ $stringNumber[$i] }}" class="skill-with-level d-inline-block">{{ $skill->name }}</p>
                        @if($skill->level)
                        <p id="skill_level" class="level bg-gray bar-level bar-level-unique" aria-level="{{ $skill->level }}"></p>
                        @endif
                    </div>
                    @endforeach
                @else
                <div class="skill skill-one">
                    <p id="input" aria-name="skill_one" class="skill-with-level d-inline-block" style="width: 55%">Pack Office</p>
                    <p id="skill_level" class="level bar-level bar-level-unique bg-gray d-inline-block mb-0" style="width: 42%"></p>
                </div>
                <div class="skill skill-two">
                    <p id="input" aria-name="skill_two" class="skill-with-level d-inline-block" style="width: 55%">Photoshop</p>
                    <p id="skill_level" class="level bar-level bar-level-unique bg-gray d-inline-block mb-0" style="width: 42%"></p>
                </div>
                <div class="skill skill-three">
                    <p id="input" aria-name="skill_three" class="skill-with-level d-inline-block" style="width: 55%">Compétence</p>
                    <p id="skill_level" class="level bar-level bar-level-unique bg-gray d-inline-block mb-0" style="width: 30%"></p>
                </div>
                <div class="skill skill-four">
                    <p id="input" aria-name="skill_four" class="skill-with-level d-inline-block" style="width: 55%">Compétence</p>
                    <p id="skill_level" class="level bar-level bar-level-unique bg-gray d-inline-block mb-0" style="width: 25%"></p>
                </div>
                @endif
            </div>
        </div>
    </div>
    <div class="right bg-white p-5">
        <div class="formation mt-3 mb-5">
            <h3 class='mb-3'>
                <svg class="icon heart-icon" viewBox="0 0 512 512">
                    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/>
                </svg>FORMATION
            </h3>
            <div class="formation-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0;?>

                    @foreach($cv->formations as $formation)
                    <?php $i++;?>
                    <div class="formation-{{ $stringNumber[$i] }}">
                        <div class="graduation">
                            <h4 id="input" aria-name="graduation_{{$stringNumber[$i]}}">{{ $formation->graduation }}</h4>
                            <p id="input" aria-name="etablissement_{{$stringNumber[$i]}}" class="college">{{ $formation->etablissement }}</p>
                            <p class="date" aria-input-number="2">
                                <?php $splitted_date = mb_split(" - ",$formation->date); ?>
                                <span aria-name="year_debut_{{$stringNumber[$i]}}" id="input" aria-type="number">{{ $splitted_date[0] }}</span> <span id="separator">-</span> <span aria-name="year_end_{{$stringNumber[$i]}}" id="input" aria-type="number">{{ $splitted_date[1] }}</span>
                            </p>
                        </div>
                    </div>
                    @endforeach
                @else
                <div class="formation-one">
                    <div class="graduation">
                        <h4 id="input" aria-name="graduation_one">DIPLOME XXXXXXXXX</h4>
                        <p id="input" aria-name="etablissement_one" class="college">Université ou école</p>
                        <p class="date" aria-input-number="2">
                            <span aria-name="year_debut_one" id="input" aria-type="number">20XX</span> <span id="separator">-</span> <span aria-name="year_end_one" id="input" aria-type="number">20XX</span>
                        </p>
                    </div>
                </div>
                <div class="formation-two">
                    <div class="graduation">
                        <h4 id="input" aria-name="graduation_two">DIPLOME XXXXXXXXX</h4>
                        <p id="input" aria-name="etablissement_two" class="college">Université ou école</p>
                        <p class="date" aria-input-number="2">
                            <span aria-name="year_debut_one" id="input" aria-type="number">20XX</span> <span id="separator">-</span> <span aria-name="year_end_one" id="input" aria-type="number">20XX</span>
                        </p>
                    </div>
                </div>
                @endif
            </div>
        </div>
        <div class="experiences mb-5">
            <h3 class='mb-3'>EXPERIENCES</h3>
            <div class="experiences-list list customizable-list">
                @if(isset($cv))
                    <?php $i = 0;?>
                    @foreach($cv->experiences as $experience)
                        <?php $i++;?>
                        <p class="date" aria-input-number="2">
                            <?php $splitted_date = mb_split(" - ",$experience->date); ?>
                            <span id="input" aria-name="year_month_debut_{{ $stringNumber[$i] }}">{{ $splitted_date[0] }}</span> <span id="separator">-</span> <span id="input" aria-name="year_month_end_{{ $stringNumber[$i] }}">{{ $splitted_date[1] }}</span>
                        </p>
                        <h4 id="input" aria-name="company_name_{{ $stringNumber[$i] }}" class="company-name">{{ $experience->entreprise_name }}</h4>
                        <p id="input" aria-name="company_work_{{ $stringNumber[$i] }}" class="work">{{ $experience->work }}</p>
                        <ul class="task list customizable-list">
                            <?php 
                                $splitted_task = mb_split("\n", $experience->task);
                                $task_i = 0;
                            ?>
                            
                            @foreach($splitted_task as $task)
                            <?php $task_i++;?>
                            <li id="textarea" aria-name="experience_{{$stringNumber[$i]}}_task_{{$stringNumber[$task_i]}}" class="task-{{$stringNumber[$task_i]}}">
                                {{ $task }}
                            </li> 
                            @endforeach                      
                        </ul>
                    @endforeach
                @else
                <div class="experience experience-one">
                    <p class="date" aria-input-number="2">
                        <span id="input" aria-name="year_month_debut_one">Sept. 20XX</span> <span id="separator">-</span> <span id="input" aria-name="year_month_end_one">Juil. 20XX</span>
                    </p>
                    <h4 id="input" aria-name="company_name_one" class="company-name">NOM DE L'ENTREPRISE</h4>
                    <p id="input" aria-name="company_work_one" class="work">Poste occupé</p>
                    <ul class="task list customizable-list">
                        <li id="textarea" aria-name="experience_one_task_one" class="task-one">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>
                        <li id="textarea" aria-name="experience_one_task_two" class="task-two">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>
                        <li id="textarea" aria-name="experience_one_task_three" class="task-three">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>                        
                    </ul>
                </div>
                <div class="experience experience-two">
                    <p class="date" aria-input-number="2">
                        <span id="input" aria-name="year_month_debut_two">Sept. 20XX</span> <span id="separator">-</span> <span id="input" aria-name="year_month_end_one">Juil. 20XX</span>
                    </p>
                    <h4 id="input" aria-name="company_name_two" class="company-name">NOM DE L'ENTREPRISE</h4>
                    <p id="input" aria-name="company_work_two" class="work">Poste occupé</p>
                    <ul class="task list customizable-list">
                        <li id="textarea" aria-name="experience_two_task_one" class="task-one">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>
                        <li id="textarea" aria-name="experience_two_task_two" class="task-two">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>
                        <li id="textarea" aria-name="experience_two_task_three" class="task-three">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </li>
                    </ul>
                </div>
                @endif
            </div>
        </div>
    </div>
</div>