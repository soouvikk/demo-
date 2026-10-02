import { BusinessNote } from '../types/index';

export const INITIAL_NOTES: BusinessNote[] = [
  {
    id: 'note-1',
    title: 'Festival B2B Stock Arrival: Special Schemes on Oral & Personal Care',
    content: 'Fresh consignments of Colgate MaxFresh and Dove Beauty Bars have arrived at the central regional depot. Retailers in Malda and Murshidabad sectors (PIN 732101 - 732145) can request priority delivery through their assigned field representative.',
    visibility: 'PUBLIC',
    category: 'ANNOUNCEMENT',
    isPinned: true,
    createdAt: '2026-10-01T08:00:00Z',
    authorName: 'Central Logistics Desk',
  },
  {
    id: 'note-2',
    title: 'Transparent Pricing & Offline WhatsApp Ordering Notice',
    content: 'GraminMart is a pure product showcase and distribution network. We do not accept online payments or credit cards. All orders are processed offline through your verified local sales representative to prevent counterfeit goods and ensure doorstep billing.',
    visibility: 'PUBLIC',
    category: 'POLICY',
    isPinned: false,
    createdAt: '2026-09-25T10:00:00Z',
    authorName: 'Operations Management',
  },
  {
    id: 'note-3',
    title: 'Monthly Incentive Scheme: 0.05% Volume Booster for L-2 & L-3 Tiers',
    content: 'Juniors achieving more than ₹50,000 incremental billing this month will receive an instant spot reward bonus in addition to their level commission rate.',
    visibility: 'JUNIOR_ONLY',
    category: 'OFFER',
    isPinned: true,
    createdAt: '2026-10-01T09:30:00Z',
    authorName: 'Super Admin',
  },
  {
    id: 'note-4',
    title: 'Audit Warning: Strict Area PIN Adherence Required',
    content: 'Field juniors must only service kiranas within their assigned PIN jurisdictions. Overlapping customer visits without prior Super Admin sign-off will lead to commission forfeiture on disputed sales.',
    visibility: 'ADMIN_ONLY',
    category: 'OPERATIONAL',
    isPinned: false,
    createdAt: '2026-09-28T14:00:00Z',
    authorName: 'Internal Compliance',
  },
];
