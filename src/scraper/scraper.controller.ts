import {Controller, Get, Param, UsePipes, ValidationPipe, BadRequestException} from '@nestjs/common';
import {ScraperService} from "./scraper.service";
import {SearchEntityDto} from "./dto/search-entity.dto";

@Controller('api/v1/')
export class ScraperController {

    constructor(private readonly scraperService: ScraperService) {}

    @Get('entities/:name/risk-assessment')
    @UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
            const messages = errors.map(error =>
                Object.values(error.constraints || {}).join(', ')
            ).join('; ');
            throw new BadRequestException(`Validation failed: ${messages}`);
        }
    }))
    searchEntityInHighRiskList(@Param() params: SearchEntityDto) {
        return this.scraperService.searchEntityInHighRiskList(params.name);
    }
}
