import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { of } from 'rxjs';
import { EventsService } from 'src/events/events.service';
import { QueryDto } from 'src/fin-management-provider/dto/query.dto';
import { FinManagementProviderService } from 'src/fin-management-provider/fin-management-provider.service';
import { FormObject } from 'src/schemas/form-object.schema';
import { FormTemplate } from 'src/schemas/form-template.schema';
import { UserMeta } from 'src/schemas/user-meta.schema';
import formTemplates from 'src/templates/form-templates.json';
import { z, ZodType } from 'zod';

@Injectable()
export class FormsService implements OnModuleInit {
  constructor(
    private readonly eventService: EventsService,
    private readonly finManagementProviderService: FinManagementProviderService,
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
    @InjectModel(FormObject.name) private formObjectModel: Model<FormObject>,
    @InjectModel(UserMeta.name) private userMetaModel: Model<UserMeta>,
  ) {}

  async onModuleInit() {
    try {
      await this.formTemplateModel.create(formTemplates);
    } catch (error) {
      console.log('Form templates already created.');
    }
  }

  async getFormTemplate(templateName: string | null) {
    return this.formTemplateModel.find({ name: templateName }).exec();
  }

  async getFormTemplates() {
    return this.formTemplateModel.find().exec();
  }

  async getFormOptions(queryDto: QueryDto) {
    return await this.finManagementProviderService.getData(queryDto);
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

    const formValidator = await this.generateFormValidator(
      templateName,
      formTemplate.format,
    );

    const parseResult = await formValidator.safeParseAsync(formData);
    if (parseResult.success) {
      await this.submitForm(email, templateName, formData);
    } else {
      throw new BadRequestException(
        `Invalid form format: ${parseResult.error}`,
      );
    }
  }

  private async generateFormValidator(
    formTemplate: string,
    formFormat: object,
  ) {
    let formValidator = z.object({});
    let fieldValidator: ZodType;

    for (const [fieldName, fieldProperties] of Object(formFormat).entries()) {
      const { type: fieldType } = fieldProperties;

      let fieldOptions: any;
      if (fieldType === 'List') {
        const { options } = fieldProperties;
        if (options) {
          fieldOptions = options;
        } else {
          const queryDto: QueryDto = { name: formTemplate };
          fieldOptions =
            await this.finManagementProviderService.getData(queryDto);
        }
      }

      switch (fieldType) {
        case 'Number':
          fieldValidator = z.number().nonnegative();
          break;

        case 'String':
          fieldValidator = z.string();
          break;

        case 'List':
          fieldValidator = z.enum(fieldOptions);
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
    this.eventService.registerEvent('submit-form', of('Danger'));
    await this.formObjectModel.create({
      userMeta: foundUserMeta,
      formTemplate: foundFormTemplate,
      formData,
    });
  }
}
