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
            $query = Task::with(['assignedUser', 'creator']);

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by priority
            if ($request->has('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            // Filter by assigned user
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
            $task = Task::with(['assignedUser', 'creator'])->findOrFail($id);
            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Task not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed,cancelled',
                'priority' => 'nullable|in:low,medium,high,urgent',
                'assigned_to' => 'nullable|exists:users,id',
                'due_date' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);

            // If status changed to completed, set completed_at
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
    public function destroy($id)
    {
        try {
            $task = Task::findOrFail($id);
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
