export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export type Donation = {
  id: number;
  amount: number;
  status: DonationStatus;
  paymentCheckoutUrl: string | null;
  paymentTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
  donorId: number;
  institutionId: number | null;
  projectId: number | null;
  donor?: {
    account: {
      name: string;
    };
  };
  institution?: {
    account: {
      name: string;
    };
  };
  project?: {
    name: string;
  };
};
