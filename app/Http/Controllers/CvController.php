<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Cv;
use App\Models\Experience;
use App\Models\Formation;
use App\Models\Hobby;
use App\Models\Language;
use App\Models\Skill;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
        "email" => ['string', "email", 'required'],
        "sex" => ['string', "min:3", "max:5", 'required']
    ];

    private $formations = 0;

    private $languages = 0;

    private $hobbies = 0;

    private $skills = 0;

    private $experiences = 0;

    private $update = false;

    /**
     * @var Cv
     */
    private $cv;

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
        
        $this->echo = $echo;

        foreach($request->request as $name => $value){
            if(strchr($name, "degree")){
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
            }else if(strchr($name, "year_debut")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "year_end")){
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

        if($this->update){
            $this->removeRequiredFromRules();
        }

        $request->validate($this->rules);
        $path = "";

        try {
            $path = $this->storeProfilePhoto($request);
            
            $cv = $this->saveCV($request, $path);
            
            $this->saveContact($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveExperiences($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveFormations($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveLanguages($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveSkills($request, $this->cv ? $this->cv->id : $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
                "cv_id" => $this->cv ? $this->cv->id : $cv->id
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function removeRequiredFromRules() {
        $this->rules = array_map(function($rule){
            return array_filter($rule, function($rule_element){
                return $rule_element !== "required";
            });
        }, $this->rules);
    }

    private function saveContact(Request $request, int $cv_id) {
        $arrayValues = [
            "phone_number" => (int)$request->phone_number,
            "adress" => $request->adress,
            "email" => $request->email,
            "linkedin_url" => $request->url_linkedin ? $request->url_linkedin : null,
            "cv_id" => $cv_id
        ];
        
        if(!$this->update){
            return Contact::create($arrayValues);
        }else {
            $contacts = Contact::where('cv_id', $this->cv->id)->get();
            
            $contacts[0]->update(array_filter($arrayValues, function($key){
                return $key !== "cv_id";
            }, ARRAY_FILTER_USE_KEY));
        }
        
    }

    /**
     * enregistre le cv
     * 
     * @return Cv
     */
    private function saveCV(Request $request, $path) {
        $arrayValues = [
            "name" => $request->name,
            "firstname" => $request->firstname,
            "sex" => $request->sex,
            "current_work" => $request->work,
            "profile" => $request->profile_description,
            "image" => $path !== "" ? $path : null,
            "model" => $request->model,
            "is_recorded" => true
        ];

        if(!$this->update){
            return Cv::create($arrayValues);
        }else {
            if(!isset($request->sex)){
                $arrayValues =array_filter($arrayValues, function($key){
                    return $key !== "sex";
                }, ARRAY_FILTER_USE_KEY);
            }

            $this->cv->update($arrayValues);

            return $this->cv;
        }
        
    }

    private function storeProfilePhoto(Request $request): string
    {
        if($request->profile_photo 
            && !is_string($request->profile_photo) 
        ){

            if($this->update){
                
                $imagePath = storage_path(DIRECTORY_SEPARATOR . 
                    "app" . DIRECTORY_SEPARATOR . 
                    "public" . DIRECTORY_SEPARATOR . 
                    $this->cv->image);
                    
                if(file_exists($imagePath)){
                    Storage::disk("public")->delete($imagePath);
                }    
            }

            return Storage::disk("public")->put("profile_photo", $request->profile_photo);
        }

        return "";
    }

    private function saveExperiences(Request $request, int $cv_id, bool $multitask = false) {
        for($i = 0; $i < $this->experiences; $i++){
            $company_name = "company_name_" . $this->stringNumber[$i+1];
            $work = "company_work_" . $this->stringNumber[$i+1];
            $year_debut = "year_debut_" . $this->stringNumber[$i+1];
            $year_end = "year_end_" . $this->stringNumber[$i+1];
            $task = "";
            $tasks = [];

            if($multitask){
                $countTasks = 0;
                foreach($request->request as $name => $value){
                    if(strchr($name, "experience_" . $this->stringNumber[$i+1])){
                        $countTasks++;
                        $taskVar = "experience_" . $this->stringNumber[$i+1] . "_task_" . $this->stringNumber[$countTasks];
                        array_push($tasks, $request->$taskVar) ;
                    }
                }
            }else {
                $task = "experience_" . $this->stringNumber[$i+1] . "_task_one";
            }
            
            $arrayValues = [
                "entreprise_name" => $request->$company_name,
                "work" => $request->$work,
                "date" => $request->$year_debut . " - " . $request->$year_end,
                "task" => $task ? $request->$task : join("\n", $tasks),
                "cv_id" => $cv_id
            ];

            if(!$this->update){
                Experience::create($arrayValues);
            }else {
                $experiences = Experience::where('cv_id', $this->cv->id)->get();

                if($i < count($experiences)){
                    $experiences[$i]->update(array_filter($arrayValues, function($key){
                        return $key !== "cv_id";
                    }, ARRAY_FILTER_USE_KEY));
                }else {
                    Experience::create($arrayValues);
                }
            }
        }
    }

    private function saveFormations(Request $request, int $cv_id) {
        
        for($i = 0; $i < $this->formations; $i++){
            $etablissement = "etablissement_" . $this->stringNumber[$i+1];
            $year_debut = "year_debut_" . $this->stringNumber[$i+1];
            $year_end = "year_end_" . $this->stringNumber[$i+1];
            $degree = "degree_" . $this->stringNumber[$i+1];
            
            $arrayValues = [
                "etablissement" => $request->$etablissement,
                "date" => $request->$year_debut . " - " . $request->$year_end,
                "degree" => $request->$degree,
                "cv_id" => $cv_id
            ];

            if(!$this->update){
                Formation::create($arrayValues);
            }else {
                $formations = Formation::where('cv_id', $this->cv->id)->get();
                if($i < count($formations)){
                    $formations[$i]->update(array_filter($arrayValues, function($key){
                        return $key !== "cv_id";
                    }, ARRAY_FILTER_USE_KEY));
                }else {
                    Formation::create($arrayValues);
                }
                
            }
        }
    }

    private function saveLanguages(Request $request,int $cv_id, bool $stringLevel = true) {
        for($i = 0; $i < $this->languages; $i++){
            $name = "language_" . $this->stringNumber[$i+1];
            $level = "language_level_" . $this->stringNumber[$i+1];

            $arrayValues = [
                "name" => $request->$name,
                "cv_id" => $cv_id
            ];
            
            if($stringLevel){
                $arrayValues["string_level"] = $request->$level;
            }else {
                $arrayValues["level"] = (float) $request->$level;
            }

            if(!$this->update){
                Language::create($arrayValues);
            }else {
                $languages = Language::where('cv_id', $this->cv->id)->get();
                
                if($i < count($languages)){
                    $languages[$i]->update(array_filter($arrayValues, function($key){
                        return $key !== "cv_id";
                    }, ARRAY_FILTER_USE_KEY));
                }else {
                    Language::create($arrayValues);
                }
            }
        }
    }

    private function saveSkills(Request $request, int $cv_id) {
        for($i = 0; $i < $this->skills; $i++){
            $name = "skill_" . $this->stringNumber[$i+1];
            $level = "skill_level_" . $this->stringNumber[$i+1];
            if(!$this->update){
                Skill::create([
                    "name" => $request->$name,
                    "level" => $request->$level ? (int) $request->$level : null,
                    "cv_id" => $cv_id
                ]);
            }else {
                $skills = Skill::where('cv_id', $this->cv->id)->get();
                
                $arrayValues = [
                    "name" => $request->$name,
                    "level" => $request->$level ? (int) $request->$level : null,
                    "cv_id" => $cv_id
                ];

                if($i < count($skills)){
                    $skills[$i]->update(array_filter($arrayValues, function($key){
                        return $key !== "cv_id";
                    }, ARRAY_FILTER_USE_KEY));
                }else {
                    Skill::create($arrayValues);
                }
            }
        }
    }

    private function saveModelTwo(Request $request) {
        if($this->update){
            $this->removeRequiredFromRules();
        }

        $request->validate($this->rules);
        $path = "";
        
        try {
            $path = $this->storeProfilePhoto($request);

            
            $cv = $this->saveCV($request, $path);
            
            $this->saveContact($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveExperiences($request, $this->cv ? $this->cv->id : $cv->id, true);

            $this->saveFormations($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveLanguages($request, $this->cv ? $this->cv->id : $cv->id, false);

            $this->saveSkills($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveHobbies($request, $this->cv ? $this->cv->id : $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
                "cv_id" => $cv->id
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function saveHobbies(Request $request, int $cv_id){
        for($i = 0; $i < $this->hobbies; $i++){
            $hobby = "hobby_" . $this->stringNumber[$i+1];
            
            $arrayValues = [
                "name" => $request->$hobby,
                "cv_id" => $cv_id
            ];

            if(!$this->update){
                Hobby::create($arrayValues);
            }else {
                $hobbies = Hobby::where('cv_id', $this->cv->id)->get();

                if($i < count($hobbies)){
                    $hobbies[$i]->update(array_filter($arrayValues, function($key){
                        return $key !== "cv_id";
                    }, ARRAY_FILTER_USE_KEY));
                }else {
                    Hobby::create($arrayValues);
                }
            }
            
        }
    }

    private function saveModelThree(Request $request) {
        $this->rules['url_linkedin'] = ['url'];
        $this->rules["profile_description"] = ['string', 'min:10', 'required'];

        if($this->update){
            $this->removeRequiredFromRules();
        }

        $request->validate($this->rules);
        $path = "";
        
        try {
            $path = $this->storeProfilePhoto($request);

            $cv = $this->saveCV($request, $path);

            $this->saveContact($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveExperiences($request, $this->cv ? $this->cv->id : $cv->id, true);

            $this->saveFormations($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveLanguages($request, $this->cv ? $this->cv->id : $cv->id, false);

            $this->saveSkills($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveHobbies($request, $this->cv ? $this->cv->id : $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
                "cv_id" => $cv->id
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function saveModelFour(Request $request) {
        $this->rules['url_linkedin'] = ['url'];
        $this->rules["profile_description"] = ['string', 'min:10', 'required'];
        
        if($this->update){
            $this->removeRequiredFromRules();
        }

        $request->validate($this->rules);
        $path = "";
        
        try {
            $path = $this->storeProfilePhoto($request);
            
            $cv = $this->saveCV($request, $path);
            
            $this->saveContact($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveExperiences($request, $this->cv ? $this->cv->id : $cv->id, true);

            $this->saveFormations($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveLanguages($request, $this->cv ? $this->cv->id : $cv->id);

            $this->saveSkills($request, $this->cv ? $this->cv->id : $cv->id);

            if($this->echo === false){
                return;
            }

            echo json_encode([
                "success" => true,
                "cv_id" => $cv->id
            ]);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function download(Request $request) {
        try {
            $cv = null;
            if($request->cv_id){
                $cv = Cv::find($request->cv_id);
            }else {
                $contact = Contact::where('email', $request->email)->get();

                $cv = Cv::find($contact[0]->cv_id);
            }

            $image = null;
            if($cv->image){
                $imagePath = public_path(Storage::url($cv->image));
                $image = "data:image/png;base64,". base64_encode(file_get_contents($imagePath));
            }

            $pdf = Pdf::loadView('pdf.cv', [
                "cv" => $cv, 
                "stringNumber" => $this->stringNumber,
                "image" => $image,
                "download" => true
            ]);
            
            return $pdf->download("cv-". $cv->name . "-". $cv->id.".pdf");

            echo json_encode(['success' => true]);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function test(){
        $pdf = Pdf::loadView('components.cvs.cv-1', ["content" => "dzf"]);
            
        return $pdf->download("cv.pdf", [
            "download" => true
        ]);
    }

    public function show(Request $request, string $name, int $id){
        $cv = Cv::find($id);
        
        if($cv === null || ($cv->name !== $name)){
            throw new NotFoundHttpException("Cet url n'existe pas");
        }

        $image = null;
        if($cv->image){
            $imagePath = public_path(Storage::url($cv->image));
            $image = "data:image/png;base64,". base64_encode(file_get_contents($imagePath));
        }
        

        return view('cv.show', [
            'cv' => $cv,
            'title' => $cv->name . " " . $cv->firstname,
            "token" => csrf_token(),
            "stringNumber" => $this->stringNumber,
            "image" => $image
        ]);
    }

    public function delete(Request $request) {
        $cv = Cv::find($request->cv_id);
        
        if($cv !== null){
            $cv->delete();
            echo json_encode(["success" => true]);
        }else {
            throw new Exception(json_encode(['success' => false, "message" => "Ce Cv n'existe pas"]));
        }
    }

    public function edit(Request $request) {
        try {
            $cv = Cv::find((int)$request->cv_id);
            if($cv){
                $this->cv = $cv;
                
                $this->update = true;

                $this->save($request);
            }
        }catch(Exception $e){
            throw $e;
        }
    }

    public function findByDegree(Request $request): void 
    {
        $request->validate(['degree' => "required", "string"]);

        $cvs = [];
        
        $formations = Formation::where('degree', "like", "%" .$request->degree . "%")->get();
        foreach($formations as $formation){
            $cvs[] = Cv::find($formation->cv_id);
        }

        echo json_encode($cvs);
    }
}
