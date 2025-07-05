import { gql } from "@apollo/client";

export const USER_ACCNT_UPDATE = gql`
    mutation UserAccountUpdate($firstName: String!, $lastName: String!, $phoneNumber: String!, $country: String!){
        userAccountUpdate(firstName: $firstName, lastName: $lastName, country: $country, phoneNumber: $phoneNumber){
            statusCode,
            code,
            success,
            message,
            data{
                error,
                null
            }
        }
    }
`;
