import {Injectable} from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";

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
            const cleanMatches = matches.map(match => this.transformToEntity(match));

            console.log(cleanMatches);

            return cleanMatches;
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