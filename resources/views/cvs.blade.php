@extends("layouts.app")

@section("content")

@if(count($men) === 0 && count($women) === 0)
<div class="alert alert-danger w-50 text-center ms-auto me-auto" style="margin-top: 200px;">
    IL N'Y A ENCORE AUCUN CV
</div>
@else
<div class="cvs-list p-5">
    <div class="men">
        <div class="bar men_bar pt-1 pb-1 ps-2 pe-3 bg-secondary position-relative">HOMMES <span class="cvs-number">({{ count($men) }})</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron men-chevron position-absolute end-0 me-1">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
        <div class="cvs p-2">
            @foreach($men as $man)
                <a class="d-block mb-2 border-bottom" href="/cv/{{$man->name}}-{{$man->firstname}}-{{$man->id}}">{{ $man->name }} {{ $man->firstname}}</a>
            @endforeach
            <button class="btn btn-primary mt-3">Voir plus</button>
        </div>
    </div>
    <div class="women mt-3">
        <div class="bar women_bar pt-1 pb-1 ps-2 pe-3 bg-secondary position-relative">FEMMES <span class="cvs-number">({{ count($women) }})</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron women-chevron position-absolute end-0 me-1">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
        <div class="cvs p-2">
            @foreach($women as $woman)
                <a class="d-block mb-2 border-bottom" href="/cv/{{$woman->name}}-{{$woman->firstname}}-{{$woman->id}}">{{ $woman->name }} {{ $woman->firstname}}</a>
            @endforeach
            <button class="btn btn-primary mt-3">Voir plus</button>
        </div>
    </div>
</div>
@endif

@endsection