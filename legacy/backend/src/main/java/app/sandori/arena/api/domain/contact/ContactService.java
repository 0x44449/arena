package app.sandori.arena.api.domain.contact;

import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ContactEntity> getContacts(String ownerId) {
        return contactRepository.findByOwnerIdAndDeletedAtIsNullOrderByCreatedAtDesc(ownerId);
    }

    @Transactional
    public ContactEntity createContact(String ownerId, String userId) {
        if (ownerId.equals(userId)) {
            throw new WellKnownException("INVALID_CONTACT", "Cannot add yourself as contact");
        }

        if (!userRepository.existsById(userId)) {
            throw new WellKnownException("USER_NOT_FOUND", "User not found");
        }

        contactRepository.findByOwnerIdAndUserId(ownerId, userId).ifPresent(existing -> {
            throw new WellKnownException("CONTACT_ALREADY_EXISTS", "Contact already exists");
        });

        ContactEntity contact = new ContactEntity(ownerId, userId);
        contactRepository.save(contact);

        return contactRepository.findByOwnerIdAndUserIdAndDeletedAtIsNull(ownerId, userId)
                .orElseThrow();
    }

    @Transactional
    public void deleteContact(String ownerId, String userId) {
        ContactEntity contact = contactRepository.findByOwnerIdAndUserId(ownerId, userId)
                .orElseThrow(() -> new WellKnownException("CONTACT_NOT_FOUND", "Contact not found"));

        contactRepository.delete(contact);
    }
}
