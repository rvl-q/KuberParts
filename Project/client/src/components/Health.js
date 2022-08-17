import React, { useEffect, useState } from 'react'
import health from '../services/health'


const Health = () => {
  const [HealthStatus, setHealthStatus] = useState()
  const [error, setError] = useState()
  useEffect( () => {
    async function fetchData() {
        try {
        const healthCheck = await health.healthCheck()
        setHealthStatus(healthCheck)
        console.log(healthCheck)
        //   console.log(healthCheck.status)
        } catch (err) {
        setError(err)
        console.log(err.message)
        }
    }
    fetchData();
  }, [])


  const sleep = ms => new Promise(res => setTimeout(res, ms));
  
  if (!HealthStatus && !error) {
    return null
  }
  console.log('response 4...')
  
  if (HealthStatus===200) {
    console.log(HealthStatus)
    return(
      <h1>Todos!</h1>
    )
  } else {
    console.log('errrorr', HealthStatus, 555)
    return (
      <div>
        <h1>500</h1>
        <h3>backend /healthz is not routed to "the outside"</h3>
      </div>
    )
  }
}

export default Health