<nav class="navbar navbar-expand-md bg-primary fixed-top">
    <div class="container-fluid">
        <a href="/" class="d-block w-100">
            <x-application-logo style="width: 40px"/>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6">
                    </line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link text-white" aria-current="page" href='/'>Enregistrements</a>
                </li>
                <li class="nav-item" style="width: 220px">
                    @csrf
                    <input type="hidden" name="token" value="{{ $token }}">
                    <a class="nav-link text-white edit-password" aria-current="page" href='/'>Modifier le mot de passe</a>
                </li>
                <li class="nav-item">
                    @csrf
                    <button class="btn btn-secondary logout-btn">
                        @include('icons.logout')
                    </button>
                </li>
            </ul>
        </div>
    </div>
</nav>