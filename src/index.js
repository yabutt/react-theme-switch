import React, { Component } from 'react';

class ThemeSwitch extends Component {
  constructor(props) {
    super(props);

    this.css = `
      html { filter: invert(100%); background: #fefefe; }
      * { background-color: inherit }
    `;

    if (this.props.preserveRasters) {
      this.css += 'img:not([src*=".svg"]), video, [style*="url("] { filter: invert(100%) }';
    }

    this.supported = this.invertSupported('filter', 'invert(100%)');

    this.state = {
      active: false
    };

    this.toggle = this.toggle.bind(this);
  }

  isDeclarationSupported (property, value) {
    var prop = property + ':',
        el = document.createElement('test'),
        mStyle = el.style;
    el.style.cssText = prop + value;
    return mStyle[property];
  }

  toggle() {
    this.setState({
      active: !this.state.active
    });
  }

  componentDidMount() {
    if (this.props.store) {
      this.setState({
        active: this.props.store.getItem('ThemeSwitch') || false
      });
    }
  }

  componentDidUpdate() {
    if (this.props.store) {
      this.props.store.setItem('ThemeSwitch', this.state.active);
    }
  }

  render() {
    if (!this.supported) {
      return null;
    }

    return (
      <div>
        <button aria-pressed={this.state.active} onClick={this.toggle}>
          inverted theme: <span aria-hidden="true">{this.state.active ? 'on' : 'off'}</span>
        </button>
        <style media={this.state.active ? 'screen' : 'none'}>
          {this.state.active ? this.css.trim() : this.css}
        </style>
      </div>
    );
  }
}

ThemeSwitch.defaultProps = {
  preserveRasters: true,
  store: localStorage
}

export default ThemeSwitch;
