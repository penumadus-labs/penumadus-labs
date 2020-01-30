import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

const useFetch = () => {
  const {
    allMysqlDataCollected: { edges },
  } = useStaticQuery(graphql`
    {
      allMysqlDataCollected {
        edges {
          node {
            id
            accel_mag
            filled
            humidity
            timestamp
            x_axis
            y_axis
            z_axis
          }
        }
      }
    }
  `)

  return edges.map(({ node }) => node)
}

export default () => {
  const data = useFetch()
  console.log(data)
  return <></>
}
