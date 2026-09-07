// SIMON Mobile Worker App — Mock Data

export const worker = {
  name: 'Devon',
  email: 'devon@simon.com',
};

export const jobs = [
  {
    id: 'abc',
    customer: 'Sunrise Constructions',
    status: 'In Progress' as const,
    date: '2026-06-04',
    address: '12 Harbour View Rd, Sydney NSW 2000',
    workedHours: '3h 20m',
    plannedHours: '8h',
    progress: 42,
    description: 'Interior painting — Level 3',
    rooms: ['Kitchen', 'Bedroom 1', 'Bedroom 2', 'Living Room'],
    tasks: ['Prep walls', 'First coat', 'Second coat', 'Touch-up'],
  },
  {
    id: 'def',
    customer: 'Pacific Build Group',
    status: 'Upcoming' as const,
    date: '2026-06-05',
    address: '88 Miller St, North Sydney NSW 2060',
    workedHours: '0h',
    plannedHours: '6h',
    description: 'Exterior painting — Ground floor',
    rooms: ['Garage', 'Front entry'],
    tasks: ['Prep surfaces', 'Primer coat', 'Finish coat'],
    progress: 0,
  },
];

export const hazards = [
  'Grinding wrought iron', 'Electrical hazards', 'Slippery surfaces',
  'Working at heights', 'Heavy machinery', 'Chemical exposure',
];

export const dailyConditions = ['Heat', 'Windy', 'Rain', 'Dust', 'Cold', 'Humid'];

export const safetyEquipment = ['Gloves', 'Safety shoes', 'Goggles', 'Hard hat', 'Hi-vis vest', 'Ear protection'];

export const hafQuestions = [
  'Can the crew communicate effectively with each other without restrictions due to high noise, restricted vision, or language barriers?',
  'If confined products or compounds are being used, is the crew aware of hazards and safety controls?',
  'Have workers been encouraged to make suggestions to improve safety?',
  'Has the crew been advised to report unsafe acts or conditions?',
];

export const safetyQuestions = [
  'Do you agree with the information highlighted in the toolbox talk document?',
  'Do you have all the tools necessary to complete your work safely?',
  'Do you understand how to use the equipment?',
  'Are you comfortable with what you need to do?',
];
