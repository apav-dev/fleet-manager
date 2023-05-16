export type Subaccount = {
  subAccountId: string;
};

export type DeployStatus =
  | "rar_submitted"
  | "rar_submission_failure"
  | "rar_complete"
  | "rar_failure"
  | "deploy_failure"
  | "deploy_complete";

export interface SubAccountEntity {
  meta: {
    uuid: string;
    errors: string[];
  };
  response: {
    docs: {
      $key: {
        locale: string;
        primaryKey: string;
      };
      c_subAccounts: {
        name: string;
        partnerCustomerID: string;
        yextCustomerID: string;
      }[];
    }[];
    count: number;
  };
}
