package com.example.application.data;

import java.time.LocalDate;

import com.example.application.validators.CustomDateConstraint;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Todo extends AbstractEntity {

    private boolean done = false;

    @NotBlank
    @NotNull
    private String task;

    @NotBlank
    private String description;

    @Max(5)
    @Min(1)
    private Integer priority;

    @CustomDateConstraint
    private LocalDate deadline;

    @ManyToOne
    private Contact assigned;

    public Todo() {
    }

    public Todo(String task) {
        this.task = task;
    }

    /**
     * Copy constructor
     */
    public Todo(Todo other) {
        this.task = other.task;
        this.description = other.description;
        this.priority = other.priority;
        this.done = other.done;
        this.deadline = other.deadline;
        this.assigned = other.assigned;
    }

    /**
     * Copy all fields from other to this
     * 
     * @param other
     */
    public void from(Todo other) {
        this.task = other.task;
        this.description = other.description;
        this.priority = other.priority;
        this.done = other.done;
        this.deadline = other.deadline;
        this.assigned = other.assigned;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Contact getAssigned() {
        return assigned;
    }

    public void setAssigned(Contact assigned) {
        this.assigned = assigned;
    }
}