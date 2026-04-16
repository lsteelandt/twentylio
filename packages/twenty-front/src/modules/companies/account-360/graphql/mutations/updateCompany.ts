import { gql } from '@apollo/client';

export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      id
      name
      domainName {
        primaryLinkUrl
        primaryLinkLabel
      }
      employees
      annualRecurringRevenue {
        amountMicros
        currencyCode
      }
      linkedinLink {
        primaryLinkUrl
        primaryLinkLabel
      }
      address {
        addressStreet1
        addressCity
        addressState
        addressCountry
      }
      createdAt
      updatedAt
    }
  }
`;