<?php

return [
    'redis' => [
        'client' => env('REDIS_CLIENT', 'predis'),

        'default' => [
            'host'     => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port'     => (int) env('REDIS_PORT', 6379),
            'database' => (int) env('REDIS_DB', 0),
        ],
    ],
];
