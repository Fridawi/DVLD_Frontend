export interface TestAppointment {
  testAppointmentID: number;
  localDrivingLicenseApplicationID: number;
  testTypeName: string;
  className: string;
  fullName: string;
  appointmentDate: string;
  paidFees: number;
  isLocked: boolean;
  testID?: number;
}

export interface TestAppointmentCreate {
  testTypeID: number;
  localDrivingLicenseApplicationID: number;
  appointmentDate: string;
  paidFees: number;
}

export interface TestAppointmentUpdate {
  testAppointmentID: number;
  appointmentDate: string;
}
