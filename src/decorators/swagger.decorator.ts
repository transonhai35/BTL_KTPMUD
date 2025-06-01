import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse as ApiOkResponseBase, getSchemaPath } from '@nestjs/swagger';

import { PageDto } from '@/common/dto/page.dto';

export function ApiPageOkResponse<T extends Type>(options: {
  type: T;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiExtraModels(options.type),
    ApiOkResponseBase({
      description: options.description,
      schema: {
        properties: {
          success: {
            type: 'boolean',
            default: true
          },
          statusCode: {
            type: 'number',
            default: 200
          },
          message: {
            type: 'string',
            default: 'Success'
          },
          data: {
            allOf: [
              { $ref: getSchemaPath(PageDto) },
              {
                properties: {
                  total: {
                    type: 'number'
                  },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(options.type) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
}

export function ApiOkResponse<T extends Type>(options: {
  type: T;
  description?: string;
  isArray?: boolean;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponseBase({
      description: options.description,
      schema: {
        properties: {
          success: {
            type: 'boolean',
            default: true
          },
          statusCode: {
            type: 'number',
            default: 200
          },
          message: {
            type: 'string',
            default: 'Success'
          },
          data: options.isArray ? {
            type: 'array',
            items: {
              $ref: getSchemaPath(options.type)
            }
          } : {
            $ref: getSchemaPath(options.type)
          },
        },
      },
    }),
  );
}