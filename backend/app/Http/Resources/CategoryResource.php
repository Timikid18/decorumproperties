<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'image' => $this->image ? asset('storage/'.$this->image) : null,
            'type' => $this->type,
            'description' => $this->description,
            'is_featured' => $this->is_featured,
            'group' => $this->whenLoaded('group', fn () => [
                'id' => $this->group->id,
                'name' => $this->group->name,
                'slug' => $this->group->slug,
                'icon' => $this->group->icon,
            ]),
            'children' => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}