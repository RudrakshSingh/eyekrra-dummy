// User Roles
export type UserRole =
  | 'super_admin'
  | 'admin_ops'
  | 'admin_finance'
  | 'admin_catalog'
  | 'admin_hr'
  | 'regional_manager'
  | 'eye_test_executive'
  | 'try_on_executive'
  | 'delivery_executive'
  | 'runner'
  | 'lab_technician'
  | 'qc_specialist'
  | 'lab_manager'
  | 'customer';

// Order Status Stages
export type OrderStage =
  | 'confirmed'
  | 'optima_assigned'
  | 'call_verified'
  | 'start_travel'
  | 'arrived'
  | 'eye_test_started'
  | 'eye_test_completed'
  | 'try_on_started'
  | 'try_on_completed'
  | 'payment_collected'
  | 'handover_to_runner'
  | 'job_received'
  | 'lens_frame_allocation'
  | 'cutting_fitting'
  | 'assembly'
  | 'qc_1'
  | 'final_cleaning'
  | 'qc_2'
  | 'dispatch_ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed';

// Lab Stage
export type LabStage =
  | 'job_received'
  | 'lens_frame_allocation'
  | 'cutting_fitting'
  | 'assembly'
  | 'qc_1'
  | 'final_cleaning'
  | 'qc_2'
  | 'dispatch_ready';

// Exception Codes
export type ExceptionCode =
  | 'customer_not_home'
  | 'phone_off'
  | 'rx_mismatch'
  | 'inventory_unavailable'
  | 'lab_overload'
  | 'delivery_delayed'
  | 'qc_fail'
  | 'payment_issue';

// Booking Service Type
export type ServiceType = 'eye_test' | 'try_on' | 'combo';

// Payment Status
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded';

// Payment Method
export type PaymentMethod = 'upi' | 'card' | 'cod' | 'wallet' | 'pay_later';

// Order Type
export type OrderType = 'FAST' | 'STANDARD';

// Timeline Event
export interface TimelineEvent {
  stage: OrderStage;
  timestamp: Date;
  userId?: string;
  userName?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  photoProof?: string;
  remarks?: string;
  exceptionCode?: ExceptionCode;
}

// SLA Status
export type SLAStatus = 'on_track' | 'at_risk' | 'breached';

