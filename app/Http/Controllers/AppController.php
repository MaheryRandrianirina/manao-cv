<?php

namespace App\Http\Controllers;

use App\Models\CV;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index(Request $request) {
        $title = "Modèles de CV";
        return view('home', ['token' => csrf_token(), 'title' => $title ]);
    }

    public function cvs(Request $request) {
        return view('cvs', [
            'token' => csrf_token(), 
            'title' => "Enregistrements",
            "hideSaving" => true,
            "men" => CV::where('sex', 'man')->get(),
            "women" => CV::where('sex', 'woman')->get(),
            "route" => "cvs"
        ]);
    }
}
