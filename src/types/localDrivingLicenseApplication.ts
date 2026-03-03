export interface LocalDrivingLicenseApplication {
  localDrivingLicenseApplicationID: number;
  applicationID: number;
  className: string;
  nationalNo: string;
  fullName: string;
  applicationDate: string;
  passedTestCount: number;
  status: string;
}

export interface LocalDrivingLicenseApplicationCreate {
  personID: number;
  licenseClassID: number;
  applicationTypeID: number;
}

export interface LocalDrivingLicenseApplicationUpdate {
  localDrivingLicenseApplicationID: number;
  licenseClassID: number;
}
