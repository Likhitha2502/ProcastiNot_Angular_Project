package com.procastinot.repository;

import com.procastinot.entity.FocusTimer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FocusTimerRepository
        extends JpaRepository<FocusTimer, Long> {

    Optional<FocusTimer> findByUserEmail(String userEmail);
}