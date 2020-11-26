// const useTimeout = (ms, callback) => {
//   const [ref, setRef] = useState(null)
//   // eslint-disable-next-line
//   useEffect(() => () => clearTimeout(ref), [])
//   const setTimer = () => {
//     setRef(
//       setTimeout(() => {
//         setRef(null)
//         callback()
//       }, ms)
//     )
//   }
//   return setTimer
// }
