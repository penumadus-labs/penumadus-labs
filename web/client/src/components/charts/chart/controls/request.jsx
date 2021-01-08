import React from 'react'
import Alert from '../../../alert'

// request will un-mount when alert is closed resetting request status
// component is separate so the hook can be called inside the Alert body
const RequestBody = ({
  requestName,
  useRequest,
  wrapRequest,
  render,
  children,
}) => {
  const [status, request, ...rest] = useRequest({ clearStatus: false })

  if (render) return render([status, request, ...rest])

  const handleRequest = wrapRequest ? () => wrapRequest(request) : request

  return (
    <>
      {children}
      {status}
      <button className="button" onClick={handleRequest}>
        {requestName}
      </button>
    </>
  )
}

export default function Request({
  buttonText,
  title,
  children,
  disabled,
  ...props
}) {
  return (
    <Alert buttonText={buttonText} title={title} disabled={disabled}>
      <RequestBody {...props}>{children}</RequestBody>
    </Alert>
  )
}
