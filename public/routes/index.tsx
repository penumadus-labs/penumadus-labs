/**
 * data contains the paths of all the links and the content of all components
 * nav links and content body will be generated with a for loop
 *
 * addEvent binds the hashed components by inserting them into the events array
 * addEvent also remove the component on un-mount
 * calling a component's event will return that components href, and the value top from getBoundingClientRect
 *
 * a link is activated by passing it's href value into the setActive hook function
 *
 * fireEvents will call each event then loop through the results and get the component with the position
 *    with the greatest value less than height
 * height is an offset from the top of the window
 *
 * onload will set the link that needs to be active
 * if on another page it will use the value of href, if the value of href is / it will default to home
 * if a hash link is the target, fireEvents will be called to calculate the link that needs to be highlighted
 */

import { createContext, useContext, useEffect, FC } from 'react'
import { routes, Routes } from './data'
import { addEvent, AddEvent, useEvents } from './events'

const RouteContext = createContext<[Routes, AddEvent]>([routes, addEvent])

export const RouteProvider: FC = ({ children }) => (
  <RouteContext.Provider value={[useEvents(), addEvent]}>
    {children}
  </RouteContext.Provider>
)

export const useRoutes = () => useContext(RouteContext)
