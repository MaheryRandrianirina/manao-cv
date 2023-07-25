<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\CV;
use App\Models\Experience;
use App\Models\Formation;
use App\Models\Hobby;
use App\Models\Language;
use App\Models\Skill;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class CvController extends Controller
{
    private $echo;
    /*
     * Règles de validation
    */
    private $rules = [
        "model" => ['string', "min:4", "required"],
        "profile_photo" => ["image"],
        "name" => ['string', 'min:3', 'required'],
        "firstname" => ['string', 'min:3', 'required'],
        "work" => ['string', 'min:3'],
        "phone_number" => ['string', 'min:10', 'max:10', 'required'],
        "adress" => ['string', 'min:2', 'required'],
        "email" => ['string', 'required', "email"],
        "sex" => ['string', 'required', "min:3", "max:5"]
    ];

    private $formations = 0;

    private $languages = 0;

    private $hobbies = 0;

    private $skills = 0;

    private $experiences = 0;

    private $stringNumber = [
        1 => "one",
        2 => "two",
        3 => "three",
        4 => "four",
        5 => "five",
        6 => "six",
        7 => "seven",
        8 => "eight",
        9 => "nine",
        10 => "ten"
    ];

    public function index(Request $request, int $id){
        $id = (int) $id;
        if(is_string($id)){
            throw new Exception("La variable id devrait être un nombre");
        }

        return view('cv.' . $id, [
            'title' => "CV " . $id, 
            'token' => csrf_token()
        ]);
    }

    public function save(Request $request, bool $echo = true) {
        $model = $request->model;
        $dataLength = count($request->request);
        $this->echo = $echo;

        foreach($request->request as $name => $value){
            if(strchr($name, "graduation")){
                $this->rules[$name] = ["string", "required"];

                $this->formations++;
            }else if(strchr($name, "etablissement")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "year_debut")){
                $this->rules[$name] = ["integer", "required"];
            }else if(strchr($name, "year_end")){
                $this->rules[$name] = ["integer", "required"];
            }else if(strchr($name, "language") && !strchr($name, "language_level")){
                $this->rules[$name] = ["string", "required"];
                $this->languages++;
            }else if(strchr($name, "language_level")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "company_name")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "company_work")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "year_month_debut")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "year_month_end")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "skill") && !strchr($name, "skill_level")){
                $this->rules[$name] = ["string", "required"];

                $this->skills++;
            }else if(strchr($name, "experience")){
                $this->rules[$name] = ["string", "required"];

                $this->experiences++;
            }else if(strchr($name, "skill_level")){
                $this->rules[$name] = ['string', "required"];
            }else if(strchr($name, "hobby")){
                $this->rules[$name] = ['string', "required"];

                $this->hobbies++;
            }
        }
        
        if($model === "cv-1"){
            $this->saveModelOne($request);
        }else if($model === "cv-2"){
            $this->saveModelTwo($request);
        }else if($model === "cv-3"){
            $this->saveModelThree($request);
        }else if($model === "cv-4"){
            $this->saveModelFour($request);
        }
    }

    private function saveModelOne(Request $request) {
        $this->rules["url_linkedin"] = ['url'];
        $this->rules["profile_description"] = ['string', 'min:10', 'required'];

        $request->validate($this->rules);
        $path = "";

        try {

            if($request->profile_photo){
                $path = Storage::disk("public")->put("profile_photo", $request->profile_photo);
            }

            $contact = $this->saveContact($request);
            
            $cv = $this->saveCV($request, $path, $contact->id);

            $this->saveExperiences($request, $cv->id);

            $this->saveFormations($request, $cv->id);

            $this->saveLanguages($request, $cv->id);

            $this->saveSkills($request, $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function saveContact(Request $request) {
        return Contact::create([
            "phone_number" => (int)$request->phone_number,
            "adress" => $request->adress,
            "email" => $request->email,
            "linkedin_url" => $request->url_linkedin ? $request->url_linkedin : null
        ]);
    }

    private function saveCV(Request $request, $path, int $contact_id) {
        return CV::create([
            "name" => $request->name,
            "firstname" => $request->firstname,
            "sex" => $request->sex,
            "current_work" => $request->work,
            "profile" => $request->profile_description,
            "image" => $path !== "" ? $path : null,
            "model" => $request->model,
            "is_recorded" => true,
            "contact_id" => $contact_id
        ]);
    }

    private function saveExperiences(Request $request, int $cv_id, bool $multitask = false) {
        for($i = 0; $i < $this->experiences; $i++){
            $company_name = "company_name_" . $this->stringNumber[$i+1];
            $work = "company_work_" . $this->stringNumber[$i+1];
            $year_month_debut = "year_month_debut_" . $this->stringNumber[$i+1];
            $year_month_end = "year_month_end_" . $this->stringNumber[$i+1];
            $task = "";
            $tasks = [];

            if($multitask){
                $countTasks = 0;
                foreach($request->request as $name => $value){
                    $countTasks++;
                    if(strchr($name, "experience_" . $this->stringNumber[$i+1])){
                        $taskVar = "experience_" . $this->stringNumber[$i+1] . "_task_" . $this->stringNumber[$countTasks];
                        array_push($tasks, $request->$taskVar) ;
                    }
                }
            }else {
                $task = "experience_" . $this->stringNumber[$i+1] . "_task_one";
            }
            
            
            Experience::create([
                "entreprise_name" => $request->$company_name,
                "work" => $request->$work,
                "date" => $request->$year_month_debut . " - " . $request->$year_month_end,
                "task" => $task ? $request->$task : join("\n", $tasks),
                "cv_id" => $cv_id
            ]);
        }
    }

    private function saveFormations(Request $request, int $cv_id) {
        for($i = 0; $i < $this->formations; $i++){
            $etablissement = "etablissement_" . $this->stringNumber[$i+1];
            $year_debut = "year_debut_" . $this->stringNumber[$i+1];
            $year_end = "year_end_" . $this->stringNumber[$i+1];
            $graduation = "graduation_" . $this->stringNumber[$i+1];
            
            Formation::create([
                "etablissement" => $request->$etablissement,
                "date" => $request->$year_debut . " - " . $request->$year_end,
                "graduation" => $request->$graduation,
                "cv_id" => $cv_id
            ]);
        }
    }

    private function saveLanguages(Request $request,int $cv_id, bool $levelString = true) {
        for($i = 0; $i < $this->languages; $i++){
            $name = "language_" . $this->stringNumber[$i+1];
            $level = "language_level_" . $this->stringNumber[$i+1];

            $arrayValues = [
                "name" => $request->$name,
                "cv_id" => $cv_id
            ];

            if($levelString){
                $arrayValues["level_string"] = $request->$level;
            }else {
                $arrayValues["level"] = (int) $request->$level;
            }

            Language::create($arrayValues);
        }
    }

    private function saveSkills(Request $request, int $cv_id) {
        for($i = 0; $i < $this->skills; $i++){
            $name = "skill_" . $this->stringNumber[$i+1];
            $level = "skill_level_" . $this->stringNumber[$i+1];

            Skill::create([
                "name" => $request->$name,
                "level" => $request->$level ? (int) $request->$level : null,
                "cv_id" => $cv_id
            ]);
        }
    }

    private function saveModelTwo(Request $request) {
        $request->validate($this->rules);
        $path = "";
        
        try {
            if($request->profile_photo){
                $path = Storage::disk("public")->put("profile_photo", $request->profile_photo);
            }

            $contact = $this->saveContact($request);
            
            $cv = $this->saveCV($request, $path, $contact->id);

            $this->saveExperiences($request, $cv->id, true);

            $this->saveFormations($request, $cv->id);

            $this->saveLanguages($request, $cv->id, false);

            $this->saveSkills($request, $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function saveModelThree(Request $request) {
        $this->rules['url_linkedin'] = ['url'];
        $this->rules["profile_description"] = ['string', 'min:10', 'required'];

        $request->validate($this->rules);
        $path = "";
        
        try {
            if($request->profile_photo){
                $path = Storage::disk("public")->put("profile_photo", $request->profile_photo);
            }

            $contact = $this->saveContact($request);
            
            $cv = $this->saveCV($request, $path, $contact->id);

            $this->saveExperiences($request, $cv->id, true);

            $this->saveFormations($request, $cv->id);

            $this->saveLanguages($request, $cv->id, false);

            $this->saveSkills($request, $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function saveModelFour(Request $request) {
        $this->rules['url_linkedin'] = ['url'];
        $this->rules["profile_description"] = ['string', 'min:10', 'required'];
        
        $request->validate($this->rules);
        $path = "";
        
        try {
            if($request->profile_photo){
                $path = Storage::disk("public")->put("profile_photo", $request->profile_photo);
            }

            $contact = $this->saveContact($request);
            
            $cv = $this->saveCV($request, $path, $contact->id);

            $this->saveExperiences($request, $cv->id, true);

            $this->saveFormations($request, $cv->id);

            $this->saveLanguages($request, $cv->id);

            $this->saveSkills($request, $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function download(Request $request) {
        try {
            $contact = Contact::where('email', $request->email)->get();
            
            $cv = CV::where("contact_id", $contact[0]->id)->get();
            
            $pdf = Pdf::loadView('components.cvs.'. $cv[0]->model, ["cv" => $cv[0]]);
            
            return $pdf->download("cv.pdf");

            echo json_encode(['success' => true]);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function test(){
        $pdf = Pdf::loadView('components.cvs.cv-1', ["content" => "dzf"]);
            
        return $pdf->download("cv.pdf");
    }
}
