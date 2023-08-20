import React, { useState } from 'react'
import Switch from 'react-switch'
import { auth } from '../config/firebase'
import { Timestamp } from 'firebase/firestore'
import { writeToFirestore, writeToRealtimeDatabase } from '../config/databaseUtils'

const Toggle = ({ field }) => {
  const [isToggled, setToggled] = useState(false)
  const handleToggle = async (checked) => {
    setToggled(checked)
    writeToRealtimeDatabase(field, checked)

    if (checked) {
      const fechaActual = Timestamp.fromDate(new Date())
      const emailUser = auth.currentUser.email
      writeToFirestore('regTimbre', {
        action: 'Activado',
        fecha: fechaActual,
        correo: emailUser
      })
    }
  }

  return (
    <div className='toggle-container'>
      <label className='toggle-label'>Estado:</label>
      <Switch checked={isToggled} onChange={handleToggle} />
    </div>
  )
}

export default Toggle
