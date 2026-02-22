package app.sandori.arena.api.domain.contact;

import app.sandori.arena.api.domain.contact.dtos.ContactResponse;
import app.sandori.arena.api.domain.contact.dtos.CreateContactRequest;
import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.global.dto.ApiResult;
import app.sandori.arena.api.global.dto.ListApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "contacts")
@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    @RequireSession
    @Operation(summary = "내 연락처 목록 조회", operationId = "getContacts")
    public ListApiResult<ContactResponse> getContacts(@CurrentUser CachedUser user) {
        List<ContactEntity> contacts = contactService.getContacts(user.userId());
        return ListApiResult.of(contacts.stream().map(ContactResponse::from).toList());
    }

    @PostMapping
    @RequireSession
    @Operation(summary = "연락처 추가", operationId = "createContact")
    public SingleApiResult<ContactResponse> createContact(
            @CurrentUser CachedUser user,
            @RequestBody CreateContactRequest request) {
        ContactEntity contact = contactService.createContact(user.userId(), request.getUserId());
        return SingleApiResult.of(ContactResponse.from(contact));
    }

    @DeleteMapping("{userId}")
    @RequireSession
    @Operation(summary = "연락처 삭제", operationId = "deleteContact")
    public ApiResult deleteContact(
            @CurrentUser CachedUser user,
            @PathVariable String userId) {
        contactService.deleteContact(user.userId(), userId);
        return ApiResult.success();
    }
}
