<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    public function test_register_returns_token_and_user()
    {
        $payload = ['name' => 'Foo', 'email' => 'foo@foo.foo', 'password' => 'secret123'];

        $this->json('POST', '/api/register', $payload, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])
            ->seeStatusCode(201)
            ->seeJsonStructure(['user' => ['id','name','email'], 'token']);
    }

    public function test_login_success()
    {
        User::create([
            'name' => 'Bar',
            'email' => 'bar@bar.bar',
            'password' => Hash::make('secret123'),
        ]);

        $this->json('POST', '/api/login',
            ['email'=>'bar@bar.bar','password'=>'secret123'],
            ['Accept'=>'application/json','Content-Type'=>'application/json']
        )
            ->seeStatusCode(200)
            ->seeJsonStructure(['user'=>['id','name','email'],'token']);
    }
}
