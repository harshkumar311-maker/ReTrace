package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ItemRequest;
import com.retrace.retrace_backend.dto.ItemResponse;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.entity.User;
import com.retrace.retrace_backend.exception.ItemNotFoundException;
import com.retrace.retrace_backend.repository.ItemRepository;
import com.retrace.retrace_backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ItemServiceImpl itemService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .role(User.Role.USER)
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        "test@example.com",
                        null,
                        Collections.emptyList()
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void creatingALostItemForcesReportTypeLostAndStatusActive() {

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));

        ItemRequest request = new ItemRequest();
        request.setCategory("Electronics");
        request.setSubcategory("Phone");
        request.setBrand("Apple");
        request.setModel("iPhone 15");
        request.setColor("Blue");
        request.setLocation("Library");
        request.setDescription(
                "Blue iPhone lost near the library entrance"
        );

        when(itemRepository.save(any(Item.class)))
                .thenAnswer(invocation -> {
                    Item toSave = invocation.getArgument(0);
                    toSave.setId(1L);
                    return toSave;
                });

        ItemResponse response =
                itemService.createItem(
                        request,
                        ReportType.LOST,
                        List.of()
                );

        ArgumentCaptor<Item> captor =
                ArgumentCaptor.forClass(Item.class);

        verify(itemRepository).save(captor.capture());

        assertThat(captor.getValue().getReportType())
                .isEqualTo(ReportType.LOST);

        assertThat(captor.getValue().getStatus())
                .isEqualTo(ItemStatus.ACTIVE);

        assertThat(response.getId())
                .isEqualTo(1L);

        assertThat(response.getCategory())
                .isEqualTo("Electronics");
    }

    @Test
    void creatingAFoundItemSetsReportTypeFound() {

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));

        ItemRequest request = new ItemRequest();
        request.setCategory("Bags");
        request.setSubcategory("Backpack");
        request.setLocation("Food Court");

        when(itemRepository.save(any(Item.class)))
                .thenAnswer(invocation -> {
                    Item toSave = invocation.getArgument(0);
                    toSave.setId(2L);
                    return toSave;
                });

        ItemResponse response =
                itemService.createItem(
                        request,
                        ReportType.FOUND,
                        List.of()
                );

        assertThat(response.getReportType())
                .isEqualTo(ReportType.FOUND);

        assertThat(response.getStatus())
                .isEqualTo(ItemStatus.ACTIVE);
    }

    @Test
    void getItemByIdReturnsTheStoredItem() {

        Item stored = Item.builder()
                .id(7L)
                .reportType(ReportType.LOST)
                .status(ItemStatus.ACTIVE)
                .category("Keys")
                .subcategory("Keychain")
                .location("Metro Station")
                .build();

        when(itemRepository.findById(7L))
                .thenReturn(Optional.of(stored));

        ItemResponse response =
                itemService.getItemById(7L);

        assertThat(response.getId())
                .isEqualTo(7L);

        assertThat(response.getCategory())
                .isEqualTo("Keys");
    }

    @Test
    void getItemByIdThrowsWhenIdDoesNotExist() {

        when(itemRepository.findById(404L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> itemService.getItemById(404L)
        )
                .isInstanceOf(ItemNotFoundException.class)
                .hasMessageContaining("404");
    }
}