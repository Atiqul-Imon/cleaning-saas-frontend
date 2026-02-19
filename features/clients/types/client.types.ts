export interface Client {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: {
    accessInfo?: string;
    keySafe?: string;
    alarmCode?: string;
    pets?: string;
    preferences?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClientDto {
  name: string;
  phone?: string;
  address?: string;
  keySafe?: string;
  alarmCode?: string;
  pets?: string;
  preferences?: string;
  accessInfo?: string;
}

export interface UpdateClientDto {
  name?: string;
  phone?: string;
  address?: string;
  keySafe?: string;
  alarmCode?: string;
  pets?: string;
  preferences?: string;
  accessInfo?: string;
}
