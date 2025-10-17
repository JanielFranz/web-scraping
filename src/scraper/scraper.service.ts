import { Injectable } from '@nestjs/common';
import {WorldBankScraper} from "./sources/worldbank.scraper";
import {OfacScraper} from "./sources/ofac.scraper";

@Injectable()
export class ScraperService {
    constructor(
        private readonly worldBankScraper: WorldBankScraper,
        private readonly ofacScraper: OfacScraper
    ) {}

    async searchEntityInHighRiskList(name: string): Promise<any> {
        const [woldBankInformation, ofacInformation] = await Promise.all([
            this.worldBankScraper.search(name),
            this.ofacScraper.search(name)
        ])

        const allResults = [...(woldBankInformation.items ?? []), ...(ofacInformation.items ?? [])];        return {
            query: name,
            total_hits: allResults.length,
            results: {
                ofac: ofacInformation.items,
                worldBank: woldBankInformation.items,
            },
            sources: {
                    ofac: ofacInformation.count,
                    worldBank: woldBankInformation.count
            }
        }
    }
}
