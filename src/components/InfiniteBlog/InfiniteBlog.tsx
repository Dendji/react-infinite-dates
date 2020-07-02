import React, { useState, useRef, useEffect } from 'react'
import Article from './InfiniteBlogArticle'
import styles from './InfiniteBlog.module.css'
import {
  VariableSizeList as List,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
} from 'react-window'
import Autosizer from 'react-virtualized-auto-sizer'

const LOAD_DATES_STEP = 40
const LEFTOVER_TO_LOAD_NEW = 10
const ITEM_DEFAULT_SIZE = 40

const getDateArray = function (start: Date, end: Date): Date[] {
  const arr = [],
    dt = new Date(start)

  while (dt <= end) {
    arr.push(new Date(dt))
    dt.setDate(dt.getDate() + 1)
  }

  return arr
}

export interface InfiniteBlogProps {
  input: {
    [key: number]: string
  }
  isLoading?: boolean
  onLoadRequest: (startDate: Date, endDate: Date) => void
}

export const InfiniteBlogContext = React.createContext<{
  setSize?: (index: number, size?: number) => void
  windowWidth?: number
}>({})

const InfiniteBlog = (props: InfiniteBlogProps) => {
  const sizeMap = React.useRef<any>({})
  const setSize = React.useCallback((index, size) => {
    if (sizeMap.current[index] !== size && size) {
      sizeMap.current = { ...sizeMap.current, [index]: size }
      listRef?.current?.resetAfterIndex(0)
    }
  }, [])
  const getSize = React.useCallback(
    (index) => sizeMap.current[index] || ITEM_DEFAULT_SIZE,
    [],
  )

  const { input, onLoadRequest } = props

  const listRef = useRef<List | null>(null)

  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 1)

    let endDate = new Date()
    endDate.setDate(startDate.getDate() + LOAD_DATES_STEP)
    onLoadRequest(startDate, endDate)
    setDates(getDateArray(startDate, endDate))
    return () => {}
  }, [])

  const generateDatesBefore = () => {
    const newFirstDate = new Date(dates[0])
    const newEndDate = new Date(dates[0])

    newFirstDate.setDate(newFirstDate.getDate() - (1 + LOAD_DATES_STEP))
    newEndDate.setDate(newEndDate.getDate() - 1)

    const newDates = [...getDateArray(newFirstDate, newEndDate), ...dates]
    setDates(newDates)
    sizeMap.current = {}
    listRef?.current?.scrollToItem(LOAD_DATES_STEP + 1, 'start')
    onLoadRequest(newFirstDate, newEndDate)
  }

  const generateDatesAfter = () => {
    const lastDate = dates[dates.length - 1]
    const dateFrom = new Date(lastDate)
    const dateTo = new Date(lastDate)

    dateFrom.setDate(dateFrom.getDate() + 1)
    dateTo.setDate(dateTo.getDate() + LOAD_DATES_STEP)
    const newArray = dates.concat(getDateArray(dateFrom, dateTo))
    setDates(newArray)
    onLoadRequest(dateFrom, dateTo)
  }

  const handleItemsRendered = ({
    visibleStopIndex,
  }: ListOnItemsRenderedProps) => {
    if (visibleStopIndex > dates.length - LEFTOVER_TO_LOAD_NEW) {
      generateDatesAfter()
    }
  }

  const handleScroll = ({
    scrollDirection,
    scrollOffset,
  }: ListOnScrollProps) => {
    if (scrollOffset === 0 && scrollDirection === 'backward') {
      generateDatesBefore()
    }
  }

  return (
    <InfiniteBlogContext.Provider
      value={{
        setSize,
      }}
    >
      <div className={styles.root}>
        <Autosizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={dates.length}
              width={width}
              itemSize={getSize}
              className={styles.List}
              useIsScrolling
              initialScrollOffset={ITEM_DEFAULT_SIZE}
              onItemsRendered={handleItemsRendered}
              onScroll={handleScroll}
            >
              {({
                index,
                style,
              }: {
                index: number
                style: React.CSSProperties
              }) => (
                <div style={style} data-key={index}>
                  {!!dates[index] && (
                    <Article
                      className={styles.item}
                      date={dates[index]}
                      text={input[dates[index].setHours(0, 0, 0, 0)]}
                      index={index}
                    />
                  )}
                </div>
              )}
            </List>
          )}
        </Autosizer>
      </div>
    </InfiniteBlogContext.Provider>
  )
}

export default InfiniteBlog
