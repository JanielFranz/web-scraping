import {Injectable} from "@nestjs/common";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

interface WorldBankEntity {
    firmName: string;
    address: string;
    country: string;
    fromDate: string;
    toDate: string;
    grounds: string;
}

@Injectable()
export class WorldBankScraper {
    private readonly worldBankUrl = 'https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms';

    async search(name: string) {
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
            console.log(tableHtml);
            await browser.close();
            return this.transformHtmlToJson(tableHtml);

        } catch (error) {
            console.error('Error fetching data from World Bank API:', error);
            return {message: 'Error fetching data from World Bank API'};
        }
    }

    private transformHtmlToJson(html: string): WorldBankEntity[] {
        const $ = cheerio.load(html);
        const data: WorldBankEntity[]  = [];
        $('table[role="grid"] tbody tr').each((i, row) => {
            const cells = $(row).find('td');
            const rowData = {
                firmName: $(cells[0]).text().trim(),
                address: $(cells[2]).text().trim(),
                country: $(cells[3]).text().trim(),
                fromDate: $(cells[4]).text().trim(),
                toDate: $(cells[5]).text().trim(),
                grounds: $(cells[6]).text().trim(),
            };
            data.push(rowData);
        });
        console.log('Transformed World Bank Data:', data);
        return data;
    }
}