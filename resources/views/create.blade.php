@extends("layouts.default")

@section("content")
<form action="{{ route('create.action') }}" method="post">
    @csrf
    <input type="text" name="title" class="border-gray-600 border-2">
    <input type="text" name="content" class="border-gray-600 border-2">
    <button type="suhbmit" class="bg-blue-500">Envoyer</button>
</form>
@endsection