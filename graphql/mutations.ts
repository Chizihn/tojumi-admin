import { gql } from "@apollo/client";
import { USER_DETAIL_FRAGMENT } from "./fragments";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserDetail
      }
    }
  }
  ${USER_DETAIL_FRAGMENT}
`;
