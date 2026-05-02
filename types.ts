
export enum IssueType {
  AGGRESSIVE_BEHAVIOR = 'Aggressive Behavior',
  DOG_BITE = 'Dog Bite',
  SKIN_RASH = 'Skin Rash',
  SUSPECTED_RABIES = 'Suspected Rabies',
  INJURY = 'Injury',
  HEALTH_CONCERN = 'Health Concern',
  GENERAL = 'General Reporting'
}

export enum ReportStatus {
  PENDING = 'Pending',
  ACKNOWLEDGED = 'Acknowledged',
  IN_PROGRESS = 'In Progress',
  SEARCHING = 'Searching',
  RESCUED = 'Rescued',
  RESOLVED = 'Resolved'
}

export enum DogHealthStatus {
  STABLE = 'Stable',
  CRITICAL = 'Critical',
  UNDER_TREATMENT = 'Under Treatment',
  RECOVERED = 'Recovered',
  HEALTHY = 'Healthy',
  READY_FOR_ADOPTION = 'Ready for Adoption'
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Vaccination {
  name: string;
  date: string;
  nextDueDate: string;
}

export interface TreatmentRecord {
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export interface AdoptionApplication {
  id: string;
  dogId: string;
  dogName: string;
  adopterName: string;
  adopterPhone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface Dog {
  id: string;
  name?: string;
  breed: string;
  estimatedAge: string;
  gender: 'Male' | 'Female' | 'Unknown';
  healthStatus: DogHealthStatus;
  isSterilized: boolean;
  captureDate: string;
  captureLocation: Location;
  vaccinations: Vaccination[];
  treatmentHistory: TreatmentRecord[];
  photoUrl: string;
  isAdopted: boolean;
  adopter?: {
    name: string;
    phone: string;
    adoptionDate: string;
  };
  hasPendingApplication?: boolean;
}

export interface AIInsight {
  severity: 'Low' | 'Medium' | 'High' | 'Urgent';
  priority: string;
  reason: string;
  visualAnalysis?: string;
  peopleRequired?: string;
  equipmentSuggested?: string[];
}

export interface Report {
  id: string;
  type: IssueType;
  description: string;
  location: Location;
  status: ReportStatus;
  reporterName: string;
  timestamp: string;
  photoUrl?: string; // Visual evidence for the report
  dogId?: string;
  resolutionAction?: string;
  expectedTimeline?: string;
  aiInsight?: AIInsight;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  location: string;
  photoUrl: string;
  authorName: string;
  timestamp: string;
  status: 'Searching' | 'Found' | 'Rescued';
  comments: Comment[];
}

export type UserRole = 'CITIZEN' | 'ADMIN';
