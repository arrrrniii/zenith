// graphql/queries.js
import { gql } from '@apollo/client';
import { SERVICE_FIELDS } from './fragments';

export const GET_SERVICES = gql`
  query GetServices($where: service_bool_exp = {}, $limit: Int = 50) {
    services(where: $where, order_by: { created_at: desc }, limit: $limit) {
      ...ServiceFields
    }
  }
  ${SERVICE_FIELDS}
`;