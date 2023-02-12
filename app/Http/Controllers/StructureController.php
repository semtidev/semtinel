<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\SystPole;
use App\Models\SystStructureProject;
use App\Models\SystStructureZone;
use App\Models\SystStructureObject;
use App\Models\SystStructurePart;
use Illuminate\Http\Request;

class StructureController extends Controller
{
    private $tree_levels = 0;
    
    /**
     * Get node childrens.
     *
     * @param  $parent
     * @return $childrens
     */
    public function getChildrens($parent)
    {
        $tree = array();
        $structures = SystStructurePart::where('parent', $parent)->orderBy('node_order', 'ASC')->get();
        foreach ($structures as $structure) {
            
            $childrens = array();
            $id_structure = intval($structure->id);

            if (SystStructurePart::where('parent', $id_structure)->exists()) {
                $childrens = $this->getChildrens($id_structure);
            }

            $tree[] = array(
                'id' => $structure->id,
                'name' => $structure->name,
                'abbr' => $structure->abbr,
                'active' => $structure->active,
                'childrens' => $childrens
            );
        }
        return $tree;
    }
    
    // View Tree structures
    public function treeStructures(Request $request) {
        
        $tree = array();
        // Poles
        $poles = SystPole::where('active', 1)->where('name', '<>', 'Todos')->get();
        foreach ($poles as $pole) {
            $struct_pole           = array();
            $struct_pole['id']     = $pole->id;
            $struct_pole['name']   = $pole->name;
            $struct_pole['abbr']   = $pole->abbr;
            $struct_pole['active'] = $pole->active;
            
            // Projects
            if (SystStructureProject::where('id_pole', $pole->id)->exists()) {
                $projects = SystStructureProject::where('id_pole', $pole->id)->get();
                foreach ($projects as $project) {
                    $struct_project           = array();
                    $struct_project['id']     = $project->id;
                    $struct_project['name']   = $project->name;
                    $struct_project['abbr']   = $project->abbr;
                    $struct_project['active'] = $project->active;

                    // Zones
                    if (SystStructureZone::where('id_project', $project->id)->exists()) {
                        $zones = SystStructureZone::where('id_project', $project->id)->get();
                        foreach ($zones as $zone) {
                            $struct_zone           = array();
                            $struct_zone['id']     = $zone->id;
                            $struct_zone['name']   = $zone->name;
                            $struct_zone['abbr']   = $zone->abbr;
                            $struct_zone['active'] = $zone->active;

                            // Objects
                            if (SystStructureObject::where('id_zone', $zone->id)->exists()) {
                                $objects = SystStructureObject::where('id_zone', $zone->id)->get();
                                foreach ($objects as $object) {
                                    $struct_object           = array();
                                    $struct_object['id']     = $object->id;
                                    $struct_object['name']   = $object->name;
                                    $struct_object['abbr']   = $object->abbr;
                                    $struct_object['active'] = $object->active;

                                    // Parts
                                    if (SystStructurePart::where('id_object', $object->id)->where('parent', 0)->exists()) {
                                        $parts = SystStructurePart::where('id_object', $object->id)->where('parent', 0)->get();
                                        foreach ($parts as $part) {
                                            $childrens             = array();                                            
                                            $struct_part           = array();
                                            $struct_part['id']     = $part->id;
                                            $struct_part['name']   = $part->name;
                                            $struct_part['abbr']   = $part->abbr;
                                            $struct_part['active'] = $part->active;
                                            if (SystStructurePart::where('parent', $part->id)->exists()) {
                                                $childrens = $this->getChildrens($part->id);
                                            }
                                            $struct_part['childrens'] = $childrens; 
                                            $struct_object['parts'][] = $struct_part;
                                        }
                                    }
                                    $struct_zone['objects'][] = $struct_object;
                                }
                            }
                            $struct_project['zones'][] = $struct_zone;
                        }
                    }
                    $struct_pole['projects'][] = $struct_project;
                }                
            }
            $tree[] = $struct_pole;
        }

        return view('tree_structures', [
            'poles' => $poles,
            'tree' => $tree
        ]);
    }

    // Get tree structures
    public function getTreeStructures() {
        $tree = array();
        // Poles
        $poles = SystPole::where('active', 1)->where('name', '<>', 'Todos')->get();
        foreach ($poles as $pole) {
            $struct_pole           = array();
            $struct_pole['id']     = $pole->id;
            $struct_pole['name']   = $pole->name;
            $struct_pole['abbr']   = $pole->abbr;
            $struct_pole['active'] = $pole->active;
            
            // Projects
            if (SystStructureProject::where('id_pole', $pole->id)->exists()) {
                $projects = SystStructureProject::where('id_pole', $pole->id)->get();
                foreach ($projects as $project) {
                    $struct_project           = array();
                    $struct_project['id']     = $project->id;
                    $struct_project['name']   = $project->name;
                    $struct_project['abbr']   = $project->abbr;
                    $struct_project['active'] = $project->active;

                    // Zones
                    if (SystStructureZone::where('id_project', $project->id)->exists()) {
                        $zones = SystStructureZone::where('id_project', $project->id)->get();
                        foreach ($zones as $zone) {
                            $struct_zone           = array();
                            $struct_zone['id']     = $zone->id;
                            $struct_zone['name']   = $zone->name;
                            $struct_zone['abbr']   = $zone->abbr;
                            $struct_zone['active'] = $zone->active;

                            // Objects
                            if (SystStructureObject::where('id_zone', $zone->id)->exists()) {
                                $objects = SystStructureObject::where('id_zone', $zone->id)->get();
                                foreach ($objects as $object) {
                                    $struct_object           = array();
                                    $struct_object['id']     = $object->id;
                                    $struct_object['name']   = $object->name;
                                    $struct_object['abbr']   = $object->abbr;
                                    $struct_object['active'] = $object->active;

                                    // Parts
                                    if (SystStructurePart::where('id_object', $object->id)->where('parent', 0)->exists()) {
                                        $parts = SystStructurePart::where('id_object', $object->id)->where('parent', 0)->get();
                                        foreach ($parts as $part) {
                                            $childrens             = array();                                            
                                            $struct_part           = array();
                                            $struct_part['id']     = $part->id;
                                            $struct_part['name']   = $part->name;
                                            $struct_part['abbr']   = $part->abbr;
                                            $struct_part['active'] = $part->active;
                                            if (SystStructurePart::where('parent', $part->id)->exists()) {
                                                $childrens = $this->getChildrens($part->id);
                                            }
                                            $struct_part['childrens'] = $childrens; 
                                            $struct_object['parts'][] = $struct_part;
                                        }
                                    }
                                    $struct_zone['objects'][] = $struct_object;
                                }
                            }
                            $struct_project['zones'][] = $struct_zone;
                        }
                    }
                    $struct_pole['projects'][] = $struct_project;
                }                
            }
            $tree[] = $struct_pole;
        }

        $response = array('success' => true, 'poles' => $poles, 'tree' => $tree, 'test' => 'First Test');
        return response()->json($response, 200);
    }

    // Update structure
    public function updateStructure(Request $request) {
        
        $fields = $request->all();

        try {
            if ($fields['node_type'] == 'pole') {
                if ($fields['structure_id'] == null || $fields['structure_id'] == '') {
                    $active = ($fields['active']) ? 1 : 0;
                    $element = SystPole::create([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $active
                    ])->id;
                    $fields['structure_id'] = $element;
                }
                else {
                    SystPole::find($fields['structure_id'])->update([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $fields['active']
                    ]);
                }                
            }
            elseif ($fields['node_type'] == 'project') {
                if ($fields['structure_id'] == null || $fields['structure_id'] == '') {
                    $active = ($fields['active']) ? 1 : 0;
                    $element = SystStructureProject::create([
                        'id_pole' => intval($fields['parent_id']),
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $active
                    ])->id;
                    $fields['structure_id'] = $element;
                }
                else {
                    SystStructureProject::find($fields['structure_id'])->update([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $fields['active']
                    ]);
                }
            }
            elseif ($fields['node_type'] == 'zone') {
                if ($fields['structure_id'] == null || $fields['structure_id'] == '') {
                    $active = ($fields['active']) ? 1 : 0;
                    $element = SystStructureZone::create([
                        'id_project' => intval($fields['parent_id']),
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $active
                    ])->id;
                    $fields['structure_id'] = $element;
                }
                else {
                    SystStructureZone::find($fields['structure_id'])->update([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $fields['active']
                    ]);
                }
            }
            elseif ($fields['node_type'] == 'object') {
                if ($fields['structure_id'] == null || $fields['structure_id'] == '') {
                    $active = ($fields['active']) ? 1 : 0;
                    $element = SystStructureObject::create([
                        'id_zone' => intval($fields['parent_id']),
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $active
                    ])->id;
                    $fields['structure_id'] = $element;
                }
                else {
                    SystStructureObject::find($fields['structure_id'])->update([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $fields['active']
                    ]);
                }
            }
            else {
                if ($fields['structure_id'] == null || $fields['structure_id'] == '') {
                    $active = ($fields['active']) ? 1 : 0;
                    $arr_parents = explode(' / ', $fields['parent_name']);
                    if (count($arr_parents) < 5 && strpos($fields['parent_name'], '...') === false) {
                        $element = SystStructurePart::create([
                            'id_object' => intval($fields['parent_id']),
                            'name' => $fields['structure_name'],
                            'abbr' => $fields['structure_abbr'],
                            'active' => $active
                        ])->id;
                    }
                    else {
                        $element = SystStructurePart::create([
                            'parent' => intval($fields['parent_id']),
                            'name' => $fields['structure_name'],
                            'abbr' => $fields['structure_abbr'],
                            'active' => $active
                        ])->id;
                    }
                    
                    $fields['structure_id'] = $element;
                }
                else {
                    SystStructurePart::find($fields['structure_id'])->update([
                        'name' => $fields['structure_name'],
                        'abbr' => $fields['structure_abbr'],
                        'active' => $fields['active']
                    ]);
                }
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }        

        $response = array('success' => true, 'fields' => $fields);
        return response()->json($response, 200);
    }

    // Delete structure
    public function deleteStructure(Request $request) {
        
        $fields = $request->all();

        try {
            if ($fields['node_type'] == 'pole') {
                if (SystStructureProject::where('id_pole', intval($fields['structure_id']))->exists()) {
                    $response = array('success' => false, 'error' => 'No se ha realizado la operación.<br>La estructura contiene dependencias.');
                    return response()->json($response, 200);
                }
                SystPole::find($fields['structure_id'])->delete();
            }
            elseif ($fields['node_type'] == 'project') {
                if (SystStructureZone::where('id_project', intval($fields['structure_id']))->exists()) {
                    $response = array('success' => false, 'error' => 'No se ha realizado la operación.<br>La estructura contiene dependencias.');
                    return response()->json($response, 200);
                }
                SystStructureProject::find($fields['structure_id'])->delete();
            }
            elseif ($fields['node_type'] == 'zone') {
                if (SystStructureObject::where('id_zone', intval($fields['structure_id']))->exists()) {
                    $response = array('success' => false, 'error' => 'No se ha realizado la operación.<br>La estructura contiene dependencias.');
                    return response()->json($response, 200);
                }
                SystStructureZone::find($fields['structure_id'])->delete();
            }
            elseif ($fields['node_type'] == 'object') {
                if (SystStructurePart::where('id_object', intval($fields['structure_id']))->exists()) {
                    $response = array('success' => false, 'error' => 'No se ha realizado la operación.<br>La estructura contiene dependencias.');
                    return response()->json($response, 200);
                }
                SystStructureObject::find($fields['structure_id'])->delete();
            }
            else {
                SystStructurePart::find($fields['structure_id'])->delete();
            }
        } catch (Throwable $th) {
            $response = array('success' => false, 'error' => $th->getMessage());
            return response()->json($response, 200);
        }

        $response = array('success' => true);
        return response()->json($response, 200);
    }
    
    // Get poles
    public function getPoles () {
        
        $poles = SystPole::where('active', 1)->get();

        $response = array(
            'success' => true,
            'poles' => $poles
        );
        return response()->json($response,200);
    }
}
