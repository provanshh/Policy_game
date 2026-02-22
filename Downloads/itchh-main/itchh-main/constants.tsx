import React from 'react';
import { ResourceState, UserRole } from './types';

export const INITIAL_RESOURCES: ResourceState = {
  food: 100,
  gold: 32,
  reputation: 0,
  journeyCount: 1,
  progress: 0,
  lives: 3,
  score: 0,
  passengers: [],
  vehicle: 'caravan',
  monthsElapsed: 0,
  documents: [
    { id: 'doc_id', name: 'Identity Card', status: 'active' },
    { id: 'doc_land', name: 'Land Record', status: 'missing' },
    { id: 'doc_income', name: 'Income Certificate', status: 'expired' }
  ],
  playerProfile: undefined
};

export const USER_ROLES: UserRole[] = [
  {
    id: 'farmer',
    name: 'Small Farmer',
    description: 'Struggling with crop cycles and land records.',
    initialCredits: 200,
    initialEnergy: 100,
    initialTrust: 10,
    setup: {
      income: 'Low',
      location: 'Rural Sector 7',
      family: '5 members',
      docs: ['Land Record', 'Identity Card']
    }
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Seeking scholarships and digital literacy.',
    initialCredits: 50,
    initialEnergy: 120,
    initialTrust: 5,
    setup: {
      income: 'Dependent',
      location: 'Urban Zone B',
      family: 'Solo',
      docs: ['College ID', 'Income Certificate']
    }
  },
  {
    id: 'senior',
    name: 'Senior Citizen',
    description: 'Navigating pension schemes and health benefits.',
    initialCredits: 150,
    initialEnergy: 60,
    initialTrust: 40,
    setup: {
      income: 'Pension',
      location: 'Suburban Area',
      family: 'Spouse',
      docs: ['Retirement Proof', 'Age Proof']
    }
  },
  {
    id: 'parent',
    name: 'Single Parent',
    description: 'Balancing child support and housing benefits.',
    initialCredits: 80,
    initialEnergy: 70,
    initialTrust: 25,
    setup: {
      income: 'Minimum Wage',
      location: 'Urban Sector 4',
      family: '2 Children',
      docs: ['Custody Docs', 'Housing Proof']
    }
  }
];

export const WORLD_WIDTH = 1200;
export const WORLD_HEIGHT = 600;
export const ROAD_TOP = 150;
export const ROAD_BOTTOM = 450;
export const PLAYER_SPEED = 5;
export const SCROLL_SPEED = 2.5;
export const FOOD_DRAIN_RATE = 0.05;
export const INTERACTION_RANGE = 60;

export const WORLD_COLORS = {
  road: '#866043',     // Dirt path
  grass: '#55aa33',    // Grass block
  caravan: '#fbbf24',
  highlight: '#ffffff',
  node: '#7a7a7a',     // Stone block
};

export const Icons = {
  Food: () => (
    <div className="w-6 h-6 bg-red-600 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">🔋</div>
  ),
  Gold: () => (
    <div className="w-6 h-6 bg-yellow-400 border-2 border-black flex items-center justify-center text-[10px] text-black font-bold">🪙</div>
  ),
  Reputation: () => (
    <div className="w-6 h-6 bg-blue-500 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">⭐</div>
  ),
};