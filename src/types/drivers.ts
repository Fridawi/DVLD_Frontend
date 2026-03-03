export interface Driver {
  driverID: number;
  personID: number;
  nationalNo: string;
  fullName: string;
  createdByUserID: number;
  createdDate: string;
}

export interface DriverCreate {
  personID: number;
}
