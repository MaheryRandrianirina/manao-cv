@extends("layouts.default")

@section("content")
<h1>Liste d'articles: </h1>
    @foreach($posts as $post)

    <a href="{{ route('post.find', ['id' => $post->id]) }}">{{ $post->title}}</a><br>

    @endforeach
@endsction
