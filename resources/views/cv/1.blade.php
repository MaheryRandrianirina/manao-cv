@extends("layouts.app")

@section("content")

<div class="cv-form cv-1-form">
    @if(isset($cv))
        <input type="hidden" class="cv-id" name="cv_id" value="{{ $cv->id }}">
    @endif

    @include('components.cvs.cv-1')
</div>

@endsection