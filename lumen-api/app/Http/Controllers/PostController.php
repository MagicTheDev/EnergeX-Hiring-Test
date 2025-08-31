<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class PostController extends Controller
{
    // GET /api/posts
    public function index(Request $request)
    {
        $cacheKey = "posts:all";

        if ($json = Redis::get($cacheKey)) {
            return response($json, 200)->header('Content-Type', 'application/json');
        }

        $posts = Post::orderByDesc('id')->get();
        $json = $posts->toJson();

        Redis::setex($cacheKey, 60, $json); // cache 60s
        return response($json, 200)->header('Content-Type', 'application/json');
    }

    // GET /api/posts/{id}
    public function show(Request $request, $id)
    {
        $user = $request->attributes->get('auth_user');
        $cacheKey = "post:user:{$user->id}:{$id}";

        if ($json = Redis::get($cacheKey)) {
            return response($json, 200)->header('Content-Type', 'application/json');
        }

        $post = Post::where('user_id', $user->id)->findOrFail($id);
        $json = $post->toJson();

        Redis::setex($cacheKey, 60, $json);
        return response($json, 200)->header('Content-Type', 'application/json');
    }

    // POST /api/posts
    public function store(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        $this->validate($request, [
            'title'   => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $post = Post::create([
            'title'   => $request->input('title'),
            'content' => $request->input('content'),
            'user_id' => $user->id,
        ]);

        Redis::del("posts:user:{$user->id}");
        Redis::del("post:user:{$user->id}:{$post->id}");

        return response()->json($post, 201);
    }
}
