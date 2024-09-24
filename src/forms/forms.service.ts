import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormTemplate } from 'src/schemas/form-template.schema';
import templates from './form-templates.json';

@Injectable()
export class FormsService implements OnModuleInit {
  constructor(
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
  ) {}

  async onModuleInit() {
    this.formTemplateModel.create(templates);
  }

  async getFormTemplates(templateName: string) {
    return this.formTemplateModel.find({ name: templateName }).exec();
  }
}
