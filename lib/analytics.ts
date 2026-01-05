// Analytics event tracking

export type AnalyticsEvent =
  | 'BookHomeVisit_Click'
  | 'Slot_Selected'
  | 'Booking_Confirmed'
  | 'PDP_View'
  | 'AddToCart'
  | 'Checkout_Start'
  | 'Payment_Success'
  | 'Order_Cancel'
  | 'Refund_Initiated'
  | 'Staff_Status_Update'
  | 'Lab_Stage_Update'
  | 'QC_Fail';

interface EventData {
  [key: string]: any;
}

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  }

  track(event: AnalyticsEvent, data?: EventData) {
    if (!this.enabled) {
      // Log to console in development
      console.log('[Analytics]', event, data);
      return;
    }

    // In production, send to analytics service
    // Example: Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', event, data);
      }

      // Mixpanel
      if ((window as any).mixpanel) {
        (window as any).mixpanel.track(event, data);
      }

      // Custom analytics endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
      }).catch((err) => console.error('Analytics error:', err));
    }
  }

  // E-commerce events
  viewItem(productId: string, productName: string, price: number) {
    this.track('PDP_View', { productId, productName, price });
  }

  addToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    this.track('AddToCart', { productId, productName, price, quantity });
  }

  beginCheckout(orderId: string, value: number) {
    this.track('Checkout_Start', { orderId, value });
  }

  purchase(orderId: string, value: number, items: any[]) {
    this.track('Payment_Success', { orderId, value, items });
  }

  // Booking events
  bookHomeVisitClick() {
    this.track('BookHomeVisit_Click');
  }

  slotSelected(slotId: string, date: string, time: string) {
    this.track('Slot_Selected', { slotId, date, time });
  }

  bookingConfirmed(bookingId: string, serviceType: string) {
    this.track('Booking_Confirmed', { bookingId, serviceType });
  }

  // Order events
  orderCancel(orderId: string, reason?: string) {
    this.track('Order_Cancel', { orderId, reason });
  }

  refundInitiated(orderId: string, amount: number, reason?: string) {
    this.track('Refund_Initiated', { orderId, amount, reason });
  }

  // Staff events
  staffStatusUpdate(orderId: string, stage: string, duration: number) {
    this.track('Staff_Status_Update', { orderId, stage, duration });
  }

  // Lab events
  labStageUpdate(orderId: string, stage: string, duration: number) {
    this.track('Lab_Stage_Update', { orderId, stage, duration });
  }

  qcFail(orderId: string, stage: string, reason: string) {
    this.track('QC_Fail', { orderId, stage, reason });
  }
}

export const analytics = new Analytics();
export default analytics;

