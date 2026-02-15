import type { CreateClientDto, UpdateClientDto } from '../types/client.types';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Clients Business Logic Service
 * Contains validation and business rules for clients
 */
export class ClientsService {
  /**
   * Validate client creation data
   */
  static validateCreateClient(data: CreateClientDto): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Client name is required');
    }

    // Validate name length
    if (data.name && data.name.length > 100) {
      errors.push('Client name must be less than 100 characters');
    }

    // Validate phone format (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }

    // Validate address length (if provided)
    if (data.address && data.address.length > 500) {
      errors.push('Address must be less than 500 characters');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Validate client update data
   */
  static validateUpdateClient(data: UpdateClientDto): ValidationResult {
    const errors: string[] = [];

    // Validate name length (if provided)
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        errors.push('Client name cannot be empty');
      }
      if (data.name.length > 100) {
        errors.push('Client name must be less than 100 characters');
      }
    }

    // Validate phone format (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }

    // Validate address length (if provided)
    if (data.address && data.address.length > 500) {
      errors.push('Address must be less than 500 characters');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Validate phone number format
   */
  private static isValidPhone(phone: string): boolean {
    // Basic phone validation - allows various formats
    // Remove common separators and check if it's mostly digits
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{7,15}$/.test(cleaned);
  }

  /**
   * Transform client data for API
   * Converts flat structure to API format with notes object
   */
  static transformClientData(data: CreateClientDto): any {
    const notes: any = {};
    
    if (data.keySafe) notes.keySafe = data.keySafe;
    if (data.alarmCode) notes.alarmCode = data.alarmCode;
    if (data.pets) notes.pets = data.pets;
    if (data.preferences) notes.preferences = data.preferences;
    if (data.accessInfo) notes.accessInfo = data.accessInfo;

    const result: any = {
      name: data.name.trim(),
    };

    if (data.phone) result.phone = data.phone.trim();
    if (data.address) result.address = data.address.trim();
    if (Object.keys(notes).length > 0) result.notes = notes;

    return result;
  }

  /**
   * Format client name for display
   */
  static formatClientName(name: string): string {
    return name.trim();
  }

  /**
   * Format phone number for display
   */
  static formatPhone(phone?: string): string | undefined {
    if (!phone) return undefined;
    // Basic formatting - can be enhanced
    return phone.trim();
  }
}

