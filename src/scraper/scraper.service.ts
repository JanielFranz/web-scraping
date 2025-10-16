import { Injectable } from '@nestjs/common';
import {WorldBankScraper} from "./sources/worldbank.scraper";

@Injectable()
export class ScraperService {
    constructor(
        private readonly worldBankScraper: WorldBankScraper
    ) {}

    async searchEntityInHighRiskList(name: string) {
        return this.worldBankScraper.search(name);
    }
}
