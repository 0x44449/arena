import { Global, Module } from '@nestjs/common';
import { Signal } from './signal';

@Global()
@Module({
  providers: [Signal],
  exports: [Signal],
})
export class SignalModule {}
