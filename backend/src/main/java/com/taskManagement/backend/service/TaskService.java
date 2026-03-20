package com.taskManagement.backend.service;

import com.taskManagement.backend.exception.ResourceNotFoundException;
import com.taskManagement.backend.model.Task;
import com.taskManagement.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Create task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Get by ID
    public Task getTaskById(int id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not exist with id :" + id));
    }

    // Update task
    public Task updateTask(int id, Task taskDetails) {
        Task task = getTaskById(id);

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());

        return taskRepository.save(task);
    }

    // Delete task
    public void deleteTask(int id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}