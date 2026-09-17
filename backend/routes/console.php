<?php

use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file defines the application's console commands.
|
*/

Schedule::command('inspire')->hourly();
