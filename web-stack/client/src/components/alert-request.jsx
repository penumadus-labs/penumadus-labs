import Alert from './alert'

export default ({ useRequest, decorator, children = 'submit', ...props }) => {
  const [status, request] = useRequest()

  decorator ??= request

  return (
    <Alert {...props}>
      {status}
      <button onClick={decorator}>{children}</button>
    </Alert>
  )
}
