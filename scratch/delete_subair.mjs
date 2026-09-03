import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDEkGzsRkpwZr6MyaVZJx01yfYlryxPrb4',
  authDomain: 'cisabz26-ec631.firebaseapp.com',
  projectId: 'cisabz26-ec631',
  storageBucket: 'cisabz26-ec631.firebasestorage.app',
  messagingSenderId: '384425289565',
  appId: '1:384425289565:web:50fff3a89cc9922b5feab4',
  measurementId: 'G-3WE86391FT',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log('Fetching registrations from Firestore...');
  const snapshot = await getDocs(collection(db, 'registrations'));
  console.log(`Found ${snapshot.docs.length} documents.`);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    console.log(`- Doc ID: ${docSnap.id}, Name: ${data.fullName}, Email: ${data.email}`);

    if (
      docSnap.id === 'REG-952604' ||
      (data.fullName && data.fullName.toUpperCase().includes('SUBAIR')) ||
      (data.email && data.email.toLowerCase().includes('asubair383'))
    ) {
      console.log(`🗑 DELETING document: ${docSnap.id} (${data.fullName})...`);
      await deleteDoc(doc(db, 'registrations', docSnap.id));
      console.log(`✅ Successfully deleted ${docSnap.id}!`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
