import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AudioTranslationService {
  private readonly logger = new Logger(AudioTranslationService.name);

  /**
   * Every hour at the start of the 45th minute.
   */
  @Cron('0 45 * * * *', {
    name: 'Test Every 45 Minutes',
  })
  handleCron() {
    this.logger.debug('Called when the current minute is 45');
  }

  /**
   * Called every 12 hours.
   */
  @Cron(CronExpression.EVERY_12_HOURS, {
    name: 'Test every 12 Hours',
  })
  handleCron12() {
    this.logger.debug('Called every 12 hours.');
  }
}
