import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import formTemplates from 'src/data/form-templates.json';
import { FormTemplate } from 'src/schemas/form-template.schema';
import { z, ZodError, ZodType } from 'zod';

@Injectable()
export class FormsService implements OnModuleInit {
  constructor(
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
    @InjectConnection() private connection: Connection,
  ) {}

  async onModuleInit() {
    this.formTemplateModel.create(formTemplates);
  }

  async getFormTemplates(templateName: string | null) {
    return this.formTemplateModel.find({ name: templateName }).exec();
  }

  async processForm(templateName: string, formObject: Record<string, string>) {
    const formTemplate = await this.formTemplateModel.findOne({
      name: templateName,
    });
    if (!formTemplate) {
      throw new NotFoundException('Template does not exist');
    }

    const formValidator = await this.generateFormValidator(formTemplate.schema);
    type FormType = z.infer<typeof formValidator>;

    try {
      const validatedFormObject: FormType =
        await formValidator.parseAsync(formObject);
      await this.submitForm(templateName, validatedFormObject);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  private async generateFormValidator(formSchema: object) {
    let formValidator = z.object({});
    let fieldValidator: ZodType;

    for (const [fieldName, fieldType] of Object.entries(formSchema)) {
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

  private async submitForm(templateName: string, formObject: object) {
    const formCollection = this.connection.collection(templateName);
    await formCollection.insertOne(formObject);
  }
}
