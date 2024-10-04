import { Module } from '@nestjs/common';
import { FinManagementProviderService } from './fin-management-provider.service';

@Module({
  providers: [FinManagementProviderService],
})
export class FinManagementProviderModule {}
