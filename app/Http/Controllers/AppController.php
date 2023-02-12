<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }
    
    // Index App
    public function index(Request $request) {
        return view('home', []);
    }

    // Login App
    public function login(Request $request) {
        return view('auth.login', []);
    }
}
