import { Button, CircularProgress, styled } from '@mui/material'
import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JsonapiPaginationLinks from 'src/business.logic/JsonapiPaginationLinks'
import { type StateData, StateDataPagesRange } from 'src/controllers'
import { type AppDispatch, type RootState } from 'src/state'
import { get_req_state } from 'src/state/net.actions'
import { APP_IS_FETCHING_BOOKMARKS } from '../../tuber.config'
import { appSetFetchMessage } from 'src/slices/app.slice'

interface ILoadMoreProps {
  def?: StateData
  text?: string
  loadingText?: string
  direction: 'next' | 'previous'
}

type LoadingState = {
  isLoading: boolean
  direction: 'next' | 'previous' | null
}

const Loading = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.grey[500],
}))

const LoadingText = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}))

const LoadingProgress = React.memo<{ text: string }>(({ text }) => (
  <Loading>
    <CircularProgress color='secondary' size={20} thickness={5} />
    <LoadingText>{text}</LoadingText>
  </Loading>
))

// Unified component for loading bookmarks in either direction
const BookmarkLoader = React.memo<ILoadMoreProps>(({ 
  def, 
  text, 
  loadingText, 
  direction 
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const appStatus = useSelector((state: RootState) => state.app.status)
  const dataPagesRange = useSelector((state: RootState) => state.dataPagesRange)
  const bookmarksLinks = useSelector((state: RootState) => state.topLevelLinks.bookmarks)
  
  const [loadingState, setLoadingState] = useState<LoadingState>({ 
    isLoading: false, 
    direction: null 
  })
  const [loaded, setLoaded] = useState(false)

  // Memoize expensive computations
  const { links, targetPage, hasPages, defaultText } = useMemo(() => {
    const pageManager = new StateDataPagesRange(dataPagesRange)
    pageManager.configure({ endpoint: 'bookmarks' })
    
    const links = new JsonapiPaginationLinks(bookmarksLinks)
    
    const targetPage = direction === 'next' 
      ? pageManager.lastPage + 1 
      : pageManager.firstPage - 1
    
    const hasPages = direction === 'next'
      ? targetPage <= links.lastPageNumber
      : pageManager.firstPage > 1
    
    const defaultText = direction === 'next' ? 'Load More' : 'Load Earlier'
    
    return { pageManager, links, targetPage, hasPages, defaultText }
  }, [dataPagesRange, bookmarksLinks, direction])

  // Handle loading completion effect
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true))
    return () => clearTimeout(timer)
  }, [])

  // Reset loading state when not fetching
  useEffect(() => {
    if (appStatus !== APP_IS_FETCHING_BOOKMARKS) {
      setLoadingState({ isLoading: false, direction: null })
    }
  }, [appStatus])

  // Memoized click handler
  const handleOnClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.disabled = true
    setLoadingState({ isLoading: true, direction })
    dispatch(appSetFetchMessage(APP_IS_FETCHING_BOOKMARKS))
    dispatch(get_req_state('bookmarks', links.getLinkUrl({ pageNumber: targetPage })))
  }, [dispatch, direction, links, targetPage])

  // Don't render until loaded
  if (!loaded) return null

  // Show loading if this component initiated the loading
  if (appStatus === APP_IS_FETCHING_BOOKMARKS && loadingState.isLoading && loadingState.direction === direction) {
    return <LoadingProgress text={loadingText || 'Loading...'} />
  }

  // Show loading for initial load (no bookmarks yet)
  if (direction === 'next' && appStatus === APP_IS_FETCHING_BOOKMARKS && !def?.state?.bookmarks?.length) {
    return <LoadingProgress text={loadingText || 'Loading...'} />
  }

  // Show button if pages are available and not currently loading
  if (appStatus !== APP_IS_FETCHING_BOOKMARKS && hasPages) {
    return (
      <Button
        onClick={handleOnClick}
        size='small'
        fullWidth
        color='inherit'
      >
        {text || defaultText}
      </Button>
    )
  }

  return null
})

interface IInfiniteScrollTriggerProps {
  def?: StateData
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Infinite scroll trigger component that automatically loads more bookmarks when scrolled into view
 */
export const InfiniteScrollTrigger = React.memo<IInfiniteScrollTriggerProps>(({ def, scrollContainerRef }) => {
  const dispatch = useDispatch<AppDispatch>()
  const appStatus = useSelector((state: RootState) => state.app.status)
  const dataPagesRange = useSelector((state: RootState) => state.dataPagesRange)
  const bookmarksLinks = useSelector((state: RootState) => state.topLevelLinks.bookmarks)
  
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const hasTriggeredRef = useRef(false) // Prevent duplicate triggers

  // Memoize expensive computations
  const { links, targetPage, hasMorePages } = useMemo(() => {
    const pageManager = new StateDataPagesRange(dataPagesRange)
    pageManager.configure({ endpoint: 'bookmarks' })
    
    const links = new JsonapiPaginationLinks(bookmarksLinks)
    
    const targetPage = pageManager.lastPage + 1
    const hasMorePages = targetPage <= links.lastPageNumber
    
    return { pageManager, links, targetPage, hasMorePages }
  }, [dataPagesRange, bookmarksLinks])

  // Reset trigger flag when target page changes (new data loaded)
  useEffect(() => {
    hasTriggeredRef.current = false
  }, [targetPage])

  // Intersection Observer effect with proper root element
  useEffect(() => {
    const element = triggerRef.current
    const scrollContainer = scrollContainerRef.current
    if (!element || !scrollContainer || !hasMorePages || isLoading || appStatus === APP_IS_FETCHING_BOOKMARKS) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true
          setIsLoading(true)
          dispatch(appSetFetchMessage(APP_IS_FETCHING_BOOKMARKS))
          dispatch(get_req_state('bookmarks', links.getLinkUrl({ pageNumber: targetPage })))
        }
      },
      {
        root: scrollContainer, // Use the actual scroll container as root
        rootMargin: '200px', // Start loading 200px before the element comes into view
        threshold: 0
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect() // Full cleanup
    }
  }, [hasMorePages, isLoading, appStatus, dispatch, links, targetPage, scrollContainerRef])

  // Reset loading state when not fetching
  useEffect(() => {
    if (appStatus !== APP_IS_FETCHING_BOOKMARKS) {
      setIsLoading(false)
    }
  }, [appStatus])

  // Don't render if no more pages or during initial load
  if (!hasMorePages || (appStatus === APP_IS_FETCHING_BOOKMARKS && !def?.state?.bookmarks?.length)) {
    return <div style={{ height: '20px', width: '100%' }} /> // Placeholder to maintain virtual list sizing
  }

  return (
    <div ref={triggerRef} style={{ height: '40px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isLoading && (
        <LoadingProgress text="Loading more bookmarks..." />
      )}
    </div>
  )
})

InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger'

/**
 * Load more bookmarks from the server
 */
export default function LoadMoreBookmarksFromServer(props: Omit<ILoadMoreProps, 'direction'>) {
  return <BookmarkLoader {...props} direction="next" />
}

/**
 * Load earlier bookmarks from the server
 */
export function LoadEarlierBookmarksFromServer(props: Omit<ILoadMoreProps, 'direction'>) {
  return <BookmarkLoader {...props} direction="previous" />
}
