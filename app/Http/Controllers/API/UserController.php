<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\user;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\user  $user
     * @return \Illuminate\Http\Response
     */
    public function show(user $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\user  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, user $user)
    {
        if($request->getMethod() === "POST"){
            $request->validate([
                "token" => ["required"],
                "current_password" => ['required', Password::defaults()],
                "password" => ['required', 'confirmed', Password::defaults()]
            ]);
            
            $providedCurrentPwdIsTrue = Hash::check($request->current_password, Auth::user()->getAuthPassword());
            
            if($providedCurrentPwdIsTrue){
                try {
                    $updated = User::find(Auth::user()->id)->update([
                        'password' => Hash::make($request->password)
                    ]);
                    
                    if($updated){
                        return json_encode(['updated' => true]);
                    }
                }catch(Exception $e){
                    throw $e;
                }
            }else {
                http_response_code(500);
                
                return json_encode([
                    'updated' => false, 
                    "errors" => ['current_password' => "Mot de passe incorrect."]
                ]);
            }
            
        }else {
            throw new Exception('Seule la requête en POST est autorisée pour cette route.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\user  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(user $user)
    {
        //
    }
}
