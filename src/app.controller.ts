import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Status Check' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is running successfully',
    schema: {
      type: 'string',
      example: 'Api is running!'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
