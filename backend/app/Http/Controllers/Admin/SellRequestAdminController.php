<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddAdminNoteRequest;
use App\Http\Requests\Admin\StatusUpdateRequest;
use App\Http\Resources\SellRequestResource;
use App\Http\Responses\ApiResponse;
use App\Models\SellRequest;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class SellRequestAdminController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FileUploadService $files,
    ) {}

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = SellRequest::query()
            ->with(['category', 'user:id,name,email'])
            ->withTrashed()
            ->when($request->filled('q'), fn ($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->string('q').'%')
                    ->orWhere('item_title', 'like', '%'.$request->string('q').'%')
                    ->orWhere('email', 'like', '%'.$request->string('q').'%');
            }))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('listing_type'), fn ($q) => $q->where('listing_type', $request->string('listing_type')))
            ->latest();

        $items = $query->paginate($request->integer('per_page', 15));

        return $this->success([
            'submissions' => SellRequestResource::collection($items->items()),
            'pagination' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ], 'Sell requests retrieved successfully');
    }

    public function show(SellRequest $sellRequest): \Illuminate\Http\JsonResponse
    {
        return $this->success(new SellRequestResource($sellRequest->load(['images', 'category', 'user:id,name,email', 'notes.user'])), 'Sell request retrieved successfully');
    }

    public function updateStatus(StatusUpdateRequest $request, SellRequest $sellRequest): \Illuminate\Http\JsonResponse
    {
        $sellRequest->update(['status' => $request->input('status')]);

        return $this->success(null, 'Sell request status updated successfully');
    }

    public function addNote(AddAdminNoteRequest $request, SellRequest $sellRequest): \Illuminate\Http\JsonResponse
    {
        $note = $sellRequest->notes()->create([
            'user_id' => $request->user()->id,
            'body' => $request->input('body'),
        ]);

        return $this->created([
            'id' => $note->id,
            'body' => $note->body,
            'user' => $request->user()->name,
            'created_at' => $note->created_at->toISOString(),
        ], 'Internal note added');
    }

    public function destroy(SellRequest $sellRequest): \Illuminate\Http\JsonResponse
    {
        foreach ($sellRequest->images as $image) {
            $this->files->deleteImage($image->path);
        }
        $sellRequest->delete();

        return $this->success(null, 'Sell request deleted successfully');
    }
}