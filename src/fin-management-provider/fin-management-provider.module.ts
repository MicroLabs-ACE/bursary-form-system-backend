import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FinManagementProviderService } from './fin-management-provider.service';

@Module({
  imports: [HttpModule],
  providers: [FinManagementProviderService],
  exports: [FinManagementProviderService],
})
export class FinManagementProviderModule {}
