import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

interface OfacEntity {
    id: number;
    name: string;
    type: string;
    programs: string;
    sourceList: string;
    address: string;
}

interface Result {
    count: number;
    items: OfacEntity[];
}

@Injectable()
export class OfacScraper {
    private readonly searchUrl = 'https://sanctionssearch.ofac.treas.gov/';

    async search(name: string): Promise<Result> {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = await browser.newPage();

        try {
            await page.goto(this.searchUrl, { waitUntil: 'networkidle2' });

            await page.type('#ctl00_MainContent_txtLastName', name);
            await page.click('#ctl00_MainContent_btnSearch');

            const resultsSelector = '#gvSearchResults';
            await page.waitForSelector(`${resultsSelector}`, { visible: true, timeout: 10000 });

            const resultsHandle = await page.$(resultsSelector);
            if (!resultsHandle) {
                console.log('No results panel found.');
                await browser.close();
                return { count: 0, items: [] };
            }

            const resultsHtml = await page.$eval('#ctl00_MainContent_pnlResults', el => el.outerHTML);
            await browser.close();

            return this.transformHtmlToJson(resultsHtml);
        } catch (error) {
            console.log('Error fetching data from World Bank API:', error);
            await browser.close();
            return { count: 0, items: [] };
        }
    }

    private transformHtmlToJson(html: string): Result {
        const $ = cheerio.load(html);
        const data: OfacEntity[] = [];

        // Selecciona las filas de la tabla de resultados por su ID
        $('#gvSearchResults tbody tr').each((index, element) => {
            const cells = $(element).find('td');
            if (cells.length > 0) {
                const name = $(cells[0]).text().trim();
                const address = $(cells[1]).text().trim();
                const type = $(cells[2]).text().trim();
                const programs = $(cells[3]).text().trim();
                const sourceList = $(cells[4]).text().trim();


                data.push({
                    id: index, // Usando el índice como ID temporal
                    name,
                    type,
                    programs,
                    sourceList,
                    address,
                });
            }
        });
        return { count: data.length, items: data};
    }
}
