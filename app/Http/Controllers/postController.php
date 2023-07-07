<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class postController extends Controller
{
    public function index()
    {
        return view("index");
    }

    public function contact()
    {
        return view("contact");
    }

    public function show()
    {
        $posts = Post::all();

        return view("articles", [
            "posts" => $posts
        ]);
    }
    public function find($id)
    {
        $post = Post::find($id);
        
        return view("article", [
            "post" => $post
        ]);
    }

    public function create_post()
    {
        return view("create");
    }

    public function create_action(Request $request)
    {
        $post = new Post();

        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        dd("post crée");
    }
}
