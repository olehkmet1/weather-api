import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiWeatherResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Weather data retrieved successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(model) },
          {
            properties: {
              source: {
                type: 'string',
                example: 'OpenWeatherMap',
              },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Validation failed' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'City not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'City not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    })
  );
};

export const ApiScaffoldResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Scaffold response (API key missing)',
      schema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            example: 'API key missing (scaffold)',
          },
          source: {
            type: 'string',
            example: 'OpenWeatherMap',
          },
        },
      },
    })
  );
}; 