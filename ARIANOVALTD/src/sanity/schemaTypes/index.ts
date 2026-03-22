import { type SchemaTypeDefinition } from 'sanity';
import { userType } from './userType';
import { wineType } from './wineType';
import { orderType } from './orderType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, wineType, orderType],
};
