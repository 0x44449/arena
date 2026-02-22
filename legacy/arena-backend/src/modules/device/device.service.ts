import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { RegisterDeviceDto } from './dtos/register-device.dto';
import { UnregisterDeviceDto } from './dtos/unregister-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<void> {
    // upsert: 같은 deviceId가 있으면 업데이트, 없으면 생성
    await this.deviceRepository.save({
      deviceId: dto.deviceId,
      userId,
      fcmToken: dto.fcmToken,
      platform: dto.platform,
      deviceModel: dto.deviceModel ?? null,
      osVersion: dto.osVersion ?? null,
    });
  }

  async unregisterDevice(dto: UnregisterDeviceDto): Promise<void> {
    await this.deviceRepository.softDelete({ deviceId: dto.deviceId });
  }
}
