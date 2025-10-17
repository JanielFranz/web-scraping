import { Module } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { ScraperModule } from './scraper/scraper.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';


@Module({
  imports: [
    ScraperModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
