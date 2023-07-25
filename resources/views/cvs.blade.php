@extends("layouts.app")

@section("content")

@if(count($cvs) > 0)
    @foreach ($cvs as $cv)
        <div class="men">
            <div class="men_bar">HOMMES</div>
            @if($cv->sex === "man")
                {{ $cv->name }}
            @endif
        </div>
        <div class="women">
            <div class="women_bar">FEMMES</div>
            @if($cv->sex === "woman")
                {{ $cv->name }}
            @endif
        </div>
    @endforeach
@else
<div class="alert alert-danger w-50 text-center ms-auto me-auto" style="margin-top: 200px;">
    IL N'Y A ENCORE AUCUN CV
</div>
@endif

@endsection