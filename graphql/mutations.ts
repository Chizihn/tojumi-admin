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
  mutation ApproveCarebusiness($id: ID!) {
    approveCareBusiness(id: $id) {
      id
      isApproved
    }
  }
`;

export const REJECT_CAREBUSINESS = gql`
  mutation RejectCarebusiness($id: ID!) {
    rejectCareBusiness(id: $id) {
      id
      isApproved
    }
  }
`;

export const APPROVE_STUDENT = gql`
  mutation ApproveStudent($id: ID!, $level: Levels!) {
    approveStudent(id: $id, level: $level) {
      id
      level
      isApproved
    }
  }
`;

export const REJECT_STUDENT = gql`
  mutation RejectStudent($id: ID!) {
    rejectCareBusiness(id: $id) {
      id
      isApproved
    }
  }
`;

export const APPROVE_CAREHOME = gql`
  mutation ApproveCarehome($careHomeId: ID!) {
    approveCareHome(careHomeId: $careHomeId) {
      id
      isApproved
    }
  }
`;
export const REJECT_CAREHOME = gql`
  mutation RejectCarehome($careHomeId: ID!) {
    rejectCareHome(careHomeId: $careHomeId) {
      id
      isApproved
    }
  }
`;

export const ACCEPT_GUARANTOR = gql`
  mutation AcceptGuarantor($id: ID!) {
    acceptGuarantor(id: $id)
  }
`;

export const REJECT_GUARANTOR = gql`
  mutation RejectGuarantor($id: ID!) {
    rejectGuarantor(id: $id)
  }
`;
