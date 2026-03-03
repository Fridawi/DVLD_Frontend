export interface DetainedLicense {
  detainID: number;
  licenseID: number;
  detainDate: string;
  fineFees: number;
  isReleased: boolean;
  nationalNo: string;
  createdByUserName: string;
  createdByUserID: number;
  releaseDate?: string | null;
  releasedByUserName?: string | null;
  releasedByUserID?: number | null;
  releaseApplicationID?: number | null;
}

export interface DetainLicenseCreate {
  licenseID: number;
  fineFees: number;
}
