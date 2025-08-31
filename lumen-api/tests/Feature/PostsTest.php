<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;
use Firebase\JWT\JWT;

class PostsTest extends TestCase
{
    private function tokenFor(User $u): string
    {
        $now = time();
        return JWT::encode(['sub'=>$u->id,'iat'=>$now,'exp'=>$now+3600], env('JWT_SECRET'), 'HS256');
    }

    public function test_create_and_list_posts()
    {
        Redis::shouldReceive('get')->andReturn(null);
        Redis::shouldReceive('setex')->andReturn(true);
        Redis::shouldReceive('del')->andReturn(1);

        $user = User::create([
            'name'=>'Dev','email'=>'dev@example.com','password'=>Hash::make('secret123'),
        ]);
        $token = $this->tokenFor($user);

        $this->json('POST', '/api/posts',
            ['title'=>'Hello','content'=>'World'],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$token}",
            ]);


        $this->seeStatusCode(201)
            ->seeJsonContains(['title'=>'Hello']);

        $this->json('GET', '/api/posts', [], [
            'Accept'=>'application/json',
            'Authorization'=>"Bearer {$token}",
        ])
            ->seeStatusCode(200)
            ->seeJsonStructure([['id','title','content','user_id']]);
    }
}
