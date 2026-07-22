<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class WebController extends Controller
{
    public function index(): Response
    {
        $plans = Plan::all();

        return Inertia::render('home', compact('plans'));
    }
}
