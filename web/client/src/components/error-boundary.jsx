import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  componentDidCatch(error) {
    // add an error tracker
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    const { state, props } = this

    if (state.hasError) {
      return (
        <div className="card">
          <p className="red-text">
            Error caught: Something has caused the app to crash
          </p>
          <p>{state.error?.toString()}</p>
        </div>
      )
    }

    return props.children ?? null
  }
}
