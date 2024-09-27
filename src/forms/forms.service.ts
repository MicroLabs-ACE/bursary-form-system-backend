import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import formTemplates from 'src/data/form-templates.json';
import { FormObject } from 'src/schemas/form-object.schema';
import { FormTemplate } from 'src/schemas/form-template.schema';
import { UserMeta } from 'src/schemas/user-meta.schema';
import { z, ZodType } from 'zod';

@Injectable()
export class FormsService implements OnModuleInit {
  constructor(
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
    @InjectModel(FormObject.name) private formObjectModel: Model<FormObject>,
    @InjectModel(UserMeta.name) private userMetaModel: Model<UserMeta>,
  ) {}

  async onModuleInit() {
    try {
      await this.formTemplateModel.create(formTemplates);
    } catch (error) {
      console.error(error);
    }
  }

  async getFormTemplates(templateName: string | null) {
    return this.formTemplateModel.find({ name: templateName }).exec();
  }

  async processForm(email: string, templateName: string, formData: object) {
    const formTemplate = await this.formTemplateModel
      .findOne({
        name: templateName,
      })
      .exec();

    if (!formTemplate) {
      throw new NotFoundException('Template does not exist');
    }

    const formValidator = await this.generateFormValidator(formTemplate.format);
    const parseResult = await formValidator.safeParseAsync(formData);
    if (parseResult.success) {
      await this.submitForm(email, templateName, formData);
    } else {
      throw new BadRequestException('Invalid form format');
    }
  }

  private async generateFormValidator(formFormat: object) {
    let formValidator = z.object({});
    let fieldValidator: ZodType;

    for (const [fieldName, fieldType] of Object(formFormat).entries()) {
      switch (fieldType) {
        case 'Number':
          fieldValidator = z.number().nonnegative();
          break;

        case 'String':
          fieldValidator = z.string();
          break;

        default:
          continue;
      }

      formValidator = formValidator.extend({ [fieldName]: fieldValidator });
    }

    return formValidator;
  }

  private async submitForm(
    email: string,
    templateName: string,
    formData: object,
  ) {
    const [foundUserMeta, foundFormTemplate] = await Promise.all([
      this.userMetaModel.findOne({ email }),
      this.formTemplateModel.findOne({
        name: templateName,
      }),
    ]);

    await this.formObjectModel.create({
      userMeta: foundUserMeta,
      formTemplate: foundFormTemplate,
      formData,
    });
  }
}
