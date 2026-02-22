export interface Passenger {
  id: string;
  name: string;
  type: 'merchant' | 'cook' | 'scholar' | 'guard';
  bonusText: string;
}

export interface Transaction {
  id: string;
  amount: number;
  tokensPaid: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  purpose: string;
}

export interface PaymentPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  icon: string;
}

export interface PlayerProfile {
  name: string;
  contact: string;
  state: string;
  id: string;
  literacyScore: number;
  optimizationScore: number;
  advisoryTokens: number;
  transactions: Transaction[];
}

export interface Document {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'missing' | 'pending';
  expiryMonth?: number;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  initialCredits: number;
  initialEnergy: number;
  initialTrust: number;
  setup: {
    income: string;
    location: string;
    family: string;
    docs: string[];
  };
}

export type VehicleType = 'caravan' | 'bike' | 'truck' | 'car' | 'train';

export type ThemeType = 'desert' | 'neon' | 'frozen' | 'toxic';

export interface ResourceState {
  food: number;
  gold: number;
  reputation: number;
  journeyCount: number;
  progress: number; // 0 to 100
  lives: number;
  score: number;
  passengers: Passenger[];
  vehicle: VehicleType;
  selectedRole?: UserRole;
  monthsElapsed: number;
  playerProfile?: PlayerProfile;
  documents: Document[];
}

export interface Choice {
  id: string;
  text: string;
  consequenceText: string;
  reputationCost?: number;
  goldCost?: number;
  foodCost?: number;
  reputationGain?: number;
  goldGain?: number;
  foodGain?: number;
  advisoryTokenCost?: number;
  flagToSet?: string;
  probability?: number; // 0 to 100
  requiredFlag?: string;
  requiredPassengerType?: 'merchant' | 'cook' | 'scholar' | 'guard';
  action?: 'continue_journey' | 'end_journey' | 'remove_passenger';
  color?: string; // Add color for UI punch
}

export interface Encounter {
  id: string;
  title: string;
  description: string;
  icon: string;
  choices: Choice[];
}

export interface NPC {
  id: string;
  x: number;
  y: number;
  type: 'terminal' | 'auditor' | 'agent' | 'specialist' | 'haven' | 'energy_node' | 'person' | 'coin' | 'mystery_box';
  encounterId: string;
  width: number;
  height: number;
  speedMultiplier: number;
  passengerData?: Passenger;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type VictoryType = 'hero' | 'peace' | 'merchant_prince' | 'iron_monger' | 'survivor';

export type GameStatus = 'title' | 'authenticated' | 'role_select' | 'dashboard' | 'playing' | 'encounter' | 'gameover' | 'victory' | 'vehicle_select' | 'lottery';

export type ControlMode = 'caravan' | 'person';
