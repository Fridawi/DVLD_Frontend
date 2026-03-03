export interface InternationalLicense {
  internationalLicenseID: number;
  applicationID: number;
  driverID: number;
  issuedUsingLocalLicenseID: number;
  issueDate: string;
  expirationDate: string;
  isActive: boolean;
  createdByUserID: number;
}

export interface InternationalLicenseCreate {
  localLicenseID: number;
}

export interface EligibilityResponse {
  eligible: boolean;
  message: string;
}
