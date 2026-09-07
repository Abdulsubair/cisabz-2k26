import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export interface RegistrationData {
  id: string;
  fullName: string;
  collegeName: string;
  department: string;
  year: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  email: string;
  mobile: string;
  ambassadorReferralId?: string;
  foodPreference: 'Veg' | 'Non-Veg';
  technicalEvent: string;
  nonTechnicalEvent: string;
  transactionId: string;
  paymentName: string;
  paymentProofUrl: string;
  paymentProofPath: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface EventRegistrationStatus {
  id: string;
  name: string;
  category: 'technical' | 'non-technical';
  registrationOpen: boolean;
}

export interface FinanceRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  year: 'II Year' | 'III Year' | 'IV Year';
  section: '2nd CSE A' | '2nd CSE B' | '3rd CSE A' | '3rd CSE B' | 'Final CSE';
  department: string;
  feeAmount: number;
  paidAmount: number;
  status: 'PAID' | 'UNPAID';
  paidAt?: string;
  collectedBy?: string;
  isLocked: boolean;
  notes?: string;
  createdAt: string;
}

// Initial Events List
export const INITIAL_EVENTS: Record<string, { name: string; category: 'technical' | 'non-technical'; open: boolean }> = {
  TECHVERSE: { name: 'TECHVERSE', category: 'technical', open: true },
  'TECH BRAINIAC': { name: 'TECH BRAINIAC', category: 'technical', open: true },
  'PROMPT FUSION': { name: 'PROMPT FUSION', category: 'technical', open: true },
  'BUG BASH': { name: 'BUG BASH', category: 'technical', open: true },
  PINPOINT: { name: 'PINPOINT', category: 'non-technical', open: true },
  'BRAND SPOT': { name: 'BRAND SPOT', category: 'non-technical', open: true },
  'HAMMER HIT': { name: 'HAMMER HIT', category: 'non-technical', open: true },
  CONNECTION: { name: 'CONNECTION', category: 'non-technical', open: true },
};

// Firebase Configuration using standard env vars with cisabz26-ec631 project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDEkGzsRkpwZr6MyaVZJx01yfYlryxPrb4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cisabz26-ec631.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cisabz26-ec631',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cisabz26-ec631.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '384425289565',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:384425289565:web:50fff3a89cc9922b5feab4',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-3WE86391FT',
};

// Initialize Firebase App singleton safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Local Storage Fallback Key
const LOCAL_REGISTRATIONS_KEY = 'cisabz_firebase_registrations';
const LOCAL_EVENTS_KEY = 'cisabz_firebase_events';

// Local storage helper methods
function getLocalRegistrations(): RegistrationData[] {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRegistrations(data: RegistrationData[]) {
  try {
    localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function getLocalEvents(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const defaults: Record<string, boolean> = {};
  Object.keys(INITIAL_EVENTS).forEach((evtKey) => {
    defaults[evtKey] = true;
  });
  return defaults;
}

function saveLocalEvents(data: Record<string, boolean>) {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save events to localStorage:', e);
  }
}

/**
 * Normalizes email & mobile for reliable comparison
 */
export function normalizeCredential(val: string): string {
  return val.trim().toLowerCase();
}

/**
 * Check if a participant with the email or mobile has an active (VERIFIED or PENDING) registration.
 * Rejected registrations are ignored, allowing rejected students to re-register with the same email/mobile.
 * Uses a fast Promise timeout to ensure duplicate checks never hang.
 */
export async function checkDuplicateRegistration(email: string, mobile: string): Promise<boolean> {
  const normEmail = normalizeCredential(email);
  const normMobile = normalizeCredential(mobile);

  // 1. Check local fallback immediately (only PENDING or VERIFIED registrations count as duplicates)
  const locals = getLocalRegistrations();
  const isLocalDup = locals.some(
    (r) =>
      r.status !== 'REJECTED' &&
      (normalizeCredential(r.email) === normEmail ||
        normalizeCredential(r.mobile) === normMobile)
  );
  if (isLocalDup) return true;

  // 2. Check Firestore with a 2-second timeout race
  try {
    const firestoreCheck = (async () => {
      const regRef = collection(db, 'registrations');
      
      const qEmail = query(regRef, where('emailNormalized', '==', normEmail));
      const snapshotEmail = await getDocs(qEmail);
      if (!snapshotEmail.empty) {
        const activeDocs = snapshotEmail.docs.filter((docSnap) => {
          const data = docSnap.data();
          return data.status !== 'REJECTED';
        });
        if (activeDocs.length > 0) return true;
      }

      const qMobile = query(regRef, where('mobileNormalized', '==', normMobile));
      const snapshotMobile = await getDocs(qMobile);
      if (!snapshotMobile.empty) {
        const activeDocs = snapshotMobile.docs.filter((docSnap) => {
          const data = docSnap.data();
          return data.status !== 'REJECTED';
        });
        if (activeDocs.length > 0) return true;
      }

      return false;
    })();

    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), 2000)
    );

    return await Promise.race([firestoreCheck, timeoutPromise]);
  } catch (err) {
    console.warn('Firestore duplicate check offline/fallback:', err);
    return false;
  }
}

/**
 * Upload Payment Proof file to Firebase Storage with local Data URL fallback.
 * Uses a 2-second timeout to prevent Firebase Storage hangs from delaying Firestore document creation.
 */
export async function uploadPaymentProof(file: File, regId: string): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop() || 'png';
  const filePath = `payment-proofs/${regId}/${Date.now()}.${fileExt}`;

  // Read file to Data URL first (fast, reliable fallback)
  const readDataUrl = (): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

  let dataUrl = '';
  try {
    dataUrl = await readDataUrl();
  } catch (e) {
    console.warn('Failed to read file preview:', e);
  }

  // Attempt Firebase Storage upload with 2-second timeout
  try {
    const storageRef = ref(storage, filePath);
    const uploadPromise = (async () => {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl, path: filePath };
    })();

    const timeoutPromise = new Promise<{ url: string; path: string }>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 2000)
    );

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firebase storage fast fallback to data URL:', err);
    return {
      url: dataUrl || `data:image/${fileExt};base64,placeholder`,
      path: filePath,
    };
  }
}

/**
 * Generate a unique registration ID (e.g. REG-847291)
 */
export function generateRegistrationId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `REG-${randomNum}`;
}

/**
 * Submit New Registration directly to Firebase Firestore & Storage
 */
export async function submitRegistration(
  formData: {
    fullName: string;
    collegeName: string;
    department: string;
    year: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
    email: string;
    mobile: string;
    ambassadorReferralId?: string;
    foodPreference: 'Veg' | 'Non-Veg';
    technicalEvent: string;
    nonTechnicalEvent: string;
    transactionId: string;
    paymentName: string;
  },
  proofFile: File
): Promise<RegistrationData> {
  // 1. Check duplicate credentials
  const isDuplicate = await checkDuplicateRegistration(formData.email, formData.mobile);
  if (isDuplicate) {
    throw new Error('A participant with this email address or mobile number has already registered.');
  }

  // 2. Generate Registration ID
  const registrationId = generateRegistrationId();

  // 3. Obtain payment proof asset (fast non-blocking upload/dataUrl)
  const proofResult = await uploadPaymentProof(proofFile, registrationId);

  const timestampStr = new Date().toISOString();
  const registrationRecord: RegistrationData = {
    id: registrationId,
    fullName: formData.fullName.trim(),
    collegeName: formData.collegeName.trim(),
    department: formData.department.trim(),
    year: formData.year,
    email: formData.email.trim(),
    mobile: formData.mobile.trim(),
    ambassadorReferralId: formData.ambassadorReferralId?.trim() || '',
    foodPreference: formData.foodPreference,
    technicalEvent: formData.technicalEvent,
    nonTechnicalEvent: formData.nonTechnicalEvent,
    transactionId: formData.transactionId.trim(),
    paymentName: formData.paymentName.trim(),
    paymentProofUrl: proofResult.url,
    paymentProofPath: proofResult.path,
    status: 'PENDING',
    createdAt: timestampStr,
  };

  // 4. Save to Firestore & verify document creation in Cloud Database
  const docRef = doc(db, 'registrations', registrationId);
  const firestoreRecord = {
    ...registrationRecord,
    emailNormalized: normalizeCredential(formData.email),
    mobileNormalized: normalizeCredential(formData.mobile),
    createdAtServer: serverTimestamp(),
  };

  try {
    await setDoc(docRef, firestoreRecord);

    // Verify document was successfully created in Firestore
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Firestore document creation verification failed. Record was not created.');
    }
  } catch (err: any) {
    console.error('Firestore Database Save Error:', err);
    throw new Error(
      err.message || 'Failed to save registration details in Firestore Database. Please check connection and try again.'
    );
  }

  // Cache to local storage for offline resilience
  const currentLocals = getLocalRegistrations();
  saveLocalRegistrations([registrationRecord, ...currentLocals]);

  return registrationRecord;
}

/**
 * Subscribe to Realtime Registrations
 */
export function subscribeRegistrations(callback: (data: RegistrationData[]) => void): () => void {
  try {
    const regRef = collection(db, 'registrations');
    const unsubscribe = onSnapshot(
      regRef,
      (snapshot) => {
        const list: RegistrationData[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: d.id || docSnap.id,
            fullName: d.fullName || '',
            collegeName: d.collegeName || '',
            department: d.department || '',
            year: d.year || 'I Year',
            email: d.email || '',
            mobile: d.mobile || '',
            ambassadorReferralId: d.ambassadorReferralId || '',
            foodPreference: d.foodPreference || 'Veg',
            technicalEvent: d.technicalEvent || '',
            nonTechnicalEvent: d.nonTechnicalEvent || '',
            transactionId: d.transactionId || '',
            paymentName: d.paymentName || '',
            paymentProofUrl: d.paymentProofUrl || '',
            paymentProofPath: d.paymentProofPath || '',
            status: d.status || 'PENDING',
            createdAt: d.createdAt || new Date().toISOString(),
            verifiedAt: d.verifiedAt,
            rejectedAt: d.rejectedAt,
            verifiedBy: d.verifiedBy,
            rejectionReason: d.rejectionReason,
          });
        });
        callback(list);
        saveLocalRegistrations(list);
      },
      (err) => {
        console.warn('Firestore snapshot error:', err);
        callback(getLocalRegistrations());
      }
    );
    return unsubscribe;
  } catch {
    callback(getLocalRegistrations());
    return () => {};
  }
}

/**
 * Delete a registration record permanently from Cloud Firestore and localStorage.
 */
export async function deleteRegistration(registrationId: string): Promise<boolean> {
  try {
    const regRef = doc(db, 'registrations', registrationId);
    await deleteDoc(regRef);
    console.log(`[FIRESTORE] Deleted registration ${registrationId} successfully.`);
  } catch (err) {
    console.error(`[FIRESTORE] Error deleting registration ${registrationId}:`, err);
  }

  // Also remove from localStorage if present
  try {
    const list = getLocalRegistrations();
    const filtered = list.filter((r) => r.id !== registrationId);
    saveLocalRegistrations(filtered);
  } catch (e) {
    console.error('Failed to clean localStorage:', e);
  }

  return true;
}

/**
 * Subscribe to Event Registration Open/Close Statuses
 */
export function subscribeEventStatuses(callback: (statuses: Record<string, boolean>) => void): () => void {
  try {
    const eventsRef = collection(db, 'events');
    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const statuses = getLocalEvents();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            statuses[docSnap.id] = data.registrationOpen !== false;
          });
          callback(statuses);
          saveLocalEvents(statuses);
          return;
        }
        callback(getLocalEvents());
      },
      (err) => {
        console.warn('Firestore events snapshot fallback:', err);
        callback(getLocalEvents());
      }
    );
    return unsubscribe;
  } catch {
    callback(getLocalEvents());
    return () => {};
  }
}

/**
 * Toggle Event Open/Close Registration Status
 */
export async function updateEventStatus(eventId: string, open: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'events', eventId);
    await setDoc(
      docRef,
      {
        name: eventId,
        registrationOpen: open,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore event update fallback to local storage:', err);
  }

  const currentEvents = getLocalEvents();
  currentEvents[eventId] = open;
  saveLocalEvents(currentEvents);
}

/**
 * Verify Participant Registration in Firestore (No Email Sent)
 */
export async function verifyRegistration(registrationId: string, adminUser = 'Admin'): Promise<{ success: boolean }> {
  const verifiedTime = new Date().toISOString();

  // Update Firestore document status to VERIFIED
  const docRef = doc(db, 'registrations', registrationId);
  await updateDoc(docRef, {
    status: 'VERIFIED',
    verifiedAt: verifiedTime,
    verifiedBy: adminUser,
  });

  // Update local storage cache
  const list = getLocalRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index !== -1) {
    list[index].status = 'VERIFIED';
    list[index].verifiedAt = verifiedTime;
    list[index].verifiedBy = adminUser;
    saveLocalRegistrations(list);
  }

  // Verification email completely removed as requested
  return { success: true };
}

/**
 * Reject Participant Registration & Automatically Send Rejection Email
 */
export async function rejectRegistration(registrationId: string, adminUser = 'Admin', reason?: string): Promise<{ success: boolean }> {
  const rejectedTime = new Date().toISOString();
  const rejectionReason = reason?.trim() || "We didn't get your payment.";

  // 1. Update Firestore FIRST. If this fails, function throws and email is NOT sent.
  const docRef = doc(db, 'registrations', registrationId);
  await updateDoc(docRef, {
    status: 'REJECTED',
    rejectedAt: rejectedTime,
    rejectedBy: adminUser,
    rejectionReason: rejectionReason,
  });

  // Extract participant info for email
  let participantEmail = '';
  let participantName = '';
  let techEvt = '';
  let nonTechEvt = '';

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const d = docSnap.data();
      participantEmail = d.email || '';
      participantName = d.fullName || '';
      techEvt = d.technicalEvent || '';
      nonTechEvt = d.nonTechnicalEvent || '';
    }
  } catch (err) {
    console.warn('Doc fetch warning after reject:', err);
  }

  if (!participantEmail) {
    const list = getLocalRegistrations();
    const index = list.findIndex((r) => r.id === registrationId);
    if (index !== -1) {
      list[index].status = 'REJECTED';
      list[index].rejectedAt = rejectedTime;
      list[index].verifiedBy = adminUser;
      list[index].rejectionReason = rejectionReason;
      saveLocalRegistrations(list);

      participantEmail = list[index].email;
      participantName = list[index].fullName;
      techEvt = list[index].technicalEvent;
      nonTechEvt = list[index].nonTechnicalEvent;
    }
  }

  // 2. Automatically send ONLY rejection email AFTER successful Firestore update
  return await sendRejectionEmail({
    to: participantEmail,
    name: participantName,
    regId: registrationId,
    techEvent: techEvt,
    nonTechEvent: nonTechEvt,
    reason: rejectionReason,
  });
}

/**
 * Rejection Email Notification Trigger
 * Transmits automated rejection notification to participant via EmailJS API.
 */
export async function sendRejectionEmail(params: {
  to: string;
  name: string;
  regId: string;
  techEvent: string;
  nonTechEvent: string;
  reason?: string;
}): Promise<{ success: boolean }> {
  const { to, name, regId, techEvent, nonTechEvent, reason } = params;

  console.log(`[EMAIL SERVICE] Transmitting REJECTED notification email to ${to}...`);

  const rejectionReason = reason || "We didn't get your payment.";
  const subject = `Your registration for CISABZ-2K26 has been Rejected!`;
  const bodyText = `Dear ${name},\n\nYour registration for CISABZ-2K26 has been Rejected!\n\nRegistration Details:\n- Registration ID: ${regId}\n- Technical Event: ${techEvent}\n- Non-Technical Event: ${nonTechEvent}\n- Status: Rejected\n\nReason for Rejection: ${rejectionReason}\n\nNote: You can re-register anytime with your correct payment details using the same email address and mobile number at: https://cisabz2k26.vercel.app/#register\n\nBest regards,\nCISABZ-2K26 Team`;

  try {
    // EmailJS Environment Configuration
    const rawServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_yrhiy7r';
    const rawTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_kp3rc53';
    const rawUserId = import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '75tkzr3Sb4Ryc-qxY';

    const emailjsServiceId = rawServiceId.trim();
    const emailjsTemplateId = rawTemplateId.trim().replace(/^y+/, '');
    const emailjsUserId = rawUserId.trim();

    if (emailjsServiceId && emailjsTemplateId && emailjsUserId) {
      console.log('[EMAIL SERVICE] Sending rejection email via EmailJS API...', { service_id: emailjsServiceId, template_id: emailjsTemplateId });

      const payload = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsUserId,
        template_params: {
          to_email: to,
          email: to,
          to_name: name,
          name: name,
          user_name: name,
          participant_name: name,
          reg_id: regId,
          registration_id: regId,
          status: 'REJECTED',
          slot_status: 'Rejected',
          tech_event: techEvent,
          technical_event: techEvent,
          non_tech_event: nonTechEvent,
          non_technical_event: nonTechEvent,
          reason: rejectionReason,
          message: bodyText,
          body_text: bodyText,
          subject: subject,
          reply_to: 'cisabz26@gmail.com',
        },
      };

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('[EMAIL SERVICE] ✅ Successfully delivered rejection email via EmailJS!');
        return { success: true };
      } else {
        const errText = await res.text();
        console.error('[EMAIL SERVICE] EmailJS API returned status:', res.status, errText);
      }
    }

    // Custom Webhook Endpoint Fallback
    const emailEndpoint = import.meta.env.VITE_EMAIL_API_URL;
    if (emailEndpoint) {
      const res = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, name, status: 'REJECTED', regId, techEvent, nonTechEvent, reason: rejectionReason, bodyText }),
      });
      if (res.ok) {
        return { success: true };
      }
    }

    console.log(`[EMAIL PREVIEW] Subject: ${subject}\n\n${bodyText}`);
    return { success: true };
  } catch (err) {
    console.error('[EMAIL SERVICE ERROR]', err);
    return { success: false };
  }
}

// ----------------------------------------------------
// FINANCE RECORDS MANAGEMENT (Firestore & LocalStorage)
// ----------------------------------------------------
const LOCAL_FINANCE_KEY = 'cisabz_firebase_finance_records';

const INITIAL_II_CSE_A: Array<{ roll: string; name: string }> = [
  { roll: '25CSA01', name: 'AATHISH B' },
  { roll: '25CSA02', name: 'ABDUL RAHMAN M' },
  { roll: '25CSA03', name: 'ABINAYA S' },
  { roll: '25CSA04', name: 'ADHIKA S S' },
  { roll: '25CSA05', name: 'AHMED A' },
  { roll: '25CSA06', name: 'AISWARYA K G' },
  { roll: '25CSA07', name: 'AISWARYA S' },
  { roll: '25CSA08', name: 'AJAI BALA K' },
  { roll: '25CSA09', name: 'AMRUTHA A' },
  { roll: '25CSA10', name: 'ANUSH G' },
  { roll: '25CSA11', name: 'ARUTHRA GOVINDARAJ S' },
  { roll: '25CSA12', name: 'ASHINI B' },
  { roll: '25CSA13', name: 'ASRIN SHIFANA M' },
  { roll: '25CSA14', name: 'ASVAN N' },
  { roll: '25CSA15', name: 'ASWIN M' },
  { roll: '25CSA16', name: 'AYYAPPAN M' },
  { roll: '25CSA17', name: 'BALAJI SHANMUGANATHAN S B' },
  { roll: '25CSA18', name: 'BALAKRISHNAN M' },
  { roll: '25CSA19', name: 'BARATH KUMAR L' },
  { roll: '25CSA20', name: 'BHARANI SUBRAJA S' },
  { roll: '25CSA21', name: 'BHAVYA S' },
  { roll: '25CSA22', name: 'BOPDHANUSYA S' },
  { roll: '25CSA23', name: 'DEVA DHARSHINI T' },
  { roll: '25CSA24', name: 'DHARANI K' },
  { roll: '25CSA25', name: 'DHARSHAN P' },
  { roll: '25CSA26', name: 'DHARSHINI J' },
  { roll: '25CSA27', name: 'DHARUN M' },
  { roll: '25CSA28', name: 'DIVYADHARSHINI S' },
  { roll: '25CSA29', name: 'ELAVARASAN T' },
  { roll: '25CSA30', name: 'ESWARAN S' },
  { roll: '25CSA31', name: 'FAHMITHA SULTHANA A' },
  { roll: '25CSA32', name: 'FARIHA M' },
  { roll: '25CSA33', name: 'FATHIMARUFAITHA M' },
  { roll: '25CSA34', name: 'GEETHA S' },
  { roll: '25CSA35', name: 'GOPINATH M' },
  { roll: '25CSA36', name: 'GUNASEELA N' },
  { roll: '25CSA37', name: 'HAMEEDHA M' },
  { roll: '25CSA38', name: 'HARANI S' },
  { roll: '25CSA39', name: 'HARIHARAN M' },
  { roll: '25CSA40', name: 'HARIHARAN R' },
  { roll: '25CSA41', name: 'HARINARAYANAN T' },
  { roll: '25CSA42', name: 'HARSHINI R' },
  { roll: '25CSA43', name: 'HEMALATHA S' },
  { roll: '25CSA44', name: 'IRFAN R' },
  { roll: '25CSA45', name: 'IRSANA RISMIN A' },
  { roll: '25CSA46', name: 'JANANI SRI R' },
  { roll: '25CSA47', name: 'JANNATHUL SUNOFIYA S' },
  { roll: '25CSA48', name: 'JAYA DIVYA J' },
  { roll: '25CSA49', name: 'JAYA HARISH S' },
  { roll: '25CSA50', name: 'JEFRI D' },
  { roll: '25CSA51', name: 'JEGAN R' },
  { roll: '25CSA52', name: 'KABILAN V' },
  { roll: '25CSA53', name: 'KALAIVANI A' },
  { roll: '25CSA54', name: 'KANAKA DURKA T' },
  { roll: '25CSA55', name: 'KANIHA R' },
  { roll: '25CSA56', name: 'KANISH S' },
  { roll: '25CSA57', name: 'KANISHA J' },
  { roll: '25CSA58', name: 'KANISHKA M' },
  { roll: '25CSA59', name: 'KANSHIYA S' },
  { roll: '25CSA60', name: 'KAVISRI S' },
  { roll: '25CSA61', name: 'KAYALVIZHI N' },
  { roll: '25CSA62', name: 'KOUSHIK T' },
  { roll: '25CSA63', name: 'DHARSHAN R' },
  { roll: '25CSA64', name: 'KAVIN M' },
  { roll: '25CSA65', name: 'SARAVANAN S' },
];

const INITIAL_II_CSE_B: Array<{ roll: string; name: string }> = [
  { roll: '25CSB01', name: 'MAHA DHARSHINI M' },
  { roll: '25CSB02', name: 'MANIKANDAN P' },
  { roll: '25CSB03', name: 'MEGARAJAN R' },
  { roll: '25CSB04', name: 'MUKESH S' },
  { roll: '25CSB05', name: 'MULLAIKANNAN A' },
  { roll: '25CSB06', name: 'NAGULAN M' },
  { roll: '25CSB07', name: 'NANDHINI S' },
  { roll: '25CSB08', name: 'NAVEENA B' },
  { roll: '25CSB09', name: 'NISHANTHINI K' },
  { roll: '25CSB10', name: 'NITHERSHANA NESAN M' },
  { roll: '25CSB11', name: 'NITHISHWARAN R' },
  { roll: '25CSB12', name: 'NITHIYASRI J' },
  { roll: '25CSB13', name: 'PARAMESWARI S' },
  { roll: '25CSB14', name: 'PARKAVI R' },
  { roll: '25CSB15', name: 'PAVITHRA K' },
  { roll: '25CSB16', name: 'PRAVEEN S' },
  { roll: '25CSB17', name: 'PRITHINGARAN M' },
  { roll: '25CSB18', name: 'PRIYADHARSHINI B' },
  { roll: '25CSB19', name: 'PRIYADHARSHINI M' },
  { roll: '25CSB20', name: 'PRIYADHARSHINI R' },
  { roll: '25CSB21', name: 'PRIYADHARSHINI R' },
  { roll: '25CSB22', name: 'PUSHPALATHA T' },
  { roll: '25CSB23', name: 'RAGUL M' },
  { roll: '25CSB24', name: 'RAHEEMA BEEVI M' },
  { roll: '25CSB25', name: 'RAJIEPRIYAH D' },
  { roll: '25CSB26', name: 'RAKESH S' },
  { roll: '25CSB27', name: 'RATHIMEENA D' },
  { roll: '25CSB28', name: 'RAYANN M' },
  { roll: '25CSB29', name: 'RUTHRESWARAN G S' },
  { roll: '25CSB30', name: 'SANGARAN J K' },
  { roll: '25CSB31', name: 'SANJAI VASANTH S' },
  { roll: '25CSB32', name: 'SANJITH S' },
  { roll: '25CSB33', name: 'SANKAVI A' },
  { roll: '25CSB34', name: 'SANTHOSH P' },
  { roll: '25CSB35', name: 'SANTHOSH S' },
  { roll: '25CSB36', name: 'SARANYA M' },
  { roll: '25CSB37', name: 'SARUMATHI S' },
  { roll: '25CSB38', name: 'SETHUPATHI G' },
  { roll: '25CSB39', name: 'SHARMISTHA R' },
  { roll: '25CSB40', name: 'SHREE VARSITHA S' },
  { roll: '25CSB41', name: 'SIDHARTHAN S' },
  { roll: '25CSB42', name: 'SIVAELANSERAN R' },
  { roll: '25CSB43', name: 'SRI HARI RAO S' },
  { roll: '25CSB44', name: 'SRI KARTHIK P' },
  { roll: '25CSB45', name: 'SRIBARATHI K' },
  { roll: '25CSB46', name: 'SUVETHA V R' },
  { roll: '25CSB47', name: 'SYED MOHAMED ISHAK R' },
  { roll: '25CSB48', name: 'SYED NASURUDEEN M' },
  { roll: '25CSB49', name: 'TAMILARASAN S' },
  { roll: '25CSB50', name: 'THARANIYA S' },
  { roll: '25CSB51', name: 'THEYKESSH K' },
  { roll: '25CSB52', name: 'THIRUKUMARAN P' },
  { roll: '25CSB53', name: 'THIRUMALAI SELVAN B' },
  { roll: '25CSB54', name: 'VAITHEESWARAN S' },
  { roll: '25CSB55', name: 'VALLARASU C' },
  { roll: '25CSB56', name: 'VASHEEMA M' },
  { roll: '25CSB57', name: 'VENKATESH P' },
  { roll: '25CSB58', name: 'VIJAYA SREE K' },
  { roll: '25CSB59', name: 'VIJAYADARSINI G' },
  { roll: '25CSB60', name: 'VINOTHKUMAR B' },
  { roll: '25CSB61', name: 'VISHALI M' },
  { roll: '25CSB62', name: 'YOGASRI S' },
  { roll: '25CSB63', name: 'YOGESWARI M' },
  { roll: '25CSB64', name: 'ASHIK AMEER A' },
  { roll: '25CSB65', name: 'SREESANTH P' },
  { roll: '25CSB66', name: 'VASANTHAKRISHNAN M' },
  { roll: '25CSB67', name: 'VISHNU SANJAI M' },
];

const INITIAL_III_CSE_A: Array<{ roll: string; name: string }> = [
  { roll: '24CSA01', name: 'AARTHI SREE R N' },
  { roll: '24CSA02', name: 'AATHITHYA B' },
  { roll: '24CSA03', name: 'ABDUL WAHID T' },
  { roll: '24CSA04', name: 'ABHISHEK C K' },
  { roll: '24CSA05', name: 'ABINASH L' },
  { roll: '24CSA06', name: 'ABINAYA P' },
  { roll: '24CSA07', name: 'ABISHEK V' },
  { roll: '24CSA08', name: 'AJAYARAJAN M' },
  { roll: '24CSA09', name: 'AKASH C' },
  { roll: '24CSA10', name: 'ANUSHA T' },
  { roll: '24CSA11', name: 'ARAVINDHAKUMAR A' },
  { roll: '24CSA12', name: 'ARKEMEDES K' },
  { roll: '24CSA13', name: 'ARUNA RANI R' },
  { roll: '24CSA14', name: 'ASMATH FARHANA M' },
  { roll: '24CSA15', name: 'ASWINI R' },
  { roll: '24CSA16', name: 'ATCHAYASRI B' },
  { roll: '24CSA17', name: 'BALAKRITHIKA B' },
  { roll: '24CSA18', name: 'BALUPRIYAN M' },
  { roll: '24CSA19', name: 'BHAVASHREE A' },
  { roll: '24CSA20', name: 'BOWTHAN G R' },
  { roll: '24CSA21', name: 'DARSHINI N' },
  { roll: '24CSA22', name: 'DEEPADHARSHNI G' },
  { roll: '24CSA23', name: 'DEEPIKA S' },
  { roll: '24CSA24', name: 'DEEPIKA S' },
  { roll: '24CSA25', name: 'DEIKSHIDHA J' },
  { roll: '24CSA26', name: 'DEVADHARSHINI R' },
  { roll: '24CSA27', name: 'DHARANIKA B' },
  { roll: '24CSA28', name: 'DHARANIKA K' },
  { roll: '24CSA29', name: 'DHARSHINI R M' },
  { roll: '24CSA30', name: 'DHATCHAYANI K' },
  { roll: '24CSA31', name: 'DIVYAPRAKASH K' },
  { roll: '24CSA32', name: 'DURGADHARSHINI R' },
  { roll: '24CSA33', name: 'GIRIJA K' },
  { roll: '24CSA34', name: 'GIRIJA M' },
  { roll: '24CSA35', name: 'GIRIJA S' },
  { roll: '24CSA36', name: 'GNANALEKA K' },
  { roll: '24CSA37', name: 'GOKUL S' },
  { roll: '24CSA38', name: 'GOKULAVANAN R' },
  { roll: '24CSA39', name: 'GOKULVARTHAN R' },
  { roll: '24CSA40', name: 'GOPIKA V' },
  { roll: '24CSA41', name: 'GOWRISH A' },
  { roll: '24CSA42', name: 'GURUKRISHNAN V' },
  { roll: '24CSA43', name: 'HARI PRAGADESH S' },
  { roll: '24CSA44', name: 'HARI PRASATH S' },
  { roll: '24CSA45', name: 'JAYA PRAKASH K' },
  { roll: '24CSA46', name: 'JEGABAR NISHA Y' },
  { roll: '24CSA47', name: 'JOEYAL A' },
  { roll: '24CSA48', name: 'JOSPHIN HEPSIBA G' },
  { roll: '24CSA49', name: 'JOY SWEETY A' },
  { roll: '24CSA50', name: 'KABILAN K' },
  { roll: '24CSA51', name: 'KALAIVANAN S' },
  { roll: '24CSA52', name: 'KAMALAVARTHINI S' },
  { roll: '24CSA53', name: 'KAMATCHI M' },
  { roll: '24CSA54', name: 'KARTHIKEYAN U' },
  { roll: '24CSA55', name: 'KATHISH R' },
  { roll: '24CSA56', name: 'KAVIPRIYAN S' },
  { roll: '24CSA57', name: 'KAVIYA DHARSHINI M' },
  { roll: '24CSA58', name: 'KIRUTHIKA S' },
  { roll: '24CSA59', name: 'LAKSHANA S' },
  { roll: '24CSA60', name: 'LEKHA G' },
  { roll: '24CSA61', name: 'CHARLES T' },
  { roll: '24CSA62', name: 'DASARATHY M' },
  { roll: '24CSA63', name: 'HARISH R' },
  { roll: '24CSA64', name: 'RAJALAKSHMI S' },
  { roll: '24CSA65', name: 'UTHRA R' },
];

const INITIAL_III_CSE_B: Array<{ roll: string; name: string }> = [
  { roll: '24CSB01', name: 'MADHAN KUMAR P' },
  { roll: '24CSB02', name: 'MADHUKRISHNA S' },
  { roll: '24CSB03', name: 'MITHUN R K' },
  { roll: '24CSB04', name: 'MUGUNDHAN T' },
  { roll: '24CSB05', name: 'NAVEEN G R' },
  { roll: '24CSB06', name: 'NAVEEN KUMAR R' },
  { roll: '24CSB07', name: 'NAVINKUMAR S' },
  { roll: '24CSB08', name: 'NEHA P' },
  { roll: '24CSB09', name: 'NISHANTHI S' },
  { roll: '24CSB10', name: 'NITINRAM K S' },
  { roll: '24CSB11', name: 'PAVALAN K' },
  { roll: '24CSB12', name: 'PAVITHRA D' },
  { roll: '24CSB13', name: 'PRABHAVATHI P' },
  { roll: '24CSB14', name: 'PRAKSHITHA S' },
  { roll: '24CSB15', name: 'PRASANTH J' },
  { roll: '24CSB16', name: 'PREETHI M' },
  { roll: '24CSB17', name: 'PREETHI V' },
  { roll: '24CSB18', name: 'PRETHIKA S' },
  { roll: '24CSB19', name: 'PRIYANKA S' },
  { roll: '24CSB20', name: 'PUSHPA P' },
  { roll: '24CSB21', name: 'RAGAVI R' },
  { roll: '24CSB22', name: 'RAGUL N' },
  { roll: '24CSB23', name: 'RAJASRI V' },
  { roll: '24CSB24', name: 'RAMAKRISHNAN K' },
  { roll: '24CSB25', name: 'RAMESH R' },
  { roll: '24CSB26', name: 'RANJITH R' },
  { roll: '24CSB27', name: 'RITHIKA S' },
  { roll: '24CSB28', name: 'RUBAN K' },
  { roll: '24CSB29', name: 'SAKKTHI A' },
  { roll: '24CSB30', name: 'SANJAY S' },
  { roll: '24CSB31', name: 'SANTHIYA MEENA E' },
  { roll: '24CSB32', name: 'SANTHOSH K' },
  { roll: '24CSB33', name: 'SARABESWARI B' },
  { roll: '24CSB34', name: 'SASHWITHA G' },
  { roll: '24CSB35', name: 'SHANTHINI PRIYA M' },
  { roll: '24CSB36', name: 'SHARUN S' },
  { roll: '24CSB37', name: 'SHIVANI SRI B' },
  { roll: '24CSB38', name: 'SHRI LAKSHANA S K' },
  { roll: '24CSB39', name: 'SINDHUJA S' },
  { roll: '24CSB40', name: 'SOWNDARYA P' },
  { roll: '24CSB41', name: 'SRI HARSHINI K' },
  { roll: '24CSB42', name: 'SRIDHARSHAN S' },
  { roll: '24CSB43', name: 'SUBASH CHANDRA BOSE K' },
  { roll: '24CSB44', name: 'SUBHA DHARSHINI G' },
  { roll: '24CSB45', name: 'SUBHASHINI N' },
  { roll: '24CSB46', name: 'SYED FATHIMA K' },
  { roll: '24CSB47', name: 'TAMIL NANGAI K' },
  { roll: '24CSB48', name: 'THAMARAI SELVI D' },
  { roll: '24CSB49', name: 'THARUN M' },
  { roll: '24CSB50', name: 'VARSHINI G' },
  { roll: '24CSB51', name: 'VARSHINI S' },
  { roll: '24CSB52', name: 'VASANTH B' },
  { roll: '24CSB53', name: 'VIGNESH S M' },
  { roll: '24CSB54', name: 'VISHNU PRASATH S' },
  { roll: '24CSB55', name: 'VISHVAKKANNAN S' },
  { roll: '24CSB56', name: 'YAMUNA R' },
  { roll: '24CSB57', name: 'YOGARATHNA E' },
  { roll: '24CSB58', name: 'SIVASANMUGAM S' },
  { roll: '24CSB59', name: 'CHATRAPATHI U' },
  { roll: '24CSB60', name: 'MAZEED AHAMED A' },
  { roll: '24CSB61', name: 'NITHISH R P' },
  { roll: '24CSB62', name: 'SAITHARUN D' },
];

export function buildInitialFinanceRecords(): FinanceRecord[] {
  const records: FinanceRecord[] = [];
  const now = new Date().toISOString();

  // 1. II CSE A (65 Students, Fee: ₹250)
  INITIAL_II_CSE_A.forEach((s) => {
    records.push({
      id: `FIN-2A-${s.roll}`,
      studentName: s.name,
      rollNumber: s.roll,
      year: 'II Year',
      section: '2nd CSE A',
      department: 'CSE',
      feeAmount: 250,
      paidAmount: 0,
      status: 'UNPAID',
      isLocked: false,
      createdAt: now,
    });
  });

  // 2. II CSE B (67 Students, Fee: ₹250)
  INITIAL_II_CSE_B.forEach((s) => {
    records.push({
      id: `FIN-2B-${s.roll}`,
      studentName: s.name,
      rollNumber: s.roll,
      year: 'II Year',
      section: '2nd CSE B',
      department: 'CSE',
      feeAmount: 250,
      paidAmount: 0,
      status: 'UNPAID',
      isLocked: false,
      createdAt: now,
    });
  });

  // 3. III CSE A (65 Students, Fee: ₹400)
  INITIAL_III_CSE_A.forEach((s) => {
    records.push({
      id: `FIN-3A-${s.roll}`,
      studentName: s.name,
      rollNumber: s.roll,
      year: 'III Year',
      section: '3rd CSE A',
      department: 'CSE',
      feeAmount: 400,
      paidAmount: 0,
      status: 'UNPAID',
      isLocked: false,
      createdAt: now,
    });
  });

  // 4. III CSE B (62 Students, Fee: ₹400)
  INITIAL_III_CSE_B.forEach((s) => {
    records.push({
      id: `FIN-3B-${s.roll}`,
      studentName: s.name,
      rollNumber: s.roll,
      year: 'III Year',
      section: '3rd CSE B',
      department: 'CSE',
      feeAmount: 400,
      paidAmount: 0,
      status: 'UNPAID',
      isLocked: false,
      createdAt: now,
    });
  });

  return records;
}

function getLocalFinanceRecords(): FinanceRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_FINANCE_KEY);
    if (raw) {
      const parsed: FinanceRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-merge newly added class initial records
        const initial = buildInitialFinanceRecords();
        const existingIds = new Set(parsed.map((r) => r.id));
        let addedCount = 0;
        initial.forEach((r) => {
          if (!existingIds.has(r.id)) {
            parsed.push(r);
            addedCount++;
          }
        });
        if (addedCount > 0) {
          saveLocalFinanceRecords(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local finance records:', e);
  }
  const initial = buildInitialFinanceRecords();
  saveLocalFinanceRecords(initial);
  return initial;
}

function saveLocalFinanceRecords(records: FinanceRecord[]) {
  try {
    localStorage.setItem(LOCAL_FINANCE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving local finance records:', e);
  }
}

/**
 * Realtime Subscription for Finance Records
 */
export function subscribeFinanceRecords(callback: (records: FinanceRecord[]) => void) {
  const colRef = collection(db, 'finance_records');

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        const initial = getLocalFinanceRecords();
        callback(initial);
        initial.forEach((r) => {
          setDoc(doc(db, 'finance_records', r.id), r).catch((err) =>
            console.warn('Auto-seed finance doc warning:', err)
          );
        });
      } else {
        const records: FinanceRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as FinanceRecord);
        });
        records.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
        saveLocalFinanceRecords(records);
        callback(records);
      }
    },
    (error) => {
      console.warn('Firestore finance snapshot warning, using localStorage fallback:', error);
      callback(getLocalFinanceRecords());
    }
  );

  return unsubscribe;
}

/**
 * Mark a Finance Record as PAID (PERMANENT LOCKING ENFORCED)
 */
export async function markFinanceRecordPaid(
  recordId: string,
  paidAmount: number,
  adminUser: string,
  notes?: string
): Promise<{ success: boolean; message?: string }> {
  const paidTime = new Date().toISOString();

  const localList = getLocalFinanceRecords();
  const idx = localList.findIndex((r) => r.id === recordId);
  if (idx !== -1) {
    if (localList[idx].isLocked) {
      return { success: false, message: 'This record is permanently locked and cannot be modified.' };
    }
    localList[idx] = {
      ...localList[idx],
      paidAmount: paidAmount > 0 ? paidAmount : localList[idx].feeAmount,
      status: 'PAID',
      paidAt: paidTime,
      collectedBy: adminUser || 'Admin',
      isLocked: true,
      notes: notes || localList[idx].notes || '',
    };
    saveLocalFinanceRecords(localList);
  }

  try {
    const docRef = doc(db, 'finance_records', recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().isLocked) {
      return { success: false, message: 'This record is permanently locked and cannot be modified.' };
    }

    const payload = {
      paidAmount: paidAmount > 0 ? paidAmount : 250,
      status: 'PAID',
      paidAt: paidTime,
      collectedBy: adminUser || 'Admin',
      isLocked: true,
      ...(notes ? { notes } : {}),
    };

    await updateDoc(docRef, payload);
    return { success: true };
  } catch (err) {
    console.warn('Firestore update warning for finance record, local update succeeded:', err);
    return { success: true };
  }
}

/**
 * Add New Student to Finance Records
 */
export async function addFinanceRecord(
  record: Omit<FinanceRecord, 'id' | 'createdAt'>
): Promise<{ success: boolean; id: string }> {
  const id = `FIN-${record.section.replace(/\s+/g, '')}-${record.rollNumber}-${Date.now()}`;
  const now = new Date().toISOString();
  const newRecord: FinanceRecord = {
    ...record,
    id,
    createdAt: now,
  };

  const localList = getLocalFinanceRecords();
  localList.push(newRecord);
  saveLocalFinanceRecords(localList);

  try {
    await setDoc(doc(db, 'finance_records', id), newRecord);
  } catch (err) {
    console.warn('Firestore add finance record warning, saved locally:', err);
  }

  return { success: true, id };
}
