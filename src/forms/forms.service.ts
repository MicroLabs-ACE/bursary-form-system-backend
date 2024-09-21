import { Injectable } from '@nestjs/common';
import templates from './templates.json';

@Injectable()
export class FormsService {
  async getFormTemplates() {
    return Object.keys(templates);
  }

  async getFormTemplate(template: string) {
    return templates[template];
  }
}
