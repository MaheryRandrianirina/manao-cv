@extends("layouts.app")

@section("content")

<div class="cv-form cv-2-form">
    @if(isset($cv))
        <input type="hidden" class="cv-id" name="cv_id" value="{{ $cv->id }}">
    @endif
    @include('components.cvs.cv-2')
</div>

@endsection