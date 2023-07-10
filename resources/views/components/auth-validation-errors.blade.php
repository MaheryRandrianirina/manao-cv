@props(['errors'])

@if ($errors->any())
    <div {{ $attributes }}>
        <div class="mb-2 text-white text-uppercase">Quelque chose s'est ma passée !</div>
        <ul class="list-group">
            @foreach ($errors->all() as $error)
                <p class="text-white"> - {{ $error }}</p>
            @endforeach
        </ul>
    </div>
@endif
