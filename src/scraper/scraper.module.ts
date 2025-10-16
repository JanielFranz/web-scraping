import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import {ScraperService} from "./scraper.service";
import {WorldBankScraper} from "./sources/worldbank.scraper";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [ScraperController],
  providers: [ScraperService, WorldBankScraper],
})
export class ScraperModule {}
