export interface AttendancePolicy {
  id: number;
  dailyAcceptableMinutes: number;
  dailyUnacceptableMinutes: number;
  monthlyAcceptableMinutes: number;
  monthlyUnacceptableMinutes: number;
}

export interface CreateAttendancePolicyRequest {
  name: string;
  dailyAcceptableMinutes: number;
  dailyUnacceptableMinutes: number;
  monthlyAcceptableMinutes: number;
  monthlyUnacceptableMinutes: number;
}

export interface UpdateAttendancePolicyRequest
  extends CreateAttendancePolicyRequest {
  id: number;
}
