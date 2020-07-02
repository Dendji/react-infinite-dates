import React, { useState } from 'react'
import style from './InfiniteBlogArticle.module.css'
import { InfiniteBlogContext } from './InfiniteBlog'
import { Waypoint } from 'react-waypoint'

function daysBetween(first: Date, second: Date) {
  // Copy date parts of the timestamps, discarding the time parts.
  var one = new Date(first.getFullYear(), first.getMonth(), first.getDate())
  var two = new Date(second.getFullYear(), second.getMonth(), second.getDate())

  // Do the math.
  var millisecondsPerDay = 1000 * 60 * 60 * 24
  var millisBetween = two.getTime() - one.getTime()
  var days = millisBetween / millisecondsPerDay

  // Round down.
  return Math.floor(days)
}

export interface InfiniteBlogArticleProps {
  date: Date
  className?: string
  text?: string | null
  index: number
}

var options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const InfiniteBlogArticle = (props: InfiniteBlogArticleProps) => {
  const { index, text, date, className } = props
  const today = new Date()
  const { setSize } = React.useContext(InfiniteBlogContext)
  const root = React.useRef<HTMLDivElement>(null)
  const [isTextVisible, setIsTextVisible] = useState(false)

  const handleEnter = () => {
    setIsTextVisible(true)

    if (setSize && text) {
      setSize(index, root?.current?.getBoundingClientRect().height)
    }
  }

  const handleStartEnter = () => {
    if (setSize) {
      setSize(index, root?.current?.getBoundingClientRect().height)
    }
  }

  return (
    <Waypoint onEnter={handleStartEnter}>
      <div className={[style.root, className].join(' ')} ref={root}>
        <Waypoint onEnter={handleEnter} topOffset={40}>
          <div className={style.date}>
            {daysBetween(today, date) === 0 ? (
              <strong className={style.today}>
                TODAY {date.toLocaleDateString('en-US', options)}
              </strong>
            ) : (
              date.toLocaleDateString('en-US', options)
            )}
          </div>
        </Waypoint>
        {text && isTextVisible && <div className={style.text}>{text}</div>}
      </div>
    </Waypoint>
  )
}

export default InfiniteBlogArticle
