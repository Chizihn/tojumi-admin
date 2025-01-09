import { gql } from "@apollo/client";

export const USER_DETAIL_FRAGMENT = gql`
  fragment UserDetail on User {
    id
    accountType
    address
    firstName
    city
    country
    dob
    email
    gender
    lastName
    latitude
    longitude
    paymentCurrency
    phoneNo
    state
    isApproved
  }
`;
