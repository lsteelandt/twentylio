import { gql } from '@apollo/client';

export const GET_TIMELINE_ACTIVITIES_FROM_COMPANY_ID = gql`
  query GetTimelineActivitiesFromCompanyId(
    $companyId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineActivitiesFromCompanyId(
      companyId: $companyId
      page: $page
      pageSize: $pageSize
    ) {
      edges {
        node {
          id
          type
          body
          title
          createdAt
          updatedAt
          author {
            id
            firstName
            lastName
            avatarUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
