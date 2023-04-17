<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Throwable;

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
            $systems = $user->getSystems();
            $permissions = $user->getPermissions();
            
            // Init session
            session_start();
            $session = array(
                'active' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'client' => $client,
                'systems' => $systems,
                'permissions' => $permissions
            );
            $_SESSION['semtinel'] = $session;
            $redirectTo = route('app');
            $response = array(
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user, 
                'redirect' => $redirectTo,
                'systems' => $systems,
                'permissions' => $permissions
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
     * Login Ldap user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function loginLdap(Request $request)
    {      
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $credentials = [
            'uid' => $request->username,
            'password' => $request->password,
            'fallback' => [
                'username' => $request->username,
                'password' => $request->password,
            ]
        ];

        $valido = Auth::guard('ldap')->validate($credentials);

        if ($valido) {
            $user = Auth::guard('ldap')->getLastAttempted();           
            $token = $user->createToken('auth_token')->plainTextToken;
            $client  = getIP();
            $systems = $user->getSystems();
            $permissions = $user->getPermissions();

            // Init session
            session_start();
            $session = array(
                'active' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'client' => $client,
                'systems' => $systems,
                'permissions' => $permissions
            );
            $_SESSION['semtinel'] = $session;
            $redirectTo = route('app');
            $response = array(
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user, 
                'redirect' => $redirectTo,
                'systems' => $systems,
                'permissions' => $permissions
            );
            return response()->json($response, 200);
        }
    
        return response()->json([
            'message' => 'Invalid user'
          ], 401);
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

    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function createUser(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make($request->all(), 
            [
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'id_pole' => $request->syst_pole_id
            ]);
            //le asigna roles a los usuarios
            if(!empty($request->roles)){
                $user->assignRole($request->roles);
            }

            //asignar proyectos en la relacion mucho a mucho
            if(!empty($request->projects)){
                $user->projects()->attach($request->projects);
            }

            //asignar sistemas en la relacion mucho a mucho
            if(!empty($request->systems)){
                $user->systems()->attach($request->systems);
            }

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully',
                'token' => $user->createToken('auth_token')->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     * @param int $id
     * @return User
     */

     public function destroyUser($id) {
        $user='';
        try {
            // Delete user
            $user = User::find(intval($id));
            $user->projects()->detach();
            $user->systems()->detach();
            $user->delete();

        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 500);
        }

        // Response
        $response = array('success' => true,'user'=> $user);
        return response()->json($response, 200);

    }

    /**
     * Update User
     * @param Request $request
     * @return User
     */
    public function updateUser(Request $request){
        $user = User::findOrFail(intval($request->id));
        $data = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'username' => $request->username,
            'id_pole' => $request->syst_pole_id
        ];
        //comprobar si se entr'o un nuevo password
        if($request->password !== '') $data['password']= Hash::make($request->password);

        $user->update($data);

        //las realaiones mucho a mucho
        $user->systems()->sync($request->systems);
        $user->projects()->sync($request->projects);
        $user->roles()->sync($request->roles);
        // Response
        $response = array('success' => true,'user'=> $user);
        return response()->json($response, 200);
    }
}
