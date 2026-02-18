import type { CreateInvoiceDto, UpdateInvoiceDto } from '../types/invoice.types';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Invoices Business Logic Service
 * Contains validation and business rules for invoices
 */
export class InvoicesService {
  /**
   * Validate invoice creation data
   */
  static validateCreateInvoice(data: CreateInvoiceDto): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.jobId) {
      errors.push('Job is required');
    }

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    // Validate amount is reasonable
    if (data.amount > 100000) {
      errors.push('Amount seems unusually high. Please verify.');
    }

    // Validate amount has max 2 decimal places
    if (data.amount && !Number.isInteger(data.amount * 100)) {
      errors.push('Amount can have maximum 2 decimal places');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Validate invoice update data
   */
  static validateUpdateInvoice(data: UpdateInvoiceDto): ValidationResult {
    const errors: string[] = [];

    // Validate payment method if marking as paid
    if (data.status === 'PAID' && !data.paymentMethod) {
      errors.push('Payment method is required when marking invoice as paid');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Calculate VAT amount
   */
  static calculateVAT(amount: number, vatEnabled: boolean): number {
    if (!vatEnabled) return 0;
    // UK VAT rate is 20%
    return Math.round(amount * 0.2 * 100) / 100;
  }

  /**
   * Calculate total amount including VAT
   */
  static calculateTotal(amount: number, vatEnabled: boolean): number {
    const vat = this.calculateVAT(amount, vatEnabled);
    return Math.round((amount + vat) * 100) / 100;
  }

  /**
   * Check if invoice is overdue
   */
  static isOverdue(invoice: { dueDate: string; status: string }): boolean {
    if (invoice.status === 'PAID') return false;
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  /**
   * Get days until due date
   */
  static getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Format amount for display
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  }

  /**
   * Format invoice number
   */
  static formatInvoiceNumber(invoiceNumber: string): string {
    return invoiceNumber.toUpperCase();
  }
}



