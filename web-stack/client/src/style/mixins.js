const border = `
    border: 1px solid grey;
    border-radius: 5px;
`

const reset = `
    display: block;
    margin: 0;
    padding: 0;
`

const centerChild = `
    display: flex;
    justify-content: center;
    align-items: center;
`

const clickable = `
    cursor: pointer;
    outline: none;

    :hover {
        filter: brightness(90%);
    }
    :active {
        filter: brightness(80%);
    }
`

export default { border, reset, centerChild, clickable }
