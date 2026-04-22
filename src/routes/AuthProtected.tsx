import React, {ReactNode} from 'react'

interface AuthProtectedProps {
  children: ReactNode
}

const AuthProtected: React.FC<AuthProtectedProps> = ({children}) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default AuthProtected
