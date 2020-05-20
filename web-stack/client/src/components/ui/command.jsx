import Card from '../card'
import Button from './button'
import { useSocketContextActions } from '../../hooks/use-device'

export default () => {
  const { getPressure } = useSocketContextActions()
  // const getPressure = async () => {}

  return (
    <Card>
      <Button>get pressure</Button>
    </Card>
  )
}
