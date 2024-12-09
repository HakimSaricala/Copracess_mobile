/* eslint-disable prettier/prettier */
// types/type.d.ts
export interface SplashScreenProps {
  onFinish: () => void;
}
interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

export interface ScreenHeaderBtnProps {
  iconUrl: ImageSourcePropType;
  handlePress: () => void;
  width?: number;
  height?: number;
}

export interface CustomHeaderProps {
  notificationCount: number;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

export interface Transaction {
  transaction_id: string;
  transaction_date_time: string;
  buyer_name: string;
  transaction_amount: string;
  plate_number: string;
  copra_weight: number;
  payment_method: string;
  status: string;
}
// types.ts
export interface TransactionResponse {
  transactions?: (OilmillTransaction | CopraOwnerTransaction)[];
  error?: string;
}

export interface UpdateTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: (updatedTransaction: Transaction) => void;
  transaction: Transaction | null;
}

export declare interface OilmillTransaction {
  booking: {
    deliveryDate: string;
    description: string;
    estimatedWeight: number;
    plateNumber: string;
  };
  bookingId: string;
  copraOwner: {
    email: string;
    name: string;
  };
  actualWeight: number | null;
  qualityGrade: string | null;
  copraOwnerEmail: string;
  copraOwnerId: string;
  copraOwnerName: string;
  date: string;
  dateTrans: string;
  dateUpdate: string;
  discount: number | null;
  id: string;
  invoiceID: string | null;
  oilMillCompanyId: string;
  paymentType: string;
  payoutID: string | null;
  plateNumber: string;
  remarks: string | null;
  status: string;
  time: string;
  totalAmount: number | null;
}

export declare interface CopraOwnerTransaction {
  booking: {
    deliveryDate: string;
    description: string;
    estimatedWeight: number;
  };
  bookingId: string;
  copraOwnerId: string;
  date: string;
  dateTrans: string;
  dateUpdate: string;
  discount: number | null;
  id: string;
  invoiceID: string | null;
  oilMillCompany: {
    address: string;
    name: string;
  };
  actualWeight: number | null;
  qualityGrade: string | null;
  oilMillCompanyAddress: string;
  oilMillCompanyId: string;
  oilMillCompanyName: string;
  paymentType: string;
  payoutID: string | null;
  plateNumber: string;
  remarks: string | null;
  status: string;
  time: string;
  totalAmount: number | null;
}

export interface SearchInputProps {
  initialQuery?: string;
  icon: ImageSourcePropType;
  onSearch: (query: string) => void; // Changed from handlePress
}

export interface addFABProps {
  onPress: () => void;
}

export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface TransactionCardProps {
  transaction: CopraOwnerTransaction | OilmillTransaction;
  isEditMode: boolean;
  onPress: (transaction: CopraOwnerTransaction | OilmillTransaction) => void;
}

export interface PaymentModalProps {
  visible: boolean;
  transaction: CopraOwnerTransaction | OilmillTransaction | null;
  onConfirm: () => void;
  onClose: () => void;
}

export interface FilterModalProps {
  visible: boolean;
  onApplyFilters: (filters: {
    selectedPeriod: string;
    startDate: Date;
    endDate: Date;
    selectedStatus: string[];
  }) => void;
  onClose: () => void;
}

export interface Filters {
  selectedPeriod: string;
  startDate: Date;
  endDate: Date;
  selectedStatus: string[];
}

export interface BookingCalendarProps {
  onDateSelect: (date: string) => void;
}

interface LogoutModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface VirtualQueueHeaderProps {
  queueNumber: string;
  currentlyUnloading: string;
  totalTrucks: number;
  completed: number;
  onTheWay: number;
}

// export interface VirtualQueueItem {
//   id: string;
//   time: string;
//   plateNumber: string;
//   owner: string;
//   date: string;
// }

export interface VirtualQueueItem {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  arrivalTime: string;
  plateNumber: string | null;
  owner: string;
  driverName: string | null;
  status: string;
  isArchived: boolean;
  orgId: string;
  weight: number;
  booking: {
    copraBuyer: {
      name: string;
    } | null;
    estimatedWeight: number | null;
  };
}

export interface Booking {
  id: string;
  destination: string;
  date: string;
  weight: string;
  plateNumber: string;
  status: string;
}

export interface BookingHistorySidebarProps {
  isVisible: boolean;
  onClose: () => void;
  bookingHistory: Booking[];
}

export interface QRCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  qrCodeData: string;
}

export interface SetPriceModalProps {
  visible: boolean;
  onClose: () => void;
  onSetPrice: (date: string, price: number) => void;
  selectedDate: string;
  currentPrice?: number; // Add this prop
}

export interface PriceCardProps {
  title: string;
  price: string;
  subtitle?: string;
}

export interface Mill {
  id: string;
  name: string;
  location: string;
  contact: string;
  distance: string;
  image: string;
  rating: number;
  status: 'Open' | 'Closed';
  operatingHours: string;
}

export interface MillCardProps {
  mill: Mill;
  onBookPress?: (millId: string) => void;
  variant: 'map' | 'list';
}

export interface ListViewProps {
  oilMills: Mill[];
  onSwitchView: () => void;
}

export interface SummaryItem {
  label: string;
  value: string | number;
  unit?: string;
}

export interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
  titleClassName?: string;
  containerClassName?: string;
}

export interface QueueItem {
  id: string;
  owner: string;
  plateNumber: string;
  status: string;
  statusColor?: 'primary' | 'secondary';
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export interface QueueSectionProps {
  title: string;
  seeAllText?: string;
  data: QueueItem[];
  onSeeAllPress?: () => void;
  containerClassName?: string;
  emptyStateText?: string;
  showAvatar?: boolean;
  onItemPress?: (item: QueueItem) => void;
}

export interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

export interface ChartSectionProps {
  tabs: TabOption[];
  chartData: Record<string, ChartData>;
  summaryData: Record<string, SummaryItem[]>;
  chartConfig?: any;
  containerClassName?: string;
  height?: number;
  isLoading?: boolean; // Add isLoading prop
}
export interface PriceCardItem {
  id: string;
  millName: string;
  price: string;
  subPrice: string;
}

export interface PriceSectionProps {
  data: PriceCardItem[];
  average: string;
  onViewAll?: () => void;
}

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export interface SignInForm {
  email: string;
  password: string;
}
export interface FormFieldProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
}
export interface User {
  createdAt: string;
  email: string;
  emailVerified: string;
  id: string;
  image: string;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  name: string;
  organizationId: string | null;
  password: string;
  position: string | null;
  role: 'OIL_MILL_MANAGER' | 'OIL_MILL_MEMBER' | 'COPRA_BUYER';
  updatedAt: string;
}
