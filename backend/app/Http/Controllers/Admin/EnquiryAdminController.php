<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddAdminNoteRequest;
use App\Http\Requests\Admin\StatusUpdateRequest;
use App\Http\Resources\EnquiryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Enquiry;
use Illuminate\Http\Request;

class EnquiryAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Enquiry::query()
            ->with(['listing:id,title,slug', 'user:id,name,email'])
            ->withTrashed()
            ->when($request->filled('q'), fn ($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->string('q').'%')
                    ->orWhere('email', 'like', '%'.$request->string('q').'%')
                    ->orWhere('message', 'like', '%'.$request->string('q').'%');
            }))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('source'), fn ($q) => $q->where('source', $request->string('source')))
            ->latest();

        $enquiries = $query->paginate($request->integer('per_page', 15));

        return $this->success([
            'enquiries' => EnquiryResource::collection($enquiries->items()),
            'pagination' => [
                'current_page' => $enquiries->currentPage(),
                'last_page' => $enquiries->lastPage(),
                'per_page' => $enquiries->perPage(),
                'total' => $enquiries->total(),
            ],
        ], 'Enquiries retrieved successfully');
    }

    public function show(Enquiry $enquiry): \Illuminate\Http\JsonResponse
    {
        return $this->success(new EnquiryResource($enquiry->load(['listing:id,title,slug', 'user:id,name,email', 'notes.user'])), 'Enquiry retrieved successfully');
    }

    public function updateStatus(StatusUpdateRequest $request, Enquiry $enquiry): \Illuminate\Http\JsonResponse
    {
        $enquiry->update(['status' => $request->input('status')]);

        return $this->success(null, 'Enquiry status updated successfully');
    }

    public function addNote(AddAdminNoteRequest $request, Enquiry $enquiry): \Illuminate\Http\JsonResponse
    {
        $note = $enquiry->notes()->create([
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

    public function destroy(Enquiry $enquiry): \Illuminate\Http\JsonResponse
    {
        $enquiry->delete();

        return $this->success(null, 'Enquiry archived successfully');
    }

    public function restore(int $id): \Illuminate\Http\JsonResponse
    {
        $enquiry = Enquiry::onlyTrashed()->findOrFail($id);
        $enquiry->restore();

        return $this->success(null, 'Enquiry restored successfully');
    }

    public function forceDelete(int $id): \Illuminate\Http\JsonResponse
    {
        $enquiry = Enquiry::onlyTrashed()->withTrashed()->findOrFail($id);
        $enquiry->notes()->delete();
        $enquiry->forceDelete();

        return $this->success(null, 'Enquiry permanently deleted');
    }
}