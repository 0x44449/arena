import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContactEntity } from "src/entities/contact.entity";
import { UserEntity } from "src/entities/user.entity";
import { WellKnownException } from "src/exceptions/well-known-exception";

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getContacts(ownerId: string): Promise<ContactEntity[]> {
    return this.contactRepository.find({
      where: { ownerId },
      relations: ["user", "user.avatar"],
      order: { createdAt: "DESC" },
    });
  }

  async createContact(ownerId: string, userId: string): Promise<ContactEntity> {
    // 자기 자신 추가 불가
    if (ownerId === userId) {
      throw new WellKnownException({
        message: "Cannot add yourself as contact",
        errorCode: "INVALID_CONTACT",
      });
    }

    // 대상 유저 존재 확인
    const targetUser = await this.userRepository.findOne({
      where: { userId },
    });
    if (!targetUser) {
      throw new WellKnownException({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // 이미 추가된 연락처인지 확인
    const existing = await this.contactRepository.findOne({
      where: { ownerId, userId },
    });
    if (existing) {
      throw new WellKnownException({
        message: "Contact already exists",
        errorCode: "CONTACT_ALREADY_EXISTS",
      });
    }

    const contact = this.contactRepository.create({
      ownerId,
      userId,
    });
    await this.contactRepository.save(contact);

    // user relation 로드해서 반환
    const contactWithUser = await this.contactRepository.findOne({
      where: { ownerId, userId },
      relations: ["user", "user.avatar"],
    });

    return contactWithUser!;
  }

  async deleteContact(ownerId: string, userId: string): Promise<void> {
    const contact = await this.contactRepository.findOne({
      where: { ownerId, userId },
    });
    if (!contact) {
      throw new WellKnownException({
        message: "Contact not found",
        errorCode: "CONTACT_NOT_FOUND",
      });
    }

    await this.contactRepository.remove(contact);
  }
}
