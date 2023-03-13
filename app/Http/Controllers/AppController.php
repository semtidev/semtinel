<?php

namespace App\Http\Controllers;

use App\Models\SystStructureEop;
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

    // Get Tree EOP
    public function treeEop($project, $parent = 0) {
        
        $tree = array();
        if(SystStructureEop::where('id_project', intval($project))->where('parent', $parent)->where('active', 1)->exists()) {
            $query = SystStructureEop::where('id_project', intval($project))->where('parent', $parent)->where('active', 1)->orderBy('description', 'ASC')->get();
            foreach ($query as $structure) {
                if (SystStructureEop::where('id_project', intval($project))->where('parent', $structure->id)->where('active', 1)->exists()) {
                    $tree[] = [
                        'id' => $structure->id,
                        'label' => $structure->description,
                        'children' => $this->treeEop($project, $structure->id)
                    ];
                }
                else {
                    $tree[] = [
                        'id' => $structure->id,
                        'label' => $structure->description
                    ];
                }                
            }
        }

        $response = array('success' => true, 'tree' => $tree);
        return response()->json($response, 200);
    }
}
