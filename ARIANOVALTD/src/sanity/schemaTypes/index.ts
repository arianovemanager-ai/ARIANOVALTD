import { type SchemaTypeDefinition } from 'sanity'
import { wineType } from './wineType'
import { userType } from './userType'
import { orderType } from './orderType'
import { sessionRecordType } from './sessionRecordType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [wineType, userType, orderType, sessionRecordType],
}
