import { Product, Salesman } from '../types/index';

export const DEMO_WHATSAPP_NUMBER = '917365980930';

export interface WhatsAppPayload {
  product: Product;
  quantity?: number;
  areaPin?: string;
  customerName?: string;
  assignedSalesman?: Salesman | null;
}

/**
 * Builds the WhatsApp pre-filled text per exact specification:
 * "Hi, I'm interested in Colgate MaxFresh at ₹40. Please help me with this product. I would also like to know the salesman for my area."
 */
export function buildWhatsAppMessage(payload: WhatsAppPayload): string {
  const { product, quantity, areaPin, customerName } = payload;
  
  let message = `Hi, I'm interested in ${product.name} at ₹${product.price}. Please help me with this product. I would also like to know the salesman for my area.`;

  const extraDetails: string[] = [];
  if (areaPin && areaPin.trim()) {
    extraDetails.push(`My Area PIN is: ${areaPin.trim()}`);
  }
  if (customerName && customerName.trim()) {
    extraDetails.push(`Store/Firm: ${customerName.trim()}`);
  }
  if (quantity && quantity > 1) {
    extraDetails.push(`Inquiry Volume: ${quantity} units`);
  }

  if (extraDetails.length > 0) {
    message += `\n\n(${extraDetails.join(' | ')})`;
  }

  return message;
}

/**
 * Builds a direct Click-to-Chat wa.me link using the demo phone:
 * https://wa.me/919382525368?text=ENCODED_MESSAGE
 */
export function generateWhatsAppLink(
  targetPhone: string = DEMO_WHATSAPP_NUMBER,
  message: string
): string {
  const cleanPhone = (targetPhone || DEMO_WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Matches a 6-digit or regional PIN code to an assigned salesman.
 */
export function findSalesmanByPin(
  pin: string,
  salesmen: Salesman[]
): Salesman | null {
  if (!pin || !salesmen.length) return null;
  const normalizedPin = pin.trim();

  // Find active salesman who has this area PIN assigned
  const matched = salesmen.find(
    (s) => s.status === 'ACTIVE' && s.assignedAreas.some((area) => area.trim() === normalizedPin)
  );

  return matched || null;
}

