const fs = require('fs');
const path = require('path');

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Neha', 'Rahul', 'Kavya',
  'Alex', 'Sarah', 'Marcus', 'Elena', 'David', 'James', 'Lucas', 'Priya', 'Sophia', 'Ethan',
  'Aaliyah', 'Benjamin', 'Chloe', 'Daniel', 'Emma', 'Felix', 'Grace', 'Henry', 'Isla', 'Jack',
  'Kabir', 'Meera', 'Tanya', 'Dev', 'Ishaan', 'Riya', 'Arjun', 'Diya', 'Karan', 'Pooja',
  'Amit', 'Sunita', 'Rajesh', 'Preeti', 'Suresh', 'Deepika', 'Manish', 'Nisha', 'Alok', 'Swati'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Joshi', 'Mehta', 'Reddy', 'Nair',
  'Rivera', 'Jenkins', 'Vance', 'Rostova', 'Chen', 'Wilson', 'Thorne', 'Smith', 'Johnson', 'Brown',
  'Davis', 'Miller', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Clark',
  'Rao', 'Deshmukh', 'Chowdhury', 'Mukherjee', 'Bose', 'Iyengar', 'Pillai', 'Saxena', 'Kapoor', 'Malhotra'
];

const DEPARTMENTS = [
  { name: 'Engineering', teams: ['Frontend Core', 'Backend Services', 'DevOps & Infra', 'QA Automation', 'Mobile Apps'] },
  { name: 'Product', teams: ['Core UX/UI', 'Product Analytics', 'Platform Roadmap'] },
  { name: 'Design', teams: ['Brand Systems', 'Product Design', 'Research'] },
  { name: 'People & Culture', teams: ['Workplace Ops', 'Talent Acquisition', 'HRBP'] },
  { name: 'Marketing', teams: ['Growth & SEO', 'Content Strategy', 'Event Ops'] },
  { name: 'Finance & Legal', teams: ['Corporate Finance', 'Legal Compliance'] }
];

const MANAGERS = [
  'Sarah Jenkins (Head of Workplace Ops)',
  'Marcus Vance (Global Facilities Admin)',
  'David Chen (Backend Tech Lead)',
  'Elena Rostova (Lead Product Manager)',
  'James Wilson (Principal UX Architect)',
  'Aarav Sharma (Engineering Director)',
  'Vikram Joshi (VP of Product)'
];

const STATUSES = ['green', 'green', 'green', 'white', 'yellow', 'red', 'blue', 'orange'];

function generateEmployeesSql() {
  const values = [];

  for (let i = 1; i <= 999; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const name = `${fn} ${ln}${i > 200 ? ` ${i}` : ''}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@deskit.io`;

    const deptObj = DEPARTMENTS[i % DEPARTMENTS.length];
    const team = deptObj.teams[i % deptObj.teams.length];
    const manager = MANAGERS[i % MANAGERS.length];
    const status = STATUSES[i % STATUSES.length];

    const locations = [];
    if (i <= 325) {
      locations.push('Noida 6th Floor');
    } else if (i <= 650) {
      locations.push('Noida 4th Floor');
    } else {
      locations.push('Hyderabad Office');
    }

    if (i <= 8) {
      locations.push('Noida 4th Floor');
    } else if (i <= 16) {
      locations.push('Noida 6th Floor');
    } else if (i === 17) {
      locations.push('Hyderabad Office');
    }

    const empId = `EMP-${1000 + i}`;
    const avatar = `https://images.unsplash.com/photo-${1500000000000 + (i % 50) * 10000}?w=150&auto=format&fit=crop&q=80`;

    const escapedName = name.replace(/'/g, "''");
    const escapedEmail = email.replace(/'/g, "''");
    const escapedTeam = team.replace(/'/g, "''");
    const escapedManager = manager.replace(/'/g, "''");
    const escapedDept = deptObj.name.replace(/'/g, "''");
    const locArrayStr = `ARRAY[${locations.map(l => `'${l.replace(/'/g, "''")}'`).join(', ')}]`;

    values.push(`('${empId}', '${escapedName}', '${escapedEmail}', '${escapedTeam}', '${escapedManager}', '${escapedDept}', ${locArrayStr}, '${status}', '${avatar}')`);
  }

  return values;
}

const employeesSqlRows = generateEmployeesSql();

const seedContent = `-- DeskIT Supabase Database Initial Data Seed
-- Contains workspaces, element types, floor maps, all 999 employee records, and seat assignments.

-- 1. WORKSPACES
INSERT INTO workspaces (workspace_id, name, floor, block, building, city, country, scale) VALUES
('ws-noida-6', 'Noida Tech Tower - Floor 6', '6th Floor', 'Block A', 'Tower 1', 'Noida', 'India', 4),
('ws-noida-4', 'Noida Tech Tower - Floor 4', '4th Floor', 'Block B', 'Tower 1', 'Noida', 'India', 4),
('ws-hyd', 'Hyderabad Cyber Hub', '2nd Floor', 'Wing C', 'Building 3', 'Hyderabad', 'India', 4)
ON CONFLICT (workspace_id) DO NOTHING;

-- 2. ELEMENT TYPES
INSERT INTO element_types (element_id, category, element_name, dimensions, associated_ui) VALUES
('elem-desk-single', 'desk', 'Standard Workstation Desk', '{"widthFinest": 8, "heightFinest": 6}', '{"icon": "Monitor", "color": "#3B82F6", "description": "Single monitor standard ergonomic desk"}'),
('elem-desk-standing', 'desk', 'Motorized Standing Desk', '{"widthFinest": 8, "heightFinest": 6}', '{"icon": "Sparkles", "color": "#8B5CF6", "description": "Height adjustable standing desk with dual monitors"}'),
('elem-room-meeting', 'room', 'Conference Room', '{"widthFinest": 24, "heightFinest": 16}', '{"icon": "Users", "color": "#10B981", "description": "Equipped with video conferencing and whiteboard"}'),
('elem-pillar-structural', 'pillar', 'Building Support Pillar', '{"widthFinest": 4, "heightFinest": 4}', '{"icon": "Square", "color": "#64748B", "description": "Structural concrete column"}'),
('elem-amenity-coffee', 'amenity', 'Coffee & Snack Bar', '{"widthFinest": 16, "heightFinest": 12}', '{"icon": "Coffee", "color": "#F59E0B", "description": "Breakout beverage counter"}')
ON CONFLICT (element_id) DO NOTHING;

-- 3. 999 EMPLOYEES (Full Multi-Location & 6-Color Status Dataset)
INSERT INTO employees (emp_id, name, email, team, manager, department, locations, status, avatar) VALUES
${employeesSqlRows.join(',\n')}
ON CONFLICT (emp_id) DO NOTHING;

-- 4. FLOOR MAPS
INSERT INTO floor_maps (floor_map_id, workspace_id, name, floor_config, geometry_entities, is_published) VALUES
(
    'map-noida-6a',
    'ws-noida-6',
    'Floor 6 - Tech & Engineering Hub',
    '{"gridWidth": 40, "gridHeight": 24, "fineScale": 4, "snapGridSize": 1, "orientation": 0}',
    '[]',
    TRUE
)
ON CONFLICT (floor_map_id) DO NOTHING;

-- Link active floor map to workspace
UPDATE workspaces SET active_floor_map_id = 'map-noida-6a' WHERE workspace_id = 'ws-noida-6';

-- 5. SEAT ASSIGNMENTS (Permanent and Temporary Seats)
INSERT INTO seat_assignments (floor_map_id, desk_code, emp_id, assignment_type, is_temporary, start_date, end_date, notes, status) VALUES
('map-noida-6a', 'A-101', 'EMP-1001', 'permanent', FALSE, NULL, NULL, 'Permanent lead desk', 'active'),
('map-noida-6a', 'A-102', 'EMP-1002', 'permanent', FALSE, NULL, NULL, 'UI/UX Lead desk', 'active'),
('map-noida-6a', 'A-103', 'EMP-1003', 'temporary', TRUE, '2026-09-20T00:00:00Z', '2026-10-20T00:00:00Z', 'Temporary relocation for Sprint 4 project', 'active'),
('map-noida-6a', 'B-201', 'EMP-1006', 'temporary', TRUE, '2026-09-22T00:00:00Z', '2026-09-30T00:00:00Z', 'HR Onboarding temp desk', 'active')
ON CONFLICT DO NOTHING;
`;

const targetPath = path.join(__dirname, '..', 'backend', 'supabase', 'seed.sql');
fs.writeFileSync(targetPath, seedContent, 'utf8');
console.log('Successfully generated backend/supabase/seed.sql with 999 employee SQL insert records!');
