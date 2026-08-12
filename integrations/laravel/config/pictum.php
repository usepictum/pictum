<?php

declare(strict_types=1);

use Pictum\Pictum;

return [
    'base_url' => env('PICTUM_BASE_URL', Pictum::DEFAULT_BASE_URL),

    'cache' => [
        'store' => env('PICTUM_CACHE_STORE'),
    ],
];
