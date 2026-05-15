// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Wallet Types
export interface WalletBalance {
  balance: number;
  walletId: string;
}

export interface DepositRequest {
  amount: number;
}

export interface TransactionResponse {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PAYMENT";
  amount: number;
  description: string;
  createdAt: string;
}

// Service Types
export interface ServiceResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isActive: boolean;
}

// Order Types
export interface CreateOrderRequest {
  serviceId: string;
  details?: any;
}

export interface OrderResponse {
  id: string;
  serviceId?: string;
  serviceName: string;
  amount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  details?: any;
  createdAt: string;
}

// Checkout Types
export interface CheckoutRequest {
  serviceId: string;
  details?: any;
}

export interface CheckoutResponse {
  orderId: string;
  amount: number;
  newBalance: number;
  status: string;
}
