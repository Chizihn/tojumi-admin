export type AccountType = "FAMILY" | "PROVIDER" | "STUDENT" | "ADMIN";

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export enum ServiceType {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export interface Auth {
  // Base user details
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  accountType: AccountType;
}

export interface User extends Auth {
  id?: string;
  dob?: string;
  gender?: string;

  // Location details
  country?: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  isApproved: boolean;
}

export interface Dependent {
  id: string;
  family: User;
  firstName: string;
  lastName: string;
  phoneNo: string;
  country: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  profilePics: string;
  relationship: string;
  dateOfBirth: string;
  medicalConcerns: string[];
  // appointments: DependentAppointment[];
  // careLogs: DependentCarelog[];
  // careHomes: ProviderUserCarehome[];
  // outgoingRequests: OutgoingRequests;
}

export interface Family {
  id: string;
  user: User;
  dependents: Dependent[];
}

export interface CareBusiness {
  id: string;
  user: User;
  cacRegDocument: string;
  memorandumOfAssociation: string;
  boardOfDirectors: string[];
  businessEmail: string;
  description: string;
  otherCertificates: string;
  homes: Carehome[];
  isApproved: Status;
}

export interface CareHomeReview {
  id: string;
  date: string;
  carehome: Carehome;
  dependent: Dependent;
  rating: number;
  review: string;
}

export interface Carehome {
  id: string;
  careBusinessId: string;
  careBusiness?: CareBusiness;
  clients?: Dependent[];
  students?: Student[];
  availability?: CarehomeAvailability[];
  incomingRequests?: CareHomeIncomingRequest[];
  outgoingRequests?: StudentRequest[];
  name: string;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  yearEstablished: number;
  phoneNo: string;
  capacity: number;
  availableSlots: number;
  amenities: string[];
  imagesVideos: string[];
  location: string;
  latitude: number;
  longitude: number;
  reviews: CareHomeReview;
  isApproved: Status;
}

export interface CarehomeAvailability {
  id: string;
  carehome: Carehome;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  applyToAllDays: boolean;
  applyToAllWeeks: boolean;
}

export interface CareHomeIncomingRequest {
  id: string;
  status: string;
  dependent?: Dependent;
  serviceType: ServiceType;
  duration: number;
  price: number;
}

export enum Levels {
  JUNIOR = "JUNIOR",
  INTERMEDIATE = "INTERMEDIATE",
  SENIOR = "SENIOR",
}

export interface CareServiceType {
  id: string;
  name: string;
}

export interface Guarantor {
  id: string;
  student: Student;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  bvn: string;
  passport: string;
  occupation: string;
  address: string;
  verified: string;
  createdAt: string;
}

export interface Student {
  id: string;
  user: User;
  level: Levels;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  incomingRequests: StudentRequest[];
  idCard: string;
  certificate: string;
  careExperienceLength: number;
  accessToTransport: boolean;
  availability: StudentAvailability;
  activeCarehomes: Carehome[];
  availableCarehomes: Carehome[];
  clients: Dependent[];
  isApproved: Status;
  careServiceTypes: CareServiceType[];
  guarantorEmails: string[];
  guarantors: Guarantor[];
}

export interface StudentRequest {
  id: string;
  status: string;
  currentState: string;
  paymentStatus: string;
  student: Student;
  careHome: Carehome;
  serviceType: ServiceType;
  duration: number;
  price: number;
  createdAt: string;
  acceptedAt: string;
  scheduledStartDate: string;
  scheduledStartTime: string;
  expiresAt: string;
}

export interface StudentAvailability {
  id: string;
  student: User;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  applyToAllDays: boolean;
  applyToAllWeeks: boolean;
}
