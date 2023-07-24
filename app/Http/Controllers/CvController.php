<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

class CvController extends Controller
{
    /*
     * Règles de validation
    */
    private $rules = [
        "model" => ['string', "min:4", "required"],
        "profile_photo" => ["file"],
        "name" => ['string', 'min:3', 'required'],
        "firstname" => ['string', 'min:3', 'required'],
        "work" => ['string', 'min:3', 'required'],
        "phone_number" => ['string', 'min:10', 'max:10', 'required'],
        "adress" => ['string', 'min:2', 'required'],
        "email" => ['string', 'required', "email"],
        "profile_description" => ['string', 'min:10', 'required'],
        "sex" => ['string', 'required', "min:5", "max:5"]
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

    public function save(Request $request) {
        $model = $request->model;
        $dataLength = count($request->request);

        foreach($request->request as $name => $value){
            if(strchr($name, "graduation")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "etablissement")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "year_debut")){
                $this->rules[$name] = ["integer", "required"];
            }else if(strchr($name, "year_end")){
                $this->rules[$name] = ["integer", "required"];
            }else if(strchr($name, "language") && !strchr($name, "language_level")){
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
            }else if(strchr($name, "experience")){
                $this->rules[$name] = ["string", "required"];
            }else if(strchr($name, "skill_level")){
                $this->rules[$name] = ['string', "required"];
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
        $this->rules["url_linkedin"] = ['string'];
        $this->rules["language_level"] = ['string', "required"];

        $request->validate($this->rules);

        
    }

    private function saveModelTwo(Request $request) {
        
    }

    private function saveModelThree(Request $request) {
        
    }

    private function saveModelFour(Request $request) {
        
    }
}
