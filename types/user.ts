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
  cacRegDocument: string;
  memorandumOfAssociation: string;
  boardOfDirectors: string[];
  businessEmail: string;
  description: string;
  otherCertificates: string;
  homes: Carehome[];
  isApproved: boolean;
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

export interface Student {
  id: string;
  user: User;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  incomingRequestIds: string[];
  incomingRequests: StudentRequest[];
  idCard: string;
  certificate: string;
  careExperienceLength: string;
  accessToTransport: boolean;
  availability: StudentAvailability;
  activeCarehomes: Carehome[];
  availableCarehomes: Carehome[];
  clients: Dependent[];
  isApproved: boolean;
}

export interface StudentRequest {
  id: string;
  status: string;
  careHome: Carehome;
  serviceType: ServiceType;
  duration: number;
  price: number;
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
