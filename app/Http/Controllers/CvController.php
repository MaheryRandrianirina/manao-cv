<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

class CvController extends Controller
{
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
}
