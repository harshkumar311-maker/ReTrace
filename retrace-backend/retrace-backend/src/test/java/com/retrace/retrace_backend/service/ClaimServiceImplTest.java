package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ClaimRequest;
import com.retrace.retrace_backend.dto.ClaimResponse;
import com.retrace.retrace_backend.entity.Claim;
import com.retrace.retrace_backend.entity.ClaimStatus;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.entity.User;
import com.retrace.retrace_backend.exception.ClaimNotFoundException;
import com.retrace.retrace_backend.exception.InvalidClaimStatusException;
import com.retrace.retrace_backend.exception.InvalidItemOperationException;
import com.retrace.retrace_backend.repository.ClaimRepository;
import com.retrace.retrace_backend.repository.ItemRepository;
import com.retrace.retrace_backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClaimServiceImplTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClaimServiceImpl claimService;

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

    private Item item(Long id, ReportType type) {
        return Item.builder()
                .id(id)
                .reportType(type)
                .status(ItemStatus.ACTIVE)
                .category("Electronics")
                .subcategory("Phone")
                .location("Library")
                .build();
    }

    @Test
    void createClaimSucceedsWhenLostAndFoundItemsAreValid() {

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));

        when(itemRepository.findById(1L))
                .thenReturn(
                        Optional.of(item(1L, ReportType.LOST))
                );

        when(itemRepository.findById(2L))
                .thenReturn(
                        Optional.of(item(2L, ReportType.FOUND))
                );

        when(claimRepository.save(any(Claim.class)))
                .thenAnswer(invocation -> {
                    Claim toSave = invocation.getArgument(0);
                    toSave.setId(10L);
                    return toSave;
                });

        ClaimRequest request = new ClaimRequest();

        request.setLostItemId(1L);
        request.setFoundItemId(2L);
        request.setClaimantName("Aarav Mehta");
        request.setClaimantEmail("aarav@example.com");
        request.setMessage("This is my phone.");

        ClaimResponse response =
                claimService.createClaim(request);

        assertThat(response.getId())
                .isEqualTo(10L);

        assertThat(response.getStatus())
                .isEqualTo(ClaimStatus.PENDING);
    }

    @Test
    void createClaimRejectsALostItemIdThatIsActuallyAFoundReport() {

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));

        when(itemRepository.findById(1L))
                .thenReturn(
                        Optional.of(item(1L, ReportType.FOUND))
                );

        when(itemRepository.findById(2L))
                .thenReturn(
                        Optional.of(item(2L, ReportType.FOUND))
                );

        ClaimRequest request = new ClaimRequest();

        request.setLostItemId(1L);
        request.setFoundItemId(2L);
        request.setClaimantName("Diya Kapoor");
        request.setClaimantEmail("diya@example.com");

        assertThatThrownBy(
                () -> claimService.createClaim(request)
        )
                .isInstanceOf(
                        InvalidItemOperationException.class
                );
    }

    @Test
    void getClaimByIdThrowsWhenClaimDoesNotExist() {

        when(claimRepository.findById(123L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> claimService.getClaimById(123L)
        )
                .isInstanceOf(
                        ClaimNotFoundException.class
                );
    }

    @Test
    void updateClaimStatusAcceptsAValidStatus() {

        Claim claim = Claim.builder()
                .id(5L)
                .lostItemId(1L)
                .foundItemId(2L)
                .claimantName("Rohan")
                .claimantEmail("rohan@example.com")
                .status(ClaimStatus.PENDING)
                .build();

        when(claimRepository.findById(5L))
                .thenReturn(Optional.of(claim));

        when(itemRepository.findById(1L))
                .thenReturn(
                        Optional.of(item(1L, ReportType.LOST))
                );

        when(itemRepository.findById(2L))
                .thenReturn(
                        Optional.of(item(2L, ReportType.FOUND))
                );

        when(claimRepository.save(any(Claim.class)))
                .thenAnswer(
                        invocation -> invocation.getArgument(0)
                );

        ClaimResponse response =
                claimService.updateClaimStatus(
                        5L,
                        "APPROVED"
                );

        assertThat(response.getStatus())
                .isEqualTo(ClaimStatus.APPROVED);
    }

    @Test
    void updateClaimStatusRejectsAnUnrecognisedStatusValue() {

        Claim claim = Claim.builder()
                .id(5L)
                .lostItemId(1L)
                .foundItemId(2L)
                .claimantName("Rohan")
                .claimantEmail("rohan@example.com")
                .status(ClaimStatus.PENDING)
                .build();

        when(claimRepository.findById(5L))
                .thenReturn(Optional.of(claim));

        assertThatThrownBy(
                () -> claimService.updateClaimStatus(
                        5L,
                        "DEFINITELY_NOT_A_STATUS"
                )
        )
                .isInstanceOf(
                        InvalidClaimStatusException.class
                );
    }
}