<x-guest-layout>
    <x-auth-card>
        <x-slot name="logo">
            <a href="/">
                <x-application-logo class="d-block mt-5 mb-5 m-auto" style="width: 120px"/>
            </a>
        </x-slot>

        <!-- Validation Errors -->
        <x-auth-validation-errors class="ms-auto me-auto rounded mb-4 bg-danger p-2 text-center" style="width:350px" :errors="$errors" />
        <div class="container bg-white p-3 rounded" style="width:350px">
            <form method="POST" action="{{ route('register') }}" class="container">   
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
                                    required autocomplete="new-password" />         
                </div>   
                <div class="mb-3">
                    <x-label for="password_confirmation" class="form-label" :value="__('Confirmer le mot de passe')" />
    
                    <x-input id="password_confirmation" class="form-control"
                                    type="password"
                                    name="password_confirmation"
                                    required />         
                </div>
                <div class="mb-3">   
                    <x-label class="text-muted" :value="__('Déjà un compte ?')" />  
                    <a href="/login" class="fs-6">Se connecter</a>
                </div>   
                <x-button class="btn btn-primary">
                    {{ __('S\'inscrire') }}
                </x-button>
            </form>
        </div>v>
        </form>
    </x-auth-card>
</x-guest-layout>
