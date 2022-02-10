import React from 'react'

export interface VideoContainerProps {
  videoId: boolean,
  children: React.ReactNode,
}
export default function VideoContainer({ videoId, children }: VideoContainerProps) {
  return (
    <div
      style={{
        width: '300px',
        height: '224px',
        backgroundColor: '#929baa',
      }}
    >
      {children}
    </div>
  )
}
