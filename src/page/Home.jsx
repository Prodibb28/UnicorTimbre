import '../App.css'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Toggle from '../components/toggle'
import LineChart from '../components/chart'
import { db, auth, fs } from '../config/firebase'
import DataTable from 'react-data-table-component'
import { collection, onSnapshot } from 'firebase/firestore'
import { getValuesFromRealtimeDatabase, writeToRealtimeDatabase, deleteFromRealtimeDatabase } from '../config/databaseUtils'

const Home = () => {
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [regTimbreData, setRegTimbreData] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [TimStamp, setTimStamp] = useState('')
  const [alarmsData, setAlarmsData] = useState([])
  const [typeAlarm, setTypeAlarm] = useState('')
  const alarmPath = '/Timbre/alarms'
  const TalarmPath = '/Timbre/Talarms'

  const handleChangeTime = (event) => {
    const { value } = event.target
    setSelectedTime(value)

    // Crear un objeto Date con la fecha actual
    const currentDate = new Date()

    // Obtener las horas y minutos del valor de entrada
    const [hours, minutes] = value.split(':')

    // Establecer las horas y minutos en el objeto Date
    currentDate.setHours(hours)
    currentDate.setMinutes(minutes)

    // Obtener el timestamp en milisegundos
    const timestamp = currentDate.getTime()
    setTimStamp(timestamp)
    console.log(timestamp)
  }

  const obtenerFecha = (timestamp) => {
    const date = new Date(timestamp)
    const day = date.getDate()
    const month = date.getMonth() + 1 // Los meses en JavaScript son indexados desde 0
    const year = date.getFullYear()

    // Formatear la fecha en el formato deseado (ejemplo: DD/MM/YYYY)
    const fechaFormateada = `${day}/${month}/${year}`

    return fechaFormateada
  }

  const obtenerHora = (timestamp) => {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Formatear la hora en el formato deseado (ejemplo: HH:MM)
    const horaFormateada = `${hours}:${minutes}`

    return horaFormateada
  }

  const pullAlarms = async () => {
    const alarmsSnapshot = await getValuesFromRealtimeDatabase(alarmPath)
    console.log(alarmsSnapshot)

    const data = Object.entries(alarmsSnapshot).map(([key, value]) => {
      const fecha = obtenerFecha(value)
      const hora = obtenerHora(value)

      return {
        key,
        fecha,
        hora,
        estado: value.estado
      }
    })

    setAlarmsData(data)
  }
  const handleDeleteAndPullAlarms = (path) => {
    deleteFromRealtimeDatabase(path)
    pullAlarms()
  }

  const handleSave = async () => {
    const alarmsSnapshot = await getValuesFromRealtimeDatabase(alarmPath)
    const alarmsArray = Object.values(alarmsSnapshot)
    console.log(alarmsSnapshot)
    // Verificar si ya existe una alarma con el mismo valor de horas y minutos
    const hasDuplicateTime = alarmsArray.some(alarm => {
      const alarmDate = new Date(alarm)
      const selectedDate = new Date(TimStamp)

      return (
        alarmDate.getHours() === selectedDate.getHours() &&
        alarmDate.getMinutes() === selectedDate.getMinutes()
      )
    })

    if (!hasDuplicateTime && TimStamp !== '') {
      // Obtener el tamaño actual de las alarmas
      const alarmsCount = alarmsArray.length

      // Crear un nuevo nombre para la alarma
      const newAlarmName = `alarm_${alarmsCount + 1}`

      // Crear la nueva alarma en la base de datos
      await writeToRealtimeDatabase(`${alarmPath}/${newAlarmName}`, TimStamp)
      await writeToRealtimeDatabase(`${TalarmPath}/${newAlarmName}`, typeAlarm)
    }
    pullAlarms()
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(fs, 'regTimbre'), (snapshot) => {
      const dataByDate = {} // Objeto para almacenar la cantidad de documentos por fecha

      snapshot.docs.forEach((doc) => {
        const timestamp = doc.data().fecha // Supongamos que el campo es "fecha"
        const date = timestamp.toDate() // Convertir a objeto Date

        // Obtener día, mes y año
        const day = date.getDate()
        const month = date.getMonth() + 1 // Los meses en JavaScript son indexados desde 0
        const year = date.getFullYear()

        // Combinar día, mes y año en un solo string
        const dateString = `${day}/${month}/${year}`

        // Verificar si ya existe una entrada para la fecha actual y actualizar el contador
        if (dataByDate[dateString]) {
          dataByDate[dateString]++
        } else {
          dataByDate[dateString] = 1
        }
      })

      // Crear un array de objetos para mostrar la cantidad por fecha
      const data = Object.keys(dataByDate).map((dateString) => ({
        fecha: dateString,
        cant: dataByDate[dateString]
      }))

      setRegTimbreData(data)
    })
    pullAlarms()
    // Al finalizar, se llama a unsubscribe para detener la escucha del snapshot
    return () => unsubscribe()
  }, [])

  const getData = () => {
    return {
      labels: regTimbreData.map(objeto => objeto.fecha),
      datasets: [
        {
          label: 'Cantidad',
          data: regTimbreData.map(objeto => objeto.cant),
          borderColor: '#385872',
          backgroundColor: '#385872'
        }
      ]
    }
  }
  const columns = [
    {
      name: 'Cantidad de veces',
      selector: row => row.cant,
      sortable: true
    },
    {
      name: 'Fecha',
      selector: row => row.fecha,
      sortable: true
    }
  ]

  const alarmsInfo = [
    {
      name: 'Hora de alarma',
      selector: row => row.hora, // Acceder al campo 'hora' del objeto de alarma
      sortable: true
    },
    {
      name: 'Fecha de alarma',
      selector: row => row.fecha, // Acceder al campo 'fecha' del objeto de alarma
      sortable: true
    },
    {
      name: 'Acción',
      cell: (row) => (
        <button onClick={() => handleDeleteAndPullAlarms(`${alarmPath}/${row.key}`)}>Eliminar</button>
      )
    }
  ]

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setShouldNavigate(true)
      })
      .catch((error) => {
        console.log('Error occurred while signing out:', error)
      })
  }

  if (shouldNavigate) {
    return <Navigate to='/' replace />
  }

  return (
    <>
      <nav className='navbar'>
        <h1 className='app-title'>Panel administrativo</h1>
        <button className='signOutBttn' onClick={handleSignOut}>Salir</button>
      </nav>
      <div className='app-container'>
        <section>
          <h2 className='toggle-label'>Control timbre</h2>
          <p className='parag'>Puedes controlar activar o desacticar el timbre con el siguiente toggle</p>
          <Toggle database={db} field='Timbre/Estado' />
          <h2 className='toggle-label'>Programar alarma</h2>
          <p className='parag'>Por favor, selecciona la hora en la que quieres que el timbre se active diariamente</p>
          <div className='progContainer'>
            <input
              type='time'
              min='06:00'
              max='12:00'
              required
              value={selectedTime}
              onChange={handleChangeTime}
              className='inputDate'
            />
            <label className='inputTitle'>
                Tipo de alarma:
              </label>
              <select
                value={typeAlarm}
                onChange={(e) => setTypeAlarm(e.target.value)}
                required
                className='input-text'
              >
                <option value=''>SELECCIONAR</option>
                <option value='1'>CAMBIO DE CLASE</option>
                <option value='2'>SALIDA </option>
                <option value='3'>DESCANSO </option>
              </select>
            <button className='saveAlarm' onClick={handleSave}>Guardar</button>
          </div>
        </section>

        <section className='stats-container'>
          <h2 className='toggle-label '>Registro de actividad</h2>
          <DataTable columns={columns} data={regTimbreData} pagination />
        </section>

        <section className='stats-container'>
          <h2 className='toggle-label '>Alarmas programadas</h2>
          <DataTable columns={alarmsInfo} data={alarmsData} pagination />
        </section>

        <section className='chart-container'>
          <h2 className='toggle-label '>Actividad del timbre</h2>
          <LineChart data={getData()} />
        </section>
      </div>

    </>
  )
}

export default Home
