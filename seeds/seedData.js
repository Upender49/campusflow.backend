/**
 * Seed Script — College ERP Portal
 * Run: npm run seed (from /backend directory)
 * Uses REAL Hyderabad college logos from /frontend/src/assets/
 * Inserts: 1 portal admin + 10 real colleges (5 pending, 3 approved, 2 rejected)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PortalAdmin = require('../models/PortalAdmin');
const College = require('../models/College');
const CollegeAdmin = require('../models/CollegeAdmin');
const HelpQuery = require('../models/HelpQuery');

const MONGODB_URI = process.env.MONGODB_URI;

// ─── PORTAL ADMIN ─────────────────────────────────────────────────────────────
const portalAdminData = {
  name: 'Dr. Rajesh Kumar',
  email: 'admin@collegeerp.in',
  password: 'Admin@123',
  role: 'superadmin',
};

const now = new Date();
const daysAgo = (d) => new Date(now - d * 86400000);
const hoursAgo = (h) => new Date(now - h * 3600000);

// ─── COLLEGES ─────────────────────────────────────────────────────────────────
const collegesData = [

  // ══════════════ PENDING (5) ══════════════

  {
    collegeName: 'Kamala Institute of Technology & Science',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'KITSW',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A',
    nirfRanking: '245',
    domain: 'Engineering & Technology',
    establishedYear: 2000,
    websites: ['https://kitsw.ac.in'],
    logo: 'kitsw_logo.png',
    campuses: [{
      campusName: 'Main Campus',
      addressLine: 'Singapur, Huzurabad',
      city: 'Karimnagar',
      state: 'Telangana',
      pincode: '505468',
      latitude: '18.2036',
      longitude: '79.4153',
    }],
    phones: ['+91 9876543210'],
    landlines: ['08724-234567'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'Suresh', lastName: 'Reddy', gender: 'Male', email: 'principal@kitsw.ac.in', phones: ['+91 9876501001'], landlines: ['08724-234567'] },
      { prefix: 'Prof.', firstName: 'Anitha', lastName: 'Sharma', gender: 'Female', email: 'registrar@kitsw.ac.in', phones: ['+91 9876501002'], landlines: ['08724-234568'] },
    ],
    status: 'pending',
    logs: [{ action: 'CREATED', message: 'College registration form submitted online', performedBy: 'System', timestamp: daysAgo(5) }],
  },

  {
    collegeName: 'Chaitanya Bharathi Institute of Technology',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'CBIT',
    affiliatedTo: 'Osmania University',
    naacGrade: 'A+',
    nirfRanking: '120',
    domain: 'Engineering & Technology',
    establishedYear: 1979,
    websites: ['https://cbit.ac.in'],
    logo: 'cbit_logo.png',
    campuses: [{
      campusName: 'Gandipet Campus',
      addressLine: 'Gandipet, Kokapet Road',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500075',
      latitude: '17.3910',
      longitude: '78.3430',
    }],
    phones: ['+91 4023193276'],
    landlines: ['040-23193276'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'C. Naga', lastName: 'Raju', gender: 'Male', email: 'principal@cbit.ac.in', phones: ['+91 9849000021'], landlines: ['040-23193276'] },
      { prefix: 'Dr.', firstName: 'Vijaya', lastName: 'Lakshmi', gender: 'Female', email: 'dean@cbit.ac.in', phones: ['+91 9849000022'], landlines: ['040-23193277'] },
    ],
    status: 'pending',
    logs: [{ action: 'CREATED', message: 'CBIT registration submitted', performedBy: 'System', timestamp: daysAgo(3) }],
  },

  {
    collegeName: 'Gokaraju Rangaraju Institute of Engineering & Technology',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'GRIET',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A+',
    nirfRanking: '145',
    domain: 'Engineering & Technology',
    establishedYear: 1997,
    websites: ['https://griet.ac.in'],
    logo: 'griet_logo.png',
    campuses: [
      { campusName: 'Bachupally Campus', addressLine: 'Bachupally, Miyapur', city: 'Hyderabad', state: 'Telangana', pincode: '500090', latitude: '17.5406', longitude: '78.3561' },
      { campusName: 'Nizampet Road Campus', addressLine: 'Nizampet Road, Bachupally', city: 'Hyderabad', state: 'Telangana', pincode: '500090', latitude: '17.5350', longitude: '78.3520' },
    ],
    phones: ['+91 4023044442', '+91 4023044443'],
    landlines: ['040-23044442'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'Janaki Ram', lastName: 'Vemuri', gender: 'Male', email: 'principal@griet.ac.in', phones: ['+91 9849000031'], landlines: ['040-23044442'] },
    ],
    status: 'pending',
    logs: [{ action: 'CREATED', message: 'GRIET registration submitted', performedBy: 'System', timestamp: daysAgo(7) }],
  },

  {
    collegeName: 'CVR College of Engineering',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'CVR',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A',
    nirfRanking: '198',
    domain: 'Engineering & Technology',
    establishedYear: 2002,
    websites: ['https://cvr.ac.in'],
    logo: 'cvr_logo.png',
    campuses: [{ campusName: 'Vastunagar Campus', addressLine: 'Vastunagar, Mangalpally', city: 'Hyderabad', state: 'Telangana', pincode: '501510', latitude: '17.3101', longitude: '78.2798' }],
    phones: ['+91 9912300001'],
    landlines: ['08415-231002'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'Ramana', lastName: 'Rao', gender: 'Male', email: 'principal@cvr.ac.in', phones: ['+91 9912300001'], landlines: ['08415-231002'] },
      { prefix: 'Mrs.', firstName: 'Swapna', lastName: 'Reddy', gender: 'Female', email: 'registrar@cvr.ac.in', phones: ['+91 9912300002'], landlines: ['08415-231003'] },
    ],
    status: 'pending',
    logs: [{ action: 'CREATED', message: 'CVR College registration submitted online', performedBy: 'System', timestamp: daysAgo(2) }],
  },

  {
    collegeName: 'Sreenidhi Institute of Science & Technology',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'SNIST',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A+',
    nirfRanking: '176',
    domain: 'Engineering & Technology',
    establishedYear: 1997,
    websites: ['https://sreenidhi.edu.in'],
    logo: 'snist_logo.png',
    campuses: [{ campusName: 'Ghatkesar Campus', addressLine: 'Yamnampet, Ghatkesar', city: 'Hyderabad', state: 'Telangana', pincode: '501301', latitude: '17.4594', longitude: '78.7085' }],
    phones: ['+91 9000111222'],
    landlines: ['040-65589911'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'K.', lastName: 'Suvarna Vani', gender: 'Female', email: 'principal@sreenidhi.edu.in', phones: ['+91 9000111222'], landlines: ['040-65589911'] },
    ],
    status: 'pending',
    logs: [{ action: 'CREATED', message: 'SNIST registration submitted', performedBy: 'System', timestamp: daysAgo(1) }],
  },

  // ══════════════ APPROVED (3) ══════════════

  {
    collegeName: 'Osmania University',
    category: 'University',
    codeType: 'CET',
    code: 'OU',
    affiliatedTo: 'UGC Autonomous',
    naacGrade: 'A+',
    nirfRanking: '42',
    domain: 'Multi-disciplinary',
    establishedYear: 1918,
    websites: ['https://osmania.ac.in', 'https://ouadmissions.com'],
    logo: 'ou_logo.png',
    campuses: [
      { campusName: 'Main Campus — Tarnaka', addressLine: 'University Road, Tarnaka', city: 'Hyderabad', state: 'Telangana', pincode: '500007', latitude: '17.4145', longitude: '78.5341' },
      { campusName: 'College of Engineering', addressLine: 'Amberpet, University Road', city: 'Hyderabad', state: 'Telangana', pincode: '500007', latitude: '17.4155', longitude: '78.5310' },
    ],
    phones: ['+91 4027006000', '+91 4027006001'],
    landlines: ['040-27006000'],
    contactPersons: [
      { prefix: 'Prof.', firstName: 'Damodar', lastName: 'Reddy', gender: 'Male', email: 'vc@osmania.ac.in', phones: ['+91 9490000001'], landlines: ['040-27006000'] },
      { prefix: 'Dr.', firstName: 'Srilatha', lastName: 'Mukherjee', gender: 'Female', email: 'registrar@osmania.ac.in', phones: ['+91 9490000002'], landlines: ['040-27006001'] },
    ],
    status: 'approved',
    logs: [
      { action: 'CREATED', message: 'Osmania University registered in portal', performedBy: 'System', timestamp: daysAgo(20) },
      { action: 'VIEWED', message: 'College profile reviewed by portal admin', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(15) },
      { action: 'APPROVED', message: 'All documents verified. Approved by Dr. Rajesh Kumar.', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(14) },
    ],
  },

  {
    collegeName: 'Jawaharlal Nehru Technological University Hyderabad',
    category: 'University',
    codeType: 'EAMCET',
    code: 'JNTUH',
    affiliatedTo: 'UGC Autonomous',
    naacGrade: 'A+',
    nirfRanking: '68',
    domain: 'Engineering & Technology',
    establishedYear: 1972,
    websites: ['https://jntuh.ac.in'],
    logo: 'jntuh_logo.png',
    campuses: [{ campusName: 'Kukatpally Campus', addressLine: 'Kukatpally, JNTU Road', city: 'Hyderabad', state: 'Telangana', pincode: '500085', latitude: '17.4947', longitude: '78.3996' }],
    phones: ['+91 4023158661'],
    landlines: ['040-23158661'],
    contactPersons: [
      { prefix: 'Prof.', firstName: 'Muralidhar', lastName: 'Rao', gender: 'Male', email: 'vc@jntuh.ac.in', phones: ['+91 9849000011'], landlines: ['040-23158661'] },
      { prefix: 'Dr.', firstName: 'Rekha', lastName: 'Kumari', gender: 'Female', email: 'registrar@jntuh.ac.in', phones: ['+91 9849000012'], landlines: ['040-23158662'] },
    ],
    status: 'approved',
    logs: [
      { action: 'CREATED', message: 'JNTUH registration submitted', performedBy: 'System', timestamp: daysAgo(25) },
      { action: 'APPROVED', message: 'Premier institution — approved after fast-track review by Dr. Rajesh Kumar', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(22) },
      { action: 'ADMIN_CREATED', message: 'Admin account created for Dr. Rekha Kumari (registrar@jntuh.ac.in) — UserID: JNTU4F2A9C', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(20) },
    ],
  },

  {
    collegeName: 'VNR Vignana Jyothi Institute of Engineering & Technology',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'VNRVJIET',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A+',
    nirfRanking: '109',
    domain: 'Engineering & Technology',
    establishedYear: 1992,
    websites: ['https://vnrvjiet.ac.in'],
    logo: 'vnrvjiet_logo.png',
    campuses: [{ campusName: 'Bachupally Campus', addressLine: 'Bachupally, Nizampet X Road', city: 'Hyderabad', state: 'Telangana', pincode: '500090', latitude: '17.5450', longitude: '78.3580' }],
    phones: ['+91 4042462100'],
    landlines: ['040-42462100'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'D.N.', lastName: 'Rao', gender: 'Male', email: 'principal@vnrvjiet.ac.in', phones: ['+91 9849111001'], landlines: ['040-42462100'] },
      { prefix: 'Dr.', firstName: 'Anandam', lastName: 'Babu', gender: 'Male', email: 'dean@vnrvjiet.ac.in', phones: ['+91 9849111002'], landlines: ['040-42462101'] },
    ],
    status: 'approved',
    logs: [
      { action: 'CREATED', message: 'VNR VJIET registration submitted', performedBy: 'System', timestamp: daysAgo(30) },
      { action: 'VIEWED', message: 'College profile reviewed by portal admin', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(28) },
      { action: 'APPROVED', message: 'NAAC A+ verified. Approved by Dr. Rajesh Kumar.', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(27) },
    ],
  },

  // ══════════════ REJECTED (2) ══════════════

  {
    collegeName: 'Mahatma Gandhi Institute of Technology',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'MGIT',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'B+',
    nirfRanking: 'N/A',
    domain: 'Engineering & Technology',
    establishedYear: 1997,
    websites: ['https://mgit.ac.in'],
    logo: 'mgit_logo.jpeg',
    campuses: [{ campusName: 'Gandipet Campus', addressLine: 'Kokapet, Gandipet', city: 'Hyderabad', state: 'Telangana', pincode: '500075', latitude: '17.3886', longitude: '78.3251' }],
    phones: ['+91 4023014022'],
    landlines: ['040-23014022'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'M.V.', lastName: 'Reddy', gender: 'Male', email: 'principal@mgit.ac.in', phones: ['+91 9100234567'], landlines: ['040-23014022'] },
    ],
    status: 'rejected',
    logs: [
      { action: 'CREATED', message: 'MGIT registration submitted', performedBy: 'System', timestamp: daysAgo(18) },
      { action: 'VIEWED', message: 'Profile reviewed — documents found incomplete', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(16) },
      { action: 'REJECTED', message: 'Rejected — NAAC B+ is below minimum threshold of A. Missing NIRF ranking data.', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(15) },
    ],
  },

  {
    collegeName: 'BVRIT Hyderabad College of Engineering for Women',
    category: 'Engineering',
    codeType: 'EAMCET',
    code: 'BVRIT',
    affiliatedTo: 'JNTU Hyderabad',
    naacGrade: 'A',
    nirfRanking: 'N/A',
    domain: 'Engineering (Women)',
    establishedYear: 2009,
    websites: ['https://bvrithyderabad.edu.in'],
    logo: 'bvrit_logo.png',
    campuses: [{ campusName: 'Bachupally Campus', addressLine: 'Ramachandrapuram, Bachupally', city: 'Hyderabad', state: 'Telangana', pincode: '500090', latitude: '17.5520', longitude: '78.3340' }],
    phones: ['+91 9944556677'],
    landlines: ['040-23044700'],
    contactPersons: [
      { prefix: 'Dr.', firstName: 'P.', lastName: 'Usha Rani', gender: 'Female', email: 'principal@bvrithyderabad.edu.in', phones: ['+91 9944556677'], landlines: ['040-23044700'] },
      { prefix: 'Ms.', firstName: 'Madhuri', lastName: 'Nair', gender: 'Female', email: 'admissions@bvrithyderabad.edu.in', phones: ['+91 9944556678'], landlines: ['040-23044701'] },
    ],
    status: 'rejected',
    logs: [
      { action: 'CREATED', message: 'BVRIT Hyderabad registration submitted', performedBy: 'System', timestamp: daysAgo(10) },
      { action: 'REJECTED', message: 'Rejected — NIRF ranking not listed. Affiliation documents expired. Reapply with updated documents.', performedBy: 'Dr. Rajesh Kumar', timestamp: daysAgo(8) },
    ],
  },
];

// ─── HELP QUERIES ─────────────────────────────────────────────────────────────
const helpQueriesData = [
  { collegeName: 'Chaitanya Bharathi Institute of Technology', queryTitle: 'Logo upload failed', description: 'We are trying to update our institution logo but getting a 500 error.', status: 'Resolved', createdAt: daysAgo(10) },
  { collegeName: 'Kamala Institute of Technology & Science', queryTitle: 'Admin account locked', description: 'The assigned college admin account is locked due to multiple failed login attempts.', status: 'Pending', createdAt: daysAgo(2) },
  { collegeName: 'Osmania University', queryTitle: 'Fee structure not updating', description: 'The 2024 fee structure PDF is not reflecting on the public portal.', status: 'Resolved', createdAt: daysAgo(8) },
  { collegeName: 'JNTUH', queryTitle: 'API Integration issue', description: 'Our internal ERP is unable to sync student roll numbers with the central API.', status: 'Pending', createdAt: hoursAgo(5) },
  { collegeName: 'CVR College of Engineering', queryTitle: 'Missing course codes', description: 'Several PG level course codes are missing from the dropdown.', status: 'Pending', createdAt: daysAgo(1) },
  { collegeName: 'GRIET', queryTitle: 'Payment gateway timeout', description: 'Students are reporting timeouts during the registration fee payment phase.', status: 'Resolved', createdAt: daysAgo(15) },
  { collegeName: 'VNR VJIET', queryTitle: 'Incorrect NIRF ranking displayed', description: 'Our NIRF ranking for 2023 is 109, but the portal still shows the 2022 rank.', status: 'Pending', createdAt: hoursAgo(12) },
  { collegeName: 'MGIT', queryTitle: 'Re-evaluation request process', description: 'How do we submit a request for re-evaluating our rejected NAAC status?', status: 'Pending', createdAt: daysAgo(3) },
  { collegeName: 'BVRIT', queryTitle: 'Affiliation document upload', description: 'The portal is not accepting PDFs larger than 5MB for affiliation proof.', status: 'Resolved', createdAt: daysAgo(6) },
  { collegeName: 'Sreenidhi Institute', queryTitle: 'Login OTP not received', description: 'The email OTP for new admin registration is delayed by over 30 minutes.', status: 'Pending', createdAt: hoursAgo(2) },
];

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await CollegeAdmin.deleteMany({});
    await College.deleteMany({});
    await PortalAdmin.deleteMany({});
    await HelpQuery.deleteMany({});
    console.log('🗑️  Cleared existing data (Colleges, Admins, HelpQueries)');

    const hashedPwd = await bcrypt.hash(portalAdminData.password, 12);
    await PortalAdmin.create({ ...portalAdminData, password: hashedPwd });
    console.log('👤  Portal admin → email: admin@collegeerp.in | password: Admin@123');

    const inserted = await College.insertMany(collegesData);
    const pending = inserted.filter((c) => c.status === 'pending').length;
    const approved = inserted.filter((c) => c.status === 'approved').length;
    const rejected = inserted.filter((c) => c.status === 'rejected').length;
    console.log(`🏫  ${inserted.length} colleges inserted (Pending:${pending} Approved:${approved} Rejected:${rejected})`);

    const insertedQueries = await HelpQuery.insertMany(helpQueriesData);
    console.log(`💬  ${insertedQueries.length} help queries inserted`);
    console.log('\n✅ Seed completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
