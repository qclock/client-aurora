import { h, Component } from 'preact';
import style from './style';

import { getHorizontalSliderLevel } from './tools';


export default class VerticalSlider extends Component {

    componentDidMount() {
        this.setLevel(this.percentToLevel(this.props.value));
    }

    shouldComponentUpdate({ value }, nextState) {
        if (this.state.selecting) return false;

        const oldValue = this.props.value;

        if (oldValue !== value) {
            this.setLevel(this.percentToLevel(value));
            return false;
        }

        return true;
    }

    percentToLevel (percent) {
        const { width } = this.container.getBoundingClientRect();

        return ((percent / 100) * width);
    }

    updateValue (value, width) {
        const percentage = Math.floor((value / width) * 100);
        this.props.onChange(percentage);
    }

    updateLevel (event, callback) {
        const { width } = event.currentTarget.getBoundingClientRect();

        getHorizontalSliderLevel(event, (value) => {
            this.updateValue(value, width);
            callback(value);
        });
    }

    setLevel (level) {
        if (level === this.state.level) return;

        if (this.props.customLevel) {
            this.container.querySelector(`.${this.props.customLevel}`).style.setProperty(`--slideLevel`, level + 'px');
        }
        else {
            this.container.style.setProperty(`--slideLevel`, level + 'px');
        }

        // TODO onresize

        this.setState({
            level
        });
    }

    selectStart (e) {
        e.preventDefault();
        if (this.props.disabled) return;

        this.setState({
            selecting: true
        });
        this.updateLevel(event, level => this.setLevel(level));
    }

    selecting(event) {
        event.preventDefault();
        if (this.props.disabled) return;

        if (!this.state.selecting) return;

        this.updateLevel(event, level => this.setLevel(level));
    }

    clicked(event) {
        if (this.props.disabled) return;
        event.preventDefault();
        this.updateLevel(event, level => this.setLevel(level));
    }

    selectEnd(e) {
        if (this.props.disabled) return;
        e.preventDefault();
        this.setState({
            selecting: false
        });
    }

    render(props, state) {
        const className = [props.className, style['horizontal-slider']];

        if (props.customLevel) className.push(style['horizontal-slider--custom-level']);

        return (<div
            disabled={props.disabled}
            ref={(element) => { this.container = element; }}
            class={className.join(' ')}
            onClick={e => this.clicked(e)}
            onMouseDown={e => this.selectStart(e)}
            onTouchStart={e => this.selectStart(e)}
            onMouseMove={e => this.selecting(e)}
            onTouchMove={e => this.selecting(e)}
            onMouseUp={e => this.selectEnd(e)}
            onTouchEnd={e => this.selectEnd(e)}
                >
            {props.children}
        </div>);
    }
}
