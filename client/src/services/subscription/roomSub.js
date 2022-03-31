import { gql } from '@apollo/client';

export const ROOM_SUBSCRIPTION = gql`
    subscription RoomCreated {
        roomCreated {
            title
            id
            createdBy
            players {
                id
                username
            }
        }
    }
`;

