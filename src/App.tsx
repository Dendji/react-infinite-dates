import React, { useState } from 'react'
import './App.css'
import InfiniteBlog from './components/InfiniteBlog/InfiniteBlog'
const getData = require('time-interval-lipsum')

const convertMapToAssociativeArray = (map: Map<Date, string>) => {
  const obj: any = {}

  for (let [k, v] of map) {
    // setting hours for date comparison (without time)
    obj[k.setHours(0, 0, 0, 0)] = v
  }

  return obj
}

function App() {
  const [input, setInput] = useState({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLoadRequest = async (start: Date, end: Date) => {
    setIsLoading(true)
    const data: Map<Date, string> = await getData(start, end)
    const convertedData = convertMapToAssociativeArray(data)
    setInput({ ...input, ...convertedData })
  }

  return (
    <div className="App">
      <InfiniteBlog
        input={input}
        onLoadRequest={handleLoadRequest}
        isLoading={isLoading}
      />
    </div>
  )
}

export default App
