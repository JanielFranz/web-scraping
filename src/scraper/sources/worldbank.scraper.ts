import {Injectable} from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

interface WorldBankEntity {
    firmName: string;
    countryName: string;
    city: string;
    address: string;
    grounds: string;
    fromDate: string;
}

@Injectable()
export class WorldBankScraper {
    private readonly worldBankUrl = 'https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms';

    async search(name: string) {
        console.log('the name in world bank is:', name);
        try {
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null,
            });

            const page = await browser.newPage();
            await page.goto(this.worldBankUrl, { waitUntil: 'networkidle2' });
            await page.waitForSelector('input[id="category"]', { timeout: 20000 }).catch(() => {});

            await page.type('input[id="category"]', name, { delay: 100 });
            await page.keyboard.press('Enter');

            await page.waitForSelector('table', { visible: true, timeout: 30000 });

            await page.waitForSelector('div.k-grid-content.k-auto-scrollable table', { visible: true, timeout: 30000 });

            const tableHtml = await page.$eval('div.k-grid-content.k-auto-scrollable table', el => el.outerHTML);
            console.log('HTML de la tabla:', tableHtml);

        } catch (error) {
            console.error('Error fetching data from World Bank API:', error);
            return {message: 'Error fetching data from World Bank API'};
        }
    }

    private filterMatches(data: any[], name: string): any {

        if(!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [];
        }

        return data.filter(entity => {
            return entity.SUPP_NAME?.toLowerCase().includes(name.toLowerCase())
        })
    }

    private transformToEntity(data: any): WorldBankEntity {
        return {
            firmName: data.SUPP_NAME || '',
            countryName: data.COUNTRY_NAME || '',
            city: data.SUPP_CITY || '',
            address: data.SUPP_ADDR || '',
            grounds: data.DEBAR_REASON || '',
            fromDate: data.DEBAR_FROM_DATE || '',
        };
    }
}