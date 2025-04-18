import { ReactNode } from 'react'

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

const Container = ({ children, className = ''}: ContainerProps ) => {
  return (
    <div className={`${className} flex w-full flex-grow max-h-fit pt-2 pb-2`}>
        {children}
    </div>
  )
}

export default Container;