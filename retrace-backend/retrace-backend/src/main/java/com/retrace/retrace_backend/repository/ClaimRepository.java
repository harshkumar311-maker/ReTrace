package com.retrace.retrace_backend.repository;

import com.retrace.retrace_backend.entity.Claim;
import com.retrace.retrace_backend.entity.ClaimStatus;
import com.retrace.retrace_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByOwner(User owner);

    List<Claim> findByOwnerAndStatus(
            User owner,
            ClaimStatus status
    );

    long countByStatus(ClaimStatus status);
}