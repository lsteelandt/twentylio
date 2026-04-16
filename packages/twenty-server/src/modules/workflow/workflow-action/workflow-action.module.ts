import { Module } from '@nestjs/common';

import { EnrichCompany360Resolver } from './resolvers/enrich-company-360.resolver';
import { RecordCrudModule } from 'src/engine/core-modules/record-crud/record-crud.module';

@Module({
  imports: [RecordCrudModule],
  providers: [EnrichCompany360Resolver],
})
export class WorkflowActionModule {}
