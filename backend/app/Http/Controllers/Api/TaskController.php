<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Get task statistics
     */
    public function getStats()
    {
        try {
            $totalTasks = Task::count();
            $inProgress = Task::where('status', 'in_progress')->count();
            $completed = Task::where('status', 'completed')->count();
            $overdue = Task::where('due_date', '<', now())
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->count();

            return response()->json([
                'totalTasks' => $totalTasks,
                'inProgress' => $inProgress,
                'completed' => $completed,
                'overdue' => $overdue,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch task stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of tasks
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $query = Task::with(['assignedUser', 'creator']);

            // SECURITY SCOPE: Non-admins can only see tasks assigned to them or created by them
            // Assuming 'super_admin' and 'admin' roles have full view
            if (!$user->roles->contains(fn($r) => in_array($r->name, ['super_admin', 'admin']))) {
                $query->where(function($q) use ($user) {
                    $q->where('assigned_to', $user->id)
                      ->orWhere('created_by', $user->id);
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by priority
            if ($request->has('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            // Filter by assigned user (Only relevant for admins, regular users are already scoped)
            if ($request->has('assigned_to')) {
                $query->where('assigned_to', $request->assigned_to);
            }

            // Search
            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $tasks = $query->get();

            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch tasks',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed,cancelled',
                'priority' => 'nullable|in:low,medium,high,urgent',
                'assigned_to' => 'nullable|exists:users,id',
                'due_date' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);

            $validated['created_by'] = Auth::id();

            $task = Task::create($validated);
            $task->load(['assignedUser', 'creator']);

            return response()->json($task, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create task',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified task
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            $task = Task::with(['assignedUser', 'creator'])->findOrFail($id);

            // SECURITY CHECK
            if (!$user->roles->contains(fn($r) => in_array($r->name, ['super_admin', 'admin']))) {
                if ($task->assigned_to !== $user->id && $task->created_by !== $user->id) {
                    return response()->json(['error' => 'Unauthorized access to this task'], 403);
                }
            }

            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $task = Task::findOrFail($id);
            
            $isAdmin = $user->roles->contains(fn($r) => in_array($r->name, ['super_admin', 'admin']));
            $isCreator = $task->created_by === $user->id;
            $isAssignee = $task->assigned_to === $user->id;

            // 1. Authorization Check
            if (!$isAdmin && !$isCreator && !$isAssignee) {
                return response()->json(['error' => 'Unauthorized action'], 403);
            }

            // 2. Field Restriction Logic
            // If user is ONLY Assignee (not Admin/Creator), restrict fields
            if ($isAssignee && !$isAdmin && !$isCreator) {
                // Assignee can only update status, notes, priority (maybe)
                $allowedFields = ['status', 'notes', 'priority']; 
                $requestData = $request->only($allowedFields);
                
                // If they try to touch other fields, ignore them or error? Ignore is safer.
                // But we must validate status inputs
            } else {
                // Admin/Creator can update all
                $requestData = $request->all();
            }

            $rules = [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed,cancelled',
                'priority' => 'nullable|in:low,medium,high,urgent',
                'assigned_to' => 'nullable|exists:users,id',
                'due_date' => 'nullable|date',
                'notes' => 'nullable|string',
            ];

            // Validate ONLY the allowed data
            $validator = \Illuminate\Support\Facades\Validator::make($requestData, $rules);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422); 
            }
            
            $validated = $validator->validated();

            // Set completed_at if status changes to completed
            if (isset($validated['status']) && $validated['status'] === 'completed' && $task->status !== 'completed') {
                $validated['completed_at'] = now();
            }

            $task->update($validated);
            $task->load(['assignedUser', 'creator']);

            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update task',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified task
     */
    /**
     * Remove the specified task
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $task = Task::findOrFail($id);

            // SECURITY CHECK: Only Admins or Creator can delete? usually Creator only or Admin.
            // Assignee generally shouldn't delete tasks assigned to them, only mark as done.
            // Let's allow Creator and Admin.
            $isAdmin = $user->roles->contains(fn($r) => in_array($r->name, ['super_admin', 'admin']));
            
            if (!$isAdmin && $task->created_by !== $user->id) {
                 return response()->json(['error' => 'Unauthorized deletion'], 403);
            }

            $task->delete();

            return response()->json(['message' => 'Task deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete task',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
