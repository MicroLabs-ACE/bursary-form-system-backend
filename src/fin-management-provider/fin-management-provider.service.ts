import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import formOptions from 'src/templates/form-options.json';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class FinManagementProviderService {
  constructor(private httpService: HttpService) {}

  async getData(queryDto: QueryDto) {
    const { name } = queryDto;
    if (name === 'objectCode') {
      return this.getObjectCodes(queryDto!.formTemplate);
    } else if (name === 'callCentre') {
      return this.getCallCentres();
    }
  }

  private async getObjectCodes(formTemplate: string) {
    return formOptions['ObjectCode'][formTemplate];
  }

  private async getCallCentres() {
    return formOptions['CallCentre'];
  }
}
