// databaseUtils.js

import { ref, set, get, remove } from 'firebase/database'
import { fs, db } from '../config/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Funciones de escritura
const writeToRealtimeDatabase = (path, data) => {
  const databaseRef = ref(db, path)
  return set(databaseRef, data)
}

const writeToFirestore = async (collectionPath, data) => {
  const docRef = await addDoc(collection(fs, collectionPath), data)
  return docRef.id
}

const getValuesFromRealtimeDatabase = async (path) => {
  const databaseRef = ref(db, path)
  const snapshot = await get(databaseRef)

  if (snapshot.exists()) {
    // La referencia existe en la base de datos
    return snapshot.val()
  } else {
    // La referencia no existe en la base de datos
    return null
  }
}
// Funciones de actualización
// ...

const deleteFromRealtimeDatabase = (path) => {
  const databaseRef = ref(db, path)
  return remove(databaseRef)
}

export {
  writeToRealtimeDatabase,
  writeToFirestore, getValuesFromRealtimeDatabase,
  deleteFromRealtimeDatabase
  // Agrega aquí otras funciones de lectura, actualización y eliminación si las necesitas
}
