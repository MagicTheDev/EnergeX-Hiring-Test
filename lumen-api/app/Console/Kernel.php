<?php

namespace App\Console;

use Laravel\Lumen\Console\Kernel as ConsoleKernel;
use Illuminate\Console\Scheduling\Schedule;

class Kernel extends ConsoleKernel
{
    /** @var array<int, class-string> */
    protected $commands = [
    ];

    protected function schedule(Schedule $schedule): void
    {
        // no scheduled tasks yet
    }
}
