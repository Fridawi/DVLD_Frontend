export interface Application {
  applicationID: number;
  applicantPersonID: number;
  applicantFullName: string;
  applicationDate: string;
  applicationTypeID: number;
  applicationTypeTitle: string;
  applicationStatus: number;
  statusText: string;
  lastStatusDate: string;
  paidFees: number;
  createdByUserID: number;
  createdByUserName: string;
}
