import { Module } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { ScraperModule } from './scraper/scraper.module';


@Module({
  imports: [ScraperModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
