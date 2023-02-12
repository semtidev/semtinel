<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    /**
     * Login user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $credentials = $request->all();
        if (Auth::attempt($credentials, true)) {
            
            $user = Auth::getProvider()->retrieveByCredentials($credentials);
            Auth::login($user);
            $token   = $user->createToken('auth_token')->plainTextToken;
            $client  = getIP();
            
            // Init session
            session_start();
            $session = array(
                'active' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'client' => $client
            );
            $_SESSION['semtinel'] = $session;
            $redirectTo = route('app');
            $response = array(
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user, 
                'redirect' => $redirectTo
            );
            return response()->json($response, 200);
        }
        else {
            return response()->json([
                'message' => 'Invalid user'
            ], 401);
        }       
    }

    /**
     * Logout user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        session_start();
        // destruimos la session de usuarios.
        session_unset();
        session_destroy();
        
        return redirect(route('login'));
    }
}
