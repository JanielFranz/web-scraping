import {Controller, Get, Param} from '@nestjs/common';
import {ScraperService} from "./scraper.service";

@Controller('api/v1/')
export class ScraperController {

    constructor(private readonly scraperService: ScraperService) {}

    @Get('entities/:name/risk-assessment')
    searchEntityInHighRiskList(@Param('name') name: string) {
        //return this.scraperService.searchEntityInHighRiskList(name);
        return "Hola"
    }
}
