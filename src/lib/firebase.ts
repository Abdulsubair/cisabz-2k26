import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
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
 * Check if a participant with the email or mobile has already registered.
 * Uses a fast Promise timeout to ensure duplicate checks never hang.
 */
export async function checkDuplicateRegistration(email: string, mobile: string): Promise<boolean> {
  const normEmail = normalizeCredential(email);
  const normMobile = normalizeCredential(mobile);

  // 1. Check local fallback immediately
  const locals = getLocalRegistrations();
  const isLocalDup = locals.some(
    (r) =>
      normalizeCredential(r.email) === normEmail ||
      normalizeCredential(r.mobile) === normMobile
  );
  if (isLocalDup) return true;

  // 2. Check Firestore with a 2-second timeout race
  try {
    const firestoreCheck = (async () => {
      const regRef = collection(db, 'registrations');
      const qEmail = query(regRef, where('emailNormalized', '==', normEmail));
      const snapshotEmail = await getDocs(qEmail);
      if (!snapshotEmail.empty) return true;

      const qMobile = query(regRef, where('mobileNormalized', '==', normMobile));
      const snapshotMobile = await getDocs(qMobile);
      if (!snapshotMobile.empty) return true;

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
        if (!snapshot.empty) {
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
          return;
        }
        callback(getLocalRegistrations());
      },
      (err) => {
        console.warn('Firestore snapshot error, loading local data:', err);
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
  const bodyText = `Dear ${name},\n\nYour registration for CISABZ-2K26 has been Rejected!\n\nRegistration Details:\n- Registration ID: ${regId}\n- Technical Event: ${techEvent}\n- Non-Technical Event: ${nonTechEvent}\n- Status: Rejected\n\n- Reason: ${rejectionReason}\n\nBest regards,\nCISABZ-2K26 Team`;

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
