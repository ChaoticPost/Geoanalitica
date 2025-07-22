import { ReactNode } from 'react'

export interface LayoutProps {
  children?: ReactNode
}

export interface WithChildren {
  children: ReactNode
}

export interface WithOptionalChildren {
  children?: ReactNode
}

export * from './geo'
export * from './user' 