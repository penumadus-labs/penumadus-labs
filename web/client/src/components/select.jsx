import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'

const Anchor = styled.div`
  position: relative;
  height: 54px;

  p {
    padding-left: 2px;
    padding-bottom: 2px;
    white-space: nowrap;
    margin: 0;
  }
`

const Dropdown = styled.div`
  position: absolute;
  min-width: 140px;

  overflow: hidden;
  border-radius: var(--radius);

  .selected,
  .option {
    background: var(--button-background);
    padding: var(--xs) var(--sm);
  }

  .selected {
    display: flex;
    align-items: center;

    p {
      flex: 1 0 auto;
    }
  }
`

export default ({ selected, options, onSelect, label }) => {
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
    <Anchor>
      <p>{label}</p>
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
          <DownArrow size={19} />
        </div>
        {toggled && (
          <div>
            {options
              .filter((item) => item !== selected)
              .map((item) => (
                <div
                  className="clickable-box option"
                  key={item}
                  onClick={() => onSelect(item)}
                  onKeyDown={handleKeyDown}
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </Dropdown>
    </Anchor>
  )
}
