@extends("layouts.default")

@section('content')
<h5>L'article demandé :</h5>

<p style="color:brown;"> {{$post->content}}</p>
<p>{{ $post->image->path ?? "pas d'image" }}</p>

@forelse($post->comments as $comment)
    <p>{{ $comment->content }}</p>
@empty
    <p>Aucun commentaire pour ce post</p>
@endforelse
<p>{{ $post->}}</p>
@endsection