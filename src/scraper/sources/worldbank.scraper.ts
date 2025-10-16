import {Injectable} from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";

interface WorldBankEntity {
    SUPP_NAME: string;
    COUNTRY_NAME: string;
    SUPP_CITY: string;
    SUPP_ADDR: string;
    DEBAR_REASON: string;
    DEBAR_FROM_DATE: string;
}

@Injectable()
export class WorldBankScraper {
    private readonly apiUrl = 'https://apigwext.worldbank.org/dvsvc/v1.0/json/APPLICATION/ADOBE_EXPRNCE_MGR/FIRM/SANCTIONED_FIRM';
    private readonly apiKey = 'z9duUaFUiEUYSHs97CU38fcZO7ipOPvm';

    async search(name: string) {
        try {
            const {data} = await axios.get(this.apiUrl, {
                headers: {
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            const dataArray = data.response.ZPROCSUPP
            const matches = this.filterMatches(dataArray, name);
            console.log(matches);

            return {message: `Searching for high-risk entity: ${name}`};
        } catch (error) {
            console.error('Error fetching data from World Bank API:', error);
            return {message: 'Error fetching data from World Bank API'};
        }
    }

    private filterMatches(data: any[], name: string): WorldBankEntity[] {

        if(!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [];
        }

        return data.filter(entity => {
            return entity.SUPP_NAME?.toLowerCase().includes(name.toLowerCase())
        })
    }
}