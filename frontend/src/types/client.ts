export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  plan: string;
  status: 'active' | 'inactive';
  monthlyFee: number;
  joinDate: string;
  photo?: string;
  paymentHistory: Payment[];
  assessmentHistory: Assessment[];
  goals: ClientGoal[];
  notes: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  method: 'card' | 'cash' | 'transfer';
  description: string;
}

export interface Assessment {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  notes: string;
}

export interface ClientGoal {
  id: string;
  title: string;
  target: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}
