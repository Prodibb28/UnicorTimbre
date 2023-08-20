// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyA7ezCXAvYNPYEA6p0YXzDoH82UvzJtSz4',
  authDomain: 'timbre-57911.firebaseapp.com',
  databaseURL: 'https://timbre-57911-default-rtdb.firebaseio.com',
  projectId: 'timbre-57911',
  storageBucket: 'timbre-57911.appspot.com',
  messagingSenderId: '1051917400710',
  appId: '1:1051917400710:web:33dc9bb708b19302df6f07'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const fs = getFirestore(app)
export const auth = getAuth(app)
