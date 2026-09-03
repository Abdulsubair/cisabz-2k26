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
 */
export async function checkDuplicateRegistration(email: string, mobile: string): Promise<boolean> {
  const normEmail = normalizeCredential(email);
  const normMobile = normalizeCredential(mobile);

  // Check Firestore first if available
  try {
    const regRef = collection(db, 'registrations');
    const qEmail = query(regRef, where('emailNormalized', '==', normEmail));
    const snapshotEmail = await getDocs(qEmail);
    if (!snapshotEmail.empty) return true;

    const qMobile = query(regRef, where('mobileNormalized', '==', normMobile));
    const snapshotMobile = await getDocs(qMobile);
    if (!snapshotMobile.empty) return true;
  } catch (err) {
    console.warn('Firestore duplicate check offline/fallback:', err);
  }

  // Check local fallback
  const locals = getLocalRegistrations();
  return locals.some(
    (r) =>
      normalizeCredential(r.email) === normEmail ||
      normalizeCredential(r.mobile) === normMobile
  );
}

/**
 * Upload Payment Proof file to Firebase Storage (with Data URL local fallback)
 */
export async function uploadPaymentProof(file: File, regId: string): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop() || 'png';
  const filePath = `payment-proofs/${regId}/${Date.now()}.${fileExt}`;

  try {
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return { url: downloadUrl, path: filePath };
  } catch (err) {
    console.warn('Firebase storage fallback to local data URL:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: filePath,
        });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
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
 * Submit New Registration to Firebase Firestore & Storage
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
  // 1. Check duplicate
  const isDuplicate = await checkDuplicateRegistration(formData.email, formData.mobile);
  if (isDuplicate) {
    throw new Error('A participant with this email address or mobile number has already registered.');
  }

  // 2. Generate Registration ID
  const registrationId = generateRegistrationId();

  // 3. Upload Payment Proof
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

  // 4. Save to Firestore & verify document creation
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
 * Verify Participant Registration & Send Confirmation Email
 */
export async function verifyRegistration(registrationId: string, adminUser = 'Admin'): Promise<{ success: boolean; mailtoUrl: string }> {
  const verifiedTime = new Date().toISOString();
  let participantEmail = '';
  let participantName = '';
  let techEvt = '';
  let nonTechEvt = '';

  try {
    const docRef = doc(db, 'registrations', registrationId);
    await updateDoc(docRef, {
      status: 'VERIFIED',
      verifiedAt: verifiedTime,
      verifiedBy: adminUser,
    });
  } catch (err) {
    console.warn('Firestore verify update fallback:', err);
  }

  // Update local storage
  const list = getLocalRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index !== -1) {
    list[index].status = 'VERIFIED';
    list[index].verifiedAt = verifiedTime;
    list[index].verifiedBy = adminUser;
    saveLocalRegistrations(list);

    participantEmail = list[index].email;
    participantName = list[index].fullName;
    techEvt = list[index].technicalEvent;
    nonTechEvt = list[index].nonTechnicalEvent;
  }

  // Trigger Email Notification Workflow automatically
  return await sendNotificationEmail({
    to: participantEmail,
    name: participantName,
    status: 'VERIFIED',
    regId: registrationId,
    techEvent: techEvt,
    nonTechEvent: nonTechEvt,
  });
}

/**
 * Reject Participant Registration & Send Rejection Email
 */
export async function rejectRegistration(registrationId: string, adminUser = 'Admin', reason?: string): Promise<{ success: boolean; mailtoUrl: string }> {
  const rejectedTime = new Date().toISOString();
  let participantEmail = '';
  let participantName = '';
  let techEvt = '';
  let nonTechEvt = '';

  try {
    const docRef = doc(db, 'registrations', registrationId);
    await updateDoc(docRef, {
      status: 'REJECTED',
      rejectedAt: rejectedTime,
      rejectedBy: adminUser,
      rejectionReason: reason || 'Payment transaction verification failed.',
    });
  } catch (err) {
    console.warn('Firestore reject update fallback:', err);
  }

  // Update local storage
  const list = getLocalRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index !== -1) {
    list[index].status = 'REJECTED';
    list[index].rejectedAt = rejectedTime;
    list[index].verifiedBy = adminUser;
    list[index].rejectionReason = reason || 'Payment transaction verification failed.';
    saveLocalRegistrations(list);

    participantEmail = list[index].email;
    participantName = list[index].fullName;
    techEvt = list[index].technicalEvent;
    nonTechEvt = list[index].nonTechnicalEvent;
  }

  // Trigger Email Notification Workflow automatically
  return await sendNotificationEmail({
    to: participantEmail,
    name: participantName,
    status: 'REJECTED',
    regId: registrationId,
    techEvent: techEvt,
    nonTechEvent: nonTechEvt,
    reason: reason || 'Transaction verification unsuccessful.',
  });
}

/**
 * Secure Email Notification Workflow Trigger
 * Transmits confirmation/rejection notifications to participants via EmailJS API.
 */
export async function sendNotificationEmail(params: {
  to: string;
  name: string;
  status: 'VERIFIED' | 'REJECTED';
  regId: string;
  techEvent: string;
  nonTechEvent: string;
  reason?: string;
}): Promise<{ success: boolean; mailtoUrl: string }> {
  const { to, name, status, regId, techEvent, nonTechEvent, reason } = params;

  console.log(`[EMAIL SERVICE] Transmitting ${status} notification email to ${to}...`);

  const isConfirmed = status === 'VERIFIED';
  const statusLabel = isConfirmed ? 'CONFIRMED' : 'REJECTED';

  const subject = isConfirmed
    ? `Slot Confirmed — CISABZ-2K26 Event Registration (${regId})`
    : `Registration Status Update — CISABZ-2K26 (${regId})`;

  const bodyText = isConfirmed
    ? `Dear ${name},\n\nGreat news! Your event registration slot for CISABZ-2K26 has been CONFIRMED!\n\nRegistration Details:\n- Registration ID: ${regId}\n- Technical Event: ${techEvent}\n- Non-Technical Event: ${nonTechEvent}\n- Payment Status: Verified / Confirmed\n- Venue: Kings College of Engineering, Punalkulam\n- Date: 25th September 2026\n\nPlease keep this confirmation email for entry verification at the auditorium.\n\nBest regards,\nCISABZ-2K26 Organizing Committee\nKings College of Engineering`
    : `Dear ${name},\n\nWe regret to inform you that your event registration payment for CISABZ-2K26 could not be verified, and your slot has been REJECTED.\n\nRegistration Details:\n- Registration ID: ${regId}\n- Rejection Reason: ${reason || 'Transaction verification unsuccessful.'}\n\nIf you believe this is an error or wish to re-verify your payment, please reply to this email or contact us at cisabz26@gmail.com.\n\nBest regards,\nCISABZ-2K26 Organizing Committee`;

  // Create mailto fallback URL
  const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  try {
    // 1. EmailJS Environment Configuration
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const emailjsUserId = import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (emailjsServiceId && emailjsTemplateId && emailjsUserId) {
      console.log('[EMAIL SERVICE] Sending via EmailJS API...', { service_id: emailjsServiceId, template_id: emailjsTemplateId });

      const payload = {
        service_id: emailjsServiceId.trim(),
        template_id: emailjsTemplateId.trim(),
        user_id: emailjsUserId.trim(),
        template_params: {
          to_email: to,
          email: to,
          to_name: name,
          name: name,
          user_name: name,
          reg_id: regId,
          status: statusLabel,
          slot_status: isConfirmed ? 'Slot Confirmed' : 'Slot Rejected',
          tech_event: techEvent,
          non_tech_event: nonTechEvent,
          reason: reason || 'N/A',
          message: bodyText,
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
        console.log('[EMAIL SERVICE] ✅ Successfully delivered email via EmailJS!');
        return { success: true, mailtoUrl };
      } else {
        const errText = await res.text();
        console.error('[EMAIL SERVICE] EmailJS API returned status:', res.status, errText);
      }
    }

    // 2. Custom Webhook Endpoint
    const emailEndpoint = import.meta.env.VITE_EMAIL_API_URL;
    if (emailEndpoint) {
      const res = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, name, status: statusLabel, regId, techEvent, nonTechEvent, reason, bodyText }),
      });
      if (res.ok) {
        return { success: true, mailtoUrl };
      }
    }

    console.log(`[EMAIL PREVIEW] Subject: ${subject}\n\n${bodyText}`);
    return { success: true, mailtoUrl };
  } catch (err) {
    console.error('[EMAIL SERVICE ERROR]', err);
    return { success: false, mailtoUrl };
  }
}
