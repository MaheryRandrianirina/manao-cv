
@if($cv->model === "cv-1")
    @include('cv.1')
@elseif($cv->model === "cv-2")
    @include('cv.2')
@elseif($cv->model === "cv-3")
    @include('cv.3')
@elseif($cv->model === "cv-4")
    @include('cv.4')
@endif