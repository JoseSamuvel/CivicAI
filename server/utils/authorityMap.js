/**
 * Maps each civic issue type to the responsible Tamil Nadu authority.
 */
const AUTHORITY_MAP = {
  'Potholes / Road damage': {
    name: 'Public Works Department (PWD)',
    email: 'pwd.tirunelveli@tn.gov.in',
    department: 'PWD'
  },
  'Streetlight failure': {
    name: 'Tamil Nadu Electricity Board (TNEB)',
    email: 'ee.tirunelveli@tangedco.gov.in',
    department: 'TNEB'
  },
  'Power outage': {
    name: 'Tamil Nadu Electricity Board (TNEB)',
    email: 'ee.tirunelveli@tangedco.gov.in',
    department: 'TNEB'
  },
  'Poor public transport': {
    name: 'Tamil Nadu State Transport Corporation (TNSTC)',
    email: 'md.tnstc.tirunelveli@tn.gov.in',
    department: 'TNSTC'
  },
  'Garbage / Waste accumulation': {
    name: 'Tirunelveli Municipal Corporation - Sanitation',
    email: 'sanitation.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  },
  'Water pipe leakage': {
    name: 'Tamil Nadu Water Supply & Drainage Board (TWAD)',
    email: 'ee.twad.tirunelveli@tn.gov.in',
    department: 'TWAD'
  },
  'Drinking water shortage': {
    name: 'Tamil Nadu Water Supply & Drainage Board (TWAD)',
    email: 'ee.twad.tirunelveli@tn.gov.in',
    department: 'TWAD'
  },
  'Sewage overflow': {
    name: 'Tirunelveli Municipal Corporation - Drainage',
    email: 'drainage.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  },
  'Illegal waste dumping': {
    name: 'Tirunelveli Municipal Corporation',
    email: 'commissioner.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  },
  'Traffic / Signal issue': {
    name: 'Tamil Nadu Traffic Police - Tirunelveli',
    email: 'sp.traffic.tirunelveli@tnpolice.gov.in',
    department: 'Traffic Police'
  },
  'Broken public infrastructure': {
    name: 'Public Works Department (PWD)',
    email: 'pwd.tirunelveli@tn.gov.in',
    department: 'PWD'
  },
  'Flooding / Drainage issue': {
    name: 'Tirunelveli Municipal Corporation - Drainage',
    email: 'drainage.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  },
  'Stray animal problem': {
    name: 'Municipal Animal Welfare Department',
    email: 'animalwelfare.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  }
};

module.exports = { AUTHORITY_MAP };
