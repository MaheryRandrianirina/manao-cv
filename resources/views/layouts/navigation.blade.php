<nav class="navbar navbar-expand-md bg-primary fixed-top">
    <div class="container-fluid">
        <a href="/" class="d-block w-100">
            <x-application-logo style="width: 40px"/>
        </a>
        <button style="position: relative; left: 93%; top: -40px;" class="navbar-toggler" type="button" data-bs-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon">
                <svg style="stroke: white;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6">
                    </line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            @if(isset($route) && $route === "cvs")
                <form style="width: 250px" action="" method="post" class="d-flex" role="search">
                    @csrf
                    <input class="form-control me-2 search_input" id="search_input" type="search" name="q" placeholder="recherche..." autocomplete="off">
                    <button class="btn btn-outline-success search-button" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 15px; fill: white;">
                            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/>
                        </svg>
                    </button>
                </form>
            @endif
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                @if(!isset($hideSaving) || (isset($hideSaving) && !$hideSaving))
                    <li class="nav-item">
                        <a class="nav-link text-white" aria-current="page" href='/cvs'>Enregistrements</a>
                    </li>
                @endif
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