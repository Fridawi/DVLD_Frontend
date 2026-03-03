export interface Test {
  testID: number;
  testAppointmentID: number;
  testResult: boolean;
  notes: string;
  createdByUserID: number;
}
export interface TestCreate {
  testAppointmentID: number;
  testResult: boolean;
  notes?: string;
}

export interface TestUpdate {
  testID: number;
  testResult: boolean;
  notes?: string;
}
