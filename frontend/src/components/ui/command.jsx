import Card from '../card'
import Button from './button'
import { useSocketContextActions } from '../../hooks/use-socket-context'

export default () => {
  const { getPressure } = useSocketContextActions()
  // const getPressure = async () => {}

  return (
    <Card>
      <Button>get pressure</Button>
    </Card>
  )
}
