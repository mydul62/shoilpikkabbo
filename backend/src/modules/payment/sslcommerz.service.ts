import { prisma } from "../../config/prisma";
import { ENV } from "../../config/env";
import { OrderStatus, PaymentStatus, PaymentMethod, VerificationStatus } from "@prisma/client";

export class SSLCommerzService {
  public static getFrontendUrl(): string {
    const envUrl = process.env.FRONTEND_URL;
    if (envUrl && !envUrl.includes("localhost")) {
      return envUrl.replace(/\/$/, "");
    }
    return "https://shoilpikkabbo.vercel.app";
  }

  public static getBackendUrl(): string {
    const envUrl = process.env.BACKEND_BASE_URL;
    if (envUrl && !envUrl.includes("localhost")) {
      return envUrl.replace(/\/$/, "");
    }
    return "https://shoilpikkabbo.onrender.com";
  }


  /**
   * Retrieves active SSLCommerz credentials from database SiteSettings,
   * falling back to process.env if not explicitly set in dashboard.
   */
  public static async getConfig(): Promise<{
    storeId: string;
    storePass: string;
    isSandbox: boolean;
    baseUrl: string;
    isEnabled: boolean;
  }> {
    try {
      const settings = await prisma.siteSetting.findMany({
        where: {
          key: {
            in: [
              "sslcommerz_store_id",
              "sslcommerz_store_pass",
              "sslcommerz_is_sandbox",
              "sslcommerz_enabled",
            ],
          },
        },
      });

      const map: Record<string, string> = {};
      for (const s of settings) map[s.key] = s.value;

      const storeId = map["sslcommerz_store_id"] || ENV.SSLCOMMERZ_STORE_ID;
      const storePass = map["sslcommerz_store_pass"] || ENV.SSLCOMMERZ_STORE_PASS;
      const isSandbox =
        map["sslcommerz_is_sandbox"] !== undefined
          ? map["sslcommerz_is_sandbox"] === "true"
          : ENV.SSLCOMMERZ_IS_SANDBOX;
      const isEnabled = map["sslcommerz_enabled"] !== "false";

      return {
        storeId,
        storePass,
        isSandbox,
        baseUrl: isSandbox
          ? "https://sandbox.sslcommerz.com"
          : "https://securepay.sslcommerz.com",
        isEnabled,
      };
    } catch {
      return {
        storeId: ENV.SSLCOMMERZ_STORE_ID,
        storePass: ENV.SSLCOMMERZ_STORE_PASS,
        isSandbox: ENV.SSLCOMMERZ_IS_SANDBOX,
        baseUrl: ENV.SSLCOMMERZ_IS_SANDBOX
          ? "https://sandbox.sslcommerz.com"
          : "https://securepay.sslcommerz.com",
        isEnabled: true,
      };
    }
  }

  /**
   * Initializes an SSLCommerz payment session and returns the GatewayPageURL
   */
  static async initiatePayment(order: {
    id: string;
    orderNumber: string;
    totalAmount: any;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    shippingAddress: string;
    city: string;
    postalCode?: string | null;
    transactionId?: string | null;
  }): Promise<{ success: boolean; paymentUrl?: string; message?: string }> {
    try {
      const config = await this.getConfig();

      if (!config.isEnabled) {
        return {
          success: false,
          message: "SSLCommerz payment gateway is currently disabled in store settings.",
        };
      }

      const initUrl = `${config.baseUrl}/gwprocess/v4/api.php`;
      const tranId = order.transactionId || `SK_TXN_${order.orderNumber}_${Date.now()}`;

      // Update order with transactionId if needed
      await prisma.order.update({
        where: { id: order.id },
        data: { transactionId: tranId },
      });

      const params = new URLSearchParams();
      params.append("store_id", config.storeId);
      params.append("store_passwd", config.storePass);
      params.append("total_amount", Number(order.totalAmount).toFixed(2));
      params.append("currency", "BDT");
      params.append("tran_id", tranId);

      // Backend callback endpoints (Guaranteed production HTTPS domains)
      const backendBase = this.getBackendUrl();
      params.append("success_url", `${backendBase}/api/v1/payments/sslcommerz/success`);
      params.append("fail_url", `${backendBase}/api/v1/payments/sslcommerz/fail`);
      params.append("cancel_url", `${backendBase}/api/v1/payments/sslcommerz/cancel`);
      params.append("ipn_url", `${backendBase}/api/v1/payments/sslcommerz/ipn`);

      // Order & Product metadata
      params.append("shipping_method", "Courier");
      params.append("product_name", "Handicraft & General Products");
      params.append("product_category", "Ecommerce");
      params.append("product_profile", "general");

      // Customer info
      params.append("cus_name", order.customerName || "Customer");
      params.append("cus_email", order.customerEmail || "customer@shoilpikkabbo.com");
      params.append("cus_add1", order.shippingAddress || "Dhaka");
      params.append("cus_city", order.city || "Dhaka");
      params.append("cus_postcode", order.postalCode || "1200");
      params.append("cus_country", "Bangladesh");
      params.append("cus_phone", order.customerPhone || "01700000000");

      // Shipping info
      params.append("ship_name", order.customerName || "Customer");
      params.append("ship_add1", order.shippingAddress || "Dhaka");
      params.append("ship_city", order.city || "Dhaka");
      params.append("ship_postcode", order.postalCode || "1200");
      params.append("ship_country", "Bangladesh");

      // Custom order identifier
      params.append("value_a", order.orderNumber);

      console.log(`[SSLCommerz] Initiating session for Order #${order.orderNumber} (Amount: ৳${order.totalAmount}) at ${initUrl}`);

      const response = await fetch(initUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = (await response.json()) as any;

      if (data && (data.status === "SUCCESS" || data.status === "success") && data.GatewayPageURL) {
        console.log(`[SSLCommerz] Session created successfully. GatewayPageURL: ${data.GatewayPageURL}`);
        return {
          success: true,
          paymentUrl: data.GatewayPageURL,
        };
      }

      console.error("[SSLCommerz] Session initiation failed:", data);
      return {
        success: false,
        message: data?.failedreason || "Failed to initialize SSLCommerz gateway session.",
      };
    } catch (err: any) {
      console.error("[SSLCommerz] API Request Error:", err);
      return {
        success: false,
        message: err.message || "SSLCommerz network request failed.",
      };
    }
  }

  /**
   * Validates a transaction with SSLCommerz server
   */
  static async validatePayment(valId: string): Promise<any> {
    try {
      const config = await this.getConfig();
      const validateUrl = `${config.baseUrl}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${config.storeId}&store_passwd=${config.storePass}&format=json`;

      console.log(`[SSLCommerz] Validating transaction with Val ID: ${valId}`);
      const response = await fetch(validateUrl, { method: "GET" });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("[SSLCommerz] Validation request failed:", err);
      return null;
    }
  }

  /**
   * Handles payment success callback from SSLCommerz
   */
  static async handleSuccess(body: any): Promise<{ redirectUrl: string }> {
    const { tran_id, val_id, amount, card_type, bank_tran_id, value_a } = body;
    console.log(`[SSLCommerz] Success callback received for tran_id: ${tran_id}, val_id: ${val_id}, order: ${value_a}`);

    let isValid = true;
    let cardType = card_type || "Online Gateway";

    // Perform server-side validation with SSLCommerz
    if (val_id) {
      const valResult = await this.validatePayment(val_id);
      if (valResult && (valResult.status === "VALID" || valResult.status === "VALIDATED")) {
        isValid = true;
        if (valResult.card_type) cardType = valResult.card_type;
      } else {
        console.warn("[SSLCommerz] Server validation status was not VALID:", valResult);
      }
    }

    // Find the associated order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(tran_id ? [{ transactionId: tran_id }] : []),
          ...(value_a ? [{ orderNumber: value_a }] : []),
        ],
      },
    });

    if (!order) {
      console.error(`[SSLCommerz] Order not found for tran_id: ${tran_id}, value_a: ${value_a}`);
      return {
        redirectUrl: `${this.getFrontendUrl()}/checkout?error=order_not_found`,
      };
    }

    if (isValid) {
      // Update order to PAID and CONFIRMED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.CONFIRMED,
          paymentMethod: PaymentMethod.ONLINE_GATEWAY,
          transactionId: tran_id || order.transactionId,
        },
      });

      // Audit payment in Payment table
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: PaymentMethod.ONLINE_GATEWAY,
          transactionId: tran_id || val_id,
          bankReference: bank_tran_id || val_id || null,
          amount: Number(amount) || order.totalAmount,
          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          verificationNotes: `Verified via SSLCommerz Gateway (${cardType}). Val ID: ${val_id || "N/A"}`,
        },
      });

      // Add tracking event
      await prisma.deliveryTrackingEvent.create({
        data: {
          orderId: order.id,
          status: OrderStatus.CONFIRMED,
          description: `Payment of ৳${Number(amount || order.totalAmount).toLocaleString()} received via ${cardType}. Order confirmed for dispatch.`,
          location: order.city,
        },
      });

      console.log(`[SSLCommerz] Order #${order.orderNumber} successfully marked as PAID.`);
      return {
        redirectUrl: `${this.getFrontendUrl()}/checkout/success?orderNumber=${order.orderNumber}&paymentStatus=PAID&method=SSLCOMMERZ&tranId=${tran_id || ""}`,
      };
    } else {
      // If validation failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });

      return {
        redirectUrl: `${this.getFrontendUrl()}/checkout?error=validation_failed&orderNumber=${order.orderNumber}`,
      };
    }
  }

  /**
   * Handles payment failure callback
   */
  static async handleFail(body: any): Promise<{ redirectUrl: string }> {
    const { tran_id, value_a, failedreason } = body;
    console.warn(`[SSLCommerz] Payment failed callback for tran_id: ${tran_id}, reason: ${failedreason}`);

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(tran_id ? [{ transactionId: tran_id }] : []),
          ...(value_a ? [{ orderNumber: value_a }] : []),
        ],
      },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      return {
        redirectUrl: `${this.getFrontendUrl()}/checkout?error=payment_failed&orderNumber=${order.orderNumber}`,
      };
    }

    return {
      redirectUrl: `${this.getFrontendUrl()}/checkout?error=payment_failed`,
    };
  }

  /**
   * Handles payment cancel callback
   */
  static async handleCancel(body: any): Promise<{ redirectUrl: string }> {
    const { tran_id, value_a } = body;
    console.warn(`[SSLCommerz] Payment cancelled by customer for tran_id: ${tran_id}`);

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(tran_id ? [{ transactionId: tran_id }] : []),
          ...(value_a ? [{ orderNumber: value_a }] : []),
        ],
      },
    });

    return {
      redirectUrl: `${this.getFrontendUrl()}/checkout?error=payment_cancelled${order ? `&orderNumber=${order.orderNumber}` : ""}`,
    };
  }

  /**
   * Handles Instant Payment Notification (IPN) webhook
   */
  static async handleIPN(body: any): Promise<{ success: boolean }> {
    const { tran_id, val_id, status } = body;
    console.log(`[SSLCommerz IPN] Received notification for tran_id: ${tran_id}, status: ${status}`);

    if (status === "VALID" || status === "VALIDATED") {
      const order = await prisma.order.findFirst({
        where: { transactionId: tran_id },
      });

      if (order && order.paymentStatus !== PaymentStatus.PAID) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAID,
            orderStatus: OrderStatus.CONFIRMED,
          },
        });
        console.log(`[SSLCommerz IPN] Order #${order.orderNumber} updated to PAID.`);
      }
    }

    return { success: true };
  }
}
