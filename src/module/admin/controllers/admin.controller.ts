import { Controller, Get, HttpStatus, Response, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CountryResponseDto, CountryService } from 'src/module/countryApi';
import { ResponseFormat } from 'src/shared';
import { AccessTokenGuard } from 'src/shared/guards';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth('JWT')
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly countryService: CountryService) {}

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [CountryResponseDto],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({
    summary: 'Retrieve all countries from the API, store them persistently in the database, and cache them in Redis for future requests',
  })
  @Get('initialize-countries')
  async initializeCountries(@Response() res): Promise<ResponseFormat> {
    const countries = await this.countryService.initializeCountries();
    return ResponseFormat.successResponse(
      res,
      countries,
      'Countries fetched Successfully',
      HttpStatus.OK,
    );
  }
}
