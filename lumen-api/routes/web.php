<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () {
    return response()->json(['ok' => true]);
});

$router->group(['prefix' => 'api'], function () use ($router) {
    // public
    $router->post('register', 'AuthController@register');
    $router->post('login',    'AuthController@login');

    // protected (JWT)
    $router->group(['middleware' => 'jwt'], function () use ($router) {
        $router->get('posts',      'PostController@index');
        $router->post('posts',     'PostController@store');
        $router->get('posts/{id}', 'PostController@show');
    });
});
