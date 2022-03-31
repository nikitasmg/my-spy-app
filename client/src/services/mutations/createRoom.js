import { gql } from '@apollo/client';

export const CREATE_ROOM = gql`
    mutation addRoom($input: RoomInput!) {
        createRoom(input: $input) {
            title
        }
    }
`;

