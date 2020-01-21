import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'

const Root = styled.div`
  ${({ theme }) => theme.mixins.style};
  ${({ toggled }) => toggled && 'border-bottom-left-radius: 0'};
  ${({ toggled }) => toggled && 'border-bottom-right-radius: 0'};


  width: ${({ width }) => width};
  overflow: hidden;
  user-select: none;

  .select {
    display: flex;
    align-items: center;
    height: 100%;

    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.color.icon};
    ${({ theme }) => theme.mixins.clickable}

    p {
      flex: 1 1 auto
    }

  }
  .list {
    position: absolute;
    z-index: ${({ theme }) => theme.zIndex[0]};
    width: ${({ width }) => width};
    overflow: hidden;
    border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius};
    border-bottom-left-radius: ${({ theme }) => theme.shape.borderRadius};
    .item {
      display: block;
      ${({ theme }) => theme.mixins.clickable}
      padding: ${({ theme }) => theme.spacing.sm};
      background: ${({ theme }) => theme.color.icon}

    }
  }`

export default ({ list }) => {
  const [value, setValue] = useState(list[0])
  const [toggled, setToggled] = useState(false)
  console.log('hi')

  const handleToggle = () => {
    setToggled(!toggled)
  }

  const handleSelect = ({ target }) => {
    setValue(target.innerText)
  }

  return (
    <Root width='150px' toggled={toggled} onClick={handleToggle}>
      <div className='select'>
        <p>{value}</p>
        <DownArrow size={18} />
      </div>
      <div className='list'>
        {toggled &&
          list
            .filter(item => item !== value)
            .map(item => (
              <div
                role='button'
                className='item'
                key={item}
                onClick={handleSelect}
                onKeyDown={handleSelect}
                tabIndex={0}
              >
                {item}
              </div>
            ))}
      </div>
    </Root>
  )
}
