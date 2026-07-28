    package com.procastinot.service.impl;

    import com.procastinot.entity.Task;
    import com.procastinot.exception.BadRequestException;
    import com.procastinot.repository.TaskRepository;
    import com.procastinot.service.TaskService;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    public class TaskServiceImpl implements TaskService {

        private final TaskRepository taskRepository;

        public TaskServiceImpl(TaskRepository taskRepository) {
            this.taskRepository = taskRepository;
        }

        @Override
        public Task createTask(Task task) {
            return taskRepository.save(task);
        }

        @Override
        public List<Task> getTasks(String email) {
            return taskRepository.findByUserEmail(email);
        }

        @Override
        public Task getTask(Long id, String email) {
            return taskRepository.findByIdAndUserEmail(id, email)
                    .orElseThrow(() -> new BadRequestException("Task not found"));
        }

        @Override
        public Task updateTask(Long id, Task updated, String email) {
            Task existing = taskRepository.findByIdAndUserEmail(id, email)
                    .orElseThrow(() -> new BadRequestException("Task not found"));

            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setPriority(updated.getPriority());
            existing.setStatus(updated.getStatus());
            existing.setDueDate(updated.getDueDate());

            return taskRepository.save(existing);
        }

        @Override
        public void deleteTask(Long id, String email) {
            Task existing = taskRepository.findByIdAndUserEmail(id, email)
                    .orElseThrow(() -> new BadRequestException("Task not found"));

            taskRepository.delete(existing);
        }
    }