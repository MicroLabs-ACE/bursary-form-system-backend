import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import formOptions from 'src/templates/form-options.json';
import { Query } from './dto/query.dto';

@Injectable()
export class FinManagementProviderService {
  constructor(private httpService: HttpService) {}

  async getData(query: Query) {
    const { name } = query;
    if (name === 'objectCode') {
      return this.getObjectCodes(query!.formTemplate);
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
