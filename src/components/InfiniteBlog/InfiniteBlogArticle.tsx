import React from 'react'
import style from './InfiniteBlogArticle.module.css'
import { InfiniteBlogContext } from './InfiniteBlog'

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
  const { setSize, windowWidth } = React.useContext(InfiniteBlogContext)
  const root = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (setSize) {
      setSize(index, root?.current?.getBoundingClientRect().height)
    }
  }, [windowWidth, index, setSize])

  return (
    <div className={[style.root, className].join(' ')} ref={root}>
      <div className={style.date}>
        {daysBetween(today, date) === 0 ? (
          <strong className={style.today}>
            TODAY {date.toLocaleDateString('en-US', options)}
          </strong>
        ) : (
          date.toLocaleDateString('en-US', options)
        )}
      </div>
      {text && <div className={style.text}>{text}</div>}
    </div>
  )
}

export default InfiniteBlogArticle
