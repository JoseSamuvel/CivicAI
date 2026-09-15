/**
 * Generate a unique complaint ID.
 * Format: CR-2025-XXXX (e.g. CR-2025-4821)
 */
function generateComplaintId() {
  const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit: 1000–9999
  return `CR-2025-${rand}`;
}

/**
 * Generate a formal reference number.
 * Format: REF-TN-2025-XXXXXX (e.g. REF-TN-2025-483921)
 */
function generateReferenceNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000); // 6-digit: 100000–999999
  return `REF-TN-2025-${rand}`;
}

module.exports = { generateComplaintId, generateReferenceNumber };
