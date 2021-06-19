import { ShapeProps } from '../../utils/css'
import Box from './Box'

export default function AbsoluteBox({ css = {} }: ShapeProps) {
  return (
    <Box
      className="visible-large"
      css={{
        position: 'absolute',
        'z-index': '10',
        ...css,
      }}
    />
  )
}
