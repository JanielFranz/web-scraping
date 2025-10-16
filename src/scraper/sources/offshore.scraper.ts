import {Injectable} from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";

@Injectable()
export class OffShoreScraper {
    private readonly offShoreUrl = 'https://offshoreleaks.icij.org'

    async search(name: string): Promise<any> {
        const queryUrl = `${this.offShoreUrl}/search?q=${name.replace(/ /g, "+")}`
        console.log(queryUrl)
        const { data } = await axios.get(this.offShoreUrl);
        console.log('data from offshore', data);
        const $ = cheerio.load(data);
    }
}