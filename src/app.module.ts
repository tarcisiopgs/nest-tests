import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [CoreModule, ResourcesModule],
})
export class AppModule {}
