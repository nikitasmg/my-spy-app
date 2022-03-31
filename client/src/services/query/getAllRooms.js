import { gql } from '@apollo/client';

export const GET_ALL_ROOMS = gql`
  query getRooms {
    rooms {
      title
      id 
      createdBy
      players {
        id,username
      }
  }
}
`;