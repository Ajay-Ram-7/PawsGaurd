
import { IssueType, ReportStatus, DogHealthStatus, Dog, Report, CommunityPost } from './types';

export const MOCK_DOGS: Dog[] = [
  {
    id: 'D-001',
    name: 'Buddy',
    breed: 'Indie Mix',
    estimatedAge: '2 years',
    gender: 'Male',
    healthStatus: DogHealthStatus.READY_FOR_ADOPTION,
    isSterilized: true,
    captureDate: '2024-03-10',
    captureLocation: { lat: 12.9716, lng: 77.5946, address: 'Indiranagar, Bangalore' },
    vaccinations: [
      { name: 'Anti-Rabies', date: '2024-03-15', nextDueDate: '2025-03-15' },
      { name: 'DHPP', date: '2024-03-20', nextDueDate: '2025-03-20' }
    ],
    treatmentHistory: [
      { date: '2024-03-12', diagnosis: 'Minor abrasions', treatment: 'Antiseptic dressing', notes: 'Fully healed' }
    ],
    photoUrl: 'https://picsum.photos/seed/dog1/400/300',
    isAdopted: false
  },
  {
    id: 'D-002',
    name: 'Luna',
    breed: 'Pariah Dog',
    estimatedAge: '1 year',
    gender: 'Female',
    healthStatus: DogHealthStatus.UNDER_TREATMENT,
    isSterilized: false,
    captureDate: '2024-04-01',
    captureLocation: { lat: 12.9352, lng: 77.6245, address: 'Koramangala, Bangalore' },
    vaccinations: [],
    treatmentHistory: [
      { date: '2024-04-02', diagnosis: 'Skin Mange', treatment: 'Medicated baths', notes: 'Recovery ongoing' }
    ],
    photoUrl: 'https://picsum.photos/seed/dog2/400/300',
    isAdopted: false
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'CP-001',
    title: 'Help Find Brownie!',
    description: 'Brownie was last seen near the central park. He has a red collar and is very friendly but might be scared.',
    location: 'Central Park East, Sector 4',
    photoUrl: 'https://picsum.photos/seed/brownie/600/400',
    authorName: 'Officer Sarah',
    timestamp: '2024-04-22T09:00:00Z',
    status: 'Searching',
    comments: [
      {
        id: 'C-001',
        authorName: 'John Doe',
        authorRole: 'CITIZEN',
        text: 'I saw a brown dog matching this description near the bakery this morning!',
        timestamp: '2024-04-22T10:30:00Z'
      },
      {
        id: 'C-002',
        authorName: 'Officer Sarah',
        authorRole: 'ADMIN',
        text: 'Thanks John! We are heading to the bakery area now.',
        timestamp: '2024-04-22T10:45:00Z'
      }
    ]
  },
  {
    id: 'CP-002',
    title: 'Injured Dog Spotted',
    description: 'A dog with a limp was spotted near the metro station. Need help locating it for rescue.',
    location: 'Metro Station North Exit',
    photoUrl: 'https://picsum.photos/seed/injured/600/400',
    authorName: 'Officer Mike',
    timestamp: '2024-04-21T15:00:00Z',
    status: 'Searching',
    comments: []
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'R-1001',
    type: IssueType.AGGRESSIVE_BEHAVIOR,
    description: 'A large brown dog is barking aggressively at school children near the park entrance.',
    location: { lat: 12.9716, lng: 77.5946, address: 'Central Park East' },
    status: ReportStatus.ACKNOWLEDGED,
    reporterName: 'Rahul Sharma',
    timestamp: '2024-04-20T10:30:00Z',
    expectedTimeline: 'Within 24 hours',
    resolutionAction: 'Welfare team dispatched for behavioral assessment.'
  }
];
