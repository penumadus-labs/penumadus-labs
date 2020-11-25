import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'

const Root = styled.div`
  position: relative;
  height: 32px;
`

const Dropdown = styled.div`
  position: absolute;
  z-index: var(--layer1);
  min-width: 100px;
  overflow: hidden;
  border-radius: var(--radius);

  .selected,
  option {
    padding: var(--xs) var(--sm);
    background: var(--button-background);
  }

  .selected {
    display: flex;
    align-items: center;

    p {
      flex: 1 1 auto;
    }
  }
`

export default ({ selected, options, onSelect }) => {
  const [toggled, setToggled] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const focusout = () => setToggled(false)
    const target = ref.current
    target.addEventListener('focusout', focusout)
    return () => target.removeEventListener('focusout', focusout)
  })

  const handleKeyDown = (event) => {
    if (event.keyCode === 27) setToggled(false)
  }

  const handleToggle = () => {
    setToggled(!toggled)
  }

  // const handleSelect = ({ target: { value } }) => {
  //   setSelected(value)
  //   onSelect(value)
  // }

  return (
    <Root>
      <Dropdown
        ref={ref}
        className="shadow-button clickable-box"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="listbox"
        tabIndex={0}
      >
        <div className="selected">
          <p>{selected}</p>
          <DownArrow size={18} />
        </div>
        {toggled && (
          <div>
            {options
              .filter((item) => item !== selected)
              .map((item) => (
                <option
                  className="clickable-box"
                  key={item}
                  value={item}
                  onClick={({ target }) => onSelect(target.value)}
                  onKeyDown={handleKeyDown}
                >
                  {item}
                </option>
              ))}
          </div>
        )}
      </Dropdown>
    </Root>
  )
}
