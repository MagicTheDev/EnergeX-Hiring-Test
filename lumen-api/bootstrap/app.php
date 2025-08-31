<?php

require_once __DIR__ . '/../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
*/
$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Facades / Eloquent
|--------------------------------------------------------------------------
*/
$app->withFacades(true, [
    'Illuminate\Support\Facades\Hash'  => 'Hash',
    'Illuminate\Support\Facades\Redis' => 'Redis',
]);

$app->withEloquent();

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
*/
$app->register(Illuminate\Hashing\HashServiceProvider::class);
$app->register(Illuminate\Validation\ValidationServiceProvider::class);
$app->register(Illuminate\Redis\RedisServiceProvider::class);

/*
|--------------------------------------------------------------------------
| Route Middleware
|--------------------------------------------------------------------------
*/
$app->routeMiddleware([
    'jwt' => App\Http\Middleware\JwtMiddleware::class,
]);
$app->middleware([
    App\Http\Middleware\CorsMiddleware::class,
]);

/*
|--------------------------------------------------------------------------
| Container Bindings
|--------------------------------------------------------------------------
*/
$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
*/
$app->configure('app');
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__ . '/../routes/web.php';
});

return $app;
