<?php

namespace App\Services;

use App\Models\SystStructurePart;
use Illuminate\Support\Str;

class TreeService 
{
    public function getStructuresViewSubparts($parent_id, $parent_name) {
        $html = "<ul id='ul-pt". $parent_id ."'>";
        $structures = SystStructurePart::where('parent', $parent_id)->orderBy('node_order', 'ASC')->get();
        foreach ($structures as $structure) {
            $id_structure = intval($structure->id);

            $node_type        = 'Part';
            $nodeparent_id    = $parent_id;
            $nodeparent_name  = '... ' . $parent_name;
            $structure_id     = $id_structure;
            $structure_name   = $structure->name;
            $structure_abbr   = $structure->abbr;
            $structure_active = $structure->active;

            $html .= "<li id='pt". $id_structure ."'>
                <a href='javascript:void(0);'
                    v-on:click='setDataForm(`$node_type`, $nodeparent_id, `$nodeparent_name`, $structure_id, `$structure_name`, `$structure_abbr`, $structure_active)'>
                    <i class='mdi mdi-adjust mdi-18px mr-2'></i>". $structure->name ."
                </a>";

                if (SystStructurePart::where('parent', $id_structure)->exists()) {
                    $this->getStructuresViewSubparts($id_structure, $structure->name);
                }
                
            $html .= "</li>";
        }

        $html .= "</ul>";
        return $html;
    }
}