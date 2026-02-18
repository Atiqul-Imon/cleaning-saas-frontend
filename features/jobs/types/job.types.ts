export interface Job {
  id: string;
  type: string;
  frequency?: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  reminderEnabled?: boolean;
  reminderTime?: string;
  client: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  cleaner?: {
    id: string;
    email: string;
  };
  checklist?: {
    id: string;
    itemText: string;
    completed: boolean;
  }[];
  photos?: {
    id: string;
    imageUrl: string;
    photoType: 'BEFORE' | 'AFTER';
    timestamp: string;
  }[];
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
}

export interface CreateJobDto {
  clientId: string;
  cleanerId?: string;
  type: 'ONE_OFF' | 'RECURRING';
  frequency?: 'WEEKLY' | 'BI_WEEKLY';
  scheduledDate: string;
  scheduledTime?: string;
  reminderEnabled?: boolean;
  reminderTime?: string;
}

export interface UpdateJobDto {
  cleanerId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  reminderEnabled?: boolean;
  reminderTime?: string;
}

export type JobStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
export type JobType = 'ONE_OFF' | 'RECURRING';
export type JobFrequency = 'WEEKLY' | 'BI_WEEKLY';



