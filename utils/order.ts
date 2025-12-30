export interface OrderBranch {
  id?: string;
  name?: string;
  whatsapp?: string;
}

export interface WhatsAppOptions {
  language?: 'en' | 'ar';
  branch?: OrderBranch;
  customerLocation?: string | null;
  currency?: string;
  decimalPlaces?: number;
}

function fmt(value: number, decimals = 3) {
  return value.toFixed(decimals);
}

// Generate an order number safe for display
function generateOrderNumber() {
  const ts = Date.now().toString().slice(-6);
  const r = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${ts}-${r}`;
}

export function generateWhatsAppMessage(items: any[], opts: WhatsAppOptions = {}) {
  const language = opts.language || 'ar';
  const currency = opts.currency || 'BHD';
  const decimals = typeof opts.decimalPlaces === 'number' ? opts.decimalPlaces : 3;

  const lines: string[] = [];

  if (language === 'ar') {
    lines.push('طلب جديد');
  } else {
    lines.push('New Order');
  }

  lines.push('');

  let total = 0;
  for (const it of items) {
    try {
      // Name (already captured when item was added). If item has multi-language, try to use string.
      const name = typeof it.name === 'string' ? it.name : (it.name && (it.name[language] || it.name.en || it.name.ar) ) || '';
      const qty = typeof it.quantity === 'number' ? it.quantity : 1;
      const size = it.sizeLabel ? ` - ${it.sizeLabel}` : '';
      const note = it.note ? ` (${it.note})` : '';
      if (it.includedInTotal === false || it.price === null || it.price === undefined) {
        // price-on-request
        const priceLabel = it.priceLabel || 'السعر عند الطلب';
        lines.push(`${name}${size} x${qty} — ${priceLabel}${note}`);
      } else {
        const price = Number(it.price) || 0;
        const linePrice = price * qty;
        total += linePrice;
        lines.push(`${name}${size} x${qty} — ${fmt(price, decimals)} ${currency} each (${fmt(linePrice, decimals)} ${currency})${note}`);
      }
    } catch {
      // Do not throw — skip problematic item
    }
  }

  if (total > 0) {
    lines.push('');
    if (language === 'ar') {
      lines.push(`الإجمالي: ${fmt(total, decimals)} ${currency}`);
    } else {
      lines.push(`Total: ${fmt(total, decimals)} ${currency}`);
    }
  }

  lines.push('');
  if (opts.branch && opts.branch.name) {
    if (language === 'ar') lines.push(`الفرع: ${opts.branch.name}`);
    else lines.push(`Branch: ${opts.branch.name}`);
  }

  if (opts.customerLocation) {
    if (language === 'ar') lines.push(`الموقع: ${opts.customerLocation}`);
    else lines.push(`Location: ${opts.customerLocation}`);
  }

  const orderNum = generateOrderNumber();
  if (language === 'ar') lines.push(`رقم الطلب: ${orderNum}`);
  else lines.push(`Order Number: ${orderNum}`);

  const message = lines.join('\n');
  return encodeURIComponent(message);
}

export default generateWhatsAppMessage;
