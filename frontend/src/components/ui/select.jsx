import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'

const Root = styled.div`
  position: relative;
  height: ${({ theme }) => theme.shape.buttonHeight};

  .dropdown {
    ${({ theme }) => theme.mixins.style};
    position: absolute;
    z-index: ${({ theme }) => theme.zIndex[0]};
    min-width: 100px;
    overflow: hidden;
    outline: none;
    user-select: none;
  }

  .selected {
    display: flex;
    align-items: center;

    p {
      flex: 1 1 auto;
    }
  }

  .selected,
  option {
    ${({ theme }) => theme.mixins.clickable};
    height: ${({ theme }) => theme.shape.buttonHeight};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.color.icon};
  }
`

export default ({ selected, options, handleSelect }) => {
  // const [value, setValue] = useState(list[0])
  const [toggled, setToggled] = useState(false)

  const handleToggle = () => {
    setToggled(!toggled)
  }

  const handleKeyDown = () => {}

  return (
    <Root>
      <div
        className='dropdown'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role='listbox'
        tabIndex={0}
      >
        <div className='selected'>
          <p>{selected}</p>
          <DownArrow size={18} />
        </div>
        {toggled && (
          <div>
            {options
              .filter((item) => item !== selected)
              .map((item) => (
                <option
                  key={item}
                  value={item}
                  onClick={handleSelect}
                  onKeyDown={handleKeyDown}
                >
                  {item}
                </option>
              ))}
          </div>
        )}
      </div>
    </Root>
  )
}
