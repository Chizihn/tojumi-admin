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

export const APPROVE_CAREBUSINESS = gql`
  mutation ApproveCareBusiness($id: ID!) {
    approveCareBusiness(id: $id) {
      isApproved
    }
  }
`;

export const APPROVE_STUDENT = gql`
  mutation ApproveStudent($id: ID!) {
    approveStudent(id: $id) {
      isApproved
    }
  }
`;
