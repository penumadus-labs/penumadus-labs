import React from 'react'

export default ({ register, setValue, name }) => {
  const handleClick = (e) => {
    e.preventDefault()
    setValue(name, '')
  }

  return (
    <div>
      <label className="label space-children-x-xxs">
        {name}:
        <br />
        <input className="input" type="date" ref={register} name={name} />
        <br />
      </label>
      <button className="button-text text-blue" onClick={handleClick}>
        clear
      </button>
    </div>
  )
}
