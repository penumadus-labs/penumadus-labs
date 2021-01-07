import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  componentDidCatch(error) {
    // add an error tracker
  }

  componentDidMount() {
    if (this.props.test)
      this.setState({
        error: new Error('test'),
        hasError: true,
      })
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    const {
      state: { hasError, error },
      props: {
        card,
        children,
        message = 'Something has caused the app to crash',
      },
    } = this

    if (hasError) {
      return (
        <div className={card ? 'card' : ''}>
          <p className="red-text">Error caught: {message}</p>
          <p>{error?.toString()}</p>
        </div>
      )
    }

    return children ?? null
  }
}
