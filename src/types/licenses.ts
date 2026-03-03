export const IssueReason = {
  FirstTime: 1,
  Renew: 2,
  DamagedReplacement: 3,
  LostReplacement: 4,
} as const;

export type IssueReason = (typeof IssueReason)[keyof typeof IssueReason];

export interface License {
  licenseID: number;
  applicationID: number;
  driverID: number;
  licenseClassName: string;
  issueDate: string;
  expirationDate: string;
  isExpired: boolean;
  notes: string | null;
  paidFees: number;
  isActive: boolean;
  issueReasonText: string;
  createdByUserID: number;
  isDetained: boolean;
}

export interface DriverLicense {
  licenseClassName: string;
  driverFullName: string;
  licenseID: number;
  nationalNo: string;
  applicationID: number;
  gender: number;
  genderText: string;
  issueDate: string;
  issueReasonText: string;
  notes: string | null;
  isActive: boolean;
  driverBirthDate: string;
  driverID: number;
  expirationDate: string;
  isExpired: boolean;
  driverImageUrl: string | null;
  createdByUserID: number;
  isDetained: boolean;
}

export interface LicenseCreate {
  localDrivingLicenseApplicationID: number;
  notes?: string | null;
  issueReason: IssueReason | number;
}
