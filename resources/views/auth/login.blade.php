<x-guest-layout>
    <x-auth-card>
        <x-slot name="logo">
            <a href="/" class="d-block w-100">
                <x-application-logo class="d-block mt-5 mb-5 m-auto" style="width: 120px"/>
            </a>
        </x-slot>

        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="ms-auto me-auto rounded mb-4 bg-danger p-2 text-center" style="width:350px" :errors="$errors" />
        <div class="container bg-white p-3 rounded" style="width: 350px">
            <form method="POST" action="{{ route('login') }}" class="container">   
                @csrf
                <div class="mb-3">   
                    <x-label for="username" class="form-label" :value="__('Nom d\'utilisateur')" />  
                    <x-input id="username" class="form-control" type="text" name="username" :value="old('username')" required autofocus aria-described />     
                </div>  
                <div class="mb-3">
                    <x-label for="password" class="form-label" :value="__('Mot de passe')" />
    
                    <x-input id="password" class="form-control"
                                    type="password"
                                    name="password"
                                    required autocomplete="current-password" />         
                </div>   
                <div class="mb-3 form-check">
                    <input id="remember_me" type="checkbox" class="form-check-input" name="remember">   
                    <label for="remember_me" class="form-check-label">{{ __('Se souvenir de moi') }}</label> 
                </div> 
                <div class="mb-3">   
                    <x-label id='no-account' class="text-gray" :value="__('Pas de compte ?')" />  
                    <a href="/register" class="fs-6">S'inscrire</a>
                </div>   
                <x-button class="btn btn-primary">
                    {{ __('Se connecter') }}
                </x-button>
            </form>
        </div>
    </x-auth-card>
</x-guest-layout>
