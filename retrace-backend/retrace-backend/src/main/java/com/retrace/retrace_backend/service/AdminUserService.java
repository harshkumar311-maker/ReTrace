package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.AdminUserResponse;
import com.retrace.retrace_backend.entity.User;
import com.retrace.retrace_backend.repository.ItemRepository;
import com.retrace.retrace_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public AdminUserService(
            UserRepository userRepository,
            ItemRepository itemRepository
    ) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public List<AdminUserResponse> getAllUsers() {

        List<?> allItems = itemRepository.findAll();

        return userRepository.findAll()
                .stream()
                .map(user -> {

                    long reportCount = allItems.stream()
                            .filter(item -> {
                                try {
                                    Object owner =
                                            ((com.retrace.retrace_backend.entity.Item) item).getOwner();

                                    return owner != null
                                            && ((User) owner).getId().equals(user.getId());
                                } catch (Exception ex) {
                                    return false;
                                }
                            })
                            .count();

                    return new AdminUserResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            reportCount,
                            "Active",
                            user.getRole().name()
                    );
                })
                .toList();
    }
}