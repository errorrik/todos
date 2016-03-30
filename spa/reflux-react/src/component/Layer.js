import React, {Component} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

export default class Layer {
    constructor(props = {}) {
        this.props = props;
    }

    mount() {
        if (!this.mounted) {
            this.el = document.createElement(this.props.tag || 'div');
            this.el.className = 'ui-layer ' + (this.props.className || '');
            document.body.appendChild(this.el);
            this.mounted = true;

            this.pos(this.props);
        }
    }

    unmount() {
        if (this.mounted) {
            document.body.removeChild(this.el);
            this.mounted = false;
        }
    }

    render(element) {
        if (this.mounted) {
            render(element, this.el);
        }
    }

    destory() {
        unmountComponentAtNode(this.el);
        this.unmount();
        this.el = null;
    }

    pos(arg) {
        const {left = -1000, top = 0} = arg;
        this.el.style.left = `${left}px`;
        this.el.style.top = `${top}px`;
    }
}