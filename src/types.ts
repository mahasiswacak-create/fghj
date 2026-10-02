export type ReasonOptionId = 'siap' | 'takut_pasangan' | 'gak_ada_duit';

export interface ReasonOption {
  id: ReasonOptionId;
  label: string;
  badge?: string;
  sarcasticRemark?: string;
  remarkType?: 'warning' | 'info' | 'success';
}

export interface SubmissionRecord {
  id: string;
  name: string;
  reason: string;
  reasonId?: ReasonOptionId;
  timestamp: string;
  status: string;
}

export interface SubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: SubmissionRecord;
  forwardedToGas?: boolean;
}
