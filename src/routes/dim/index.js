import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style'
import * as actions from '../../actions/dim';
import reducers from '../../reducers';
import VerticalSlider from '../../components/VerticalSlider';
import HorizontalSlider from '../../components/HorizontalSlider';

@connect(reducers, actions)
export default class Dim extends Component {

    componentWillMount () {
        let { from, to, level } = this.props.dim

        from = Math.floor((100 / 24) * from);
        to = Math.floor((100 / 24) * to);

        this.setState({
            from, to, level
        })
    }

    componentDidMount () {
        this.dimLevelElement.style.setProperty(`--dimLevelGradientAngle`, '20deg');
    }

    update () {
        let { from, to, level } = this.state

        from = Math.floor((24 / 100) * from);
        to = Math.floor((24 / 100) * to);

        this.props.setDim({
            from, to, level
        });
    }

    fromChange (from) {
        this.setState({
            from
        })
        this.update()
    }

    toChange (to) {
        this.setState({
            to
        })
        this.update()
    }

    dimChange (level) {
        this.setState({
            level
        })
        this.update()
    }

    render(props, {from, to, level}) {

        const { to: toHours, from: fromHours } = props.dim

        return (
            <div class="page">
                <div class={style['dim']}>
                    <div class={style['dim-from']}>
                        <VerticalSlider
                            className={style['dim-from__slider']}
                            onChange={e => this.fromChange(e)}
                            value={from}
                        >
                        </VerticalSlider>
                    </div>
                    <div class={style['dim-to']}>
                        <VerticalSlider
                            className={style['dim-to__slider']}
                            onChange={e => this.toChange(e)}
                            value={to}
                        >
                        </VerticalSlider>
                    </div>
                    <div class={style['dim-numeric']}>
                        <input
                            type="text" min="1" max="12" steps="1" value={fromHours}
                            onChange={e => this.fromChange(e)}
                            onKeyDown={e => this.fromChange(e)}
                        />
                        <span>to</span>
                        <input
                            type="text" min="0" max="59" steps="1" value={toHours}
                            onChange={e => this.toChange(e)}
                            onKeyDown={e => this.toChange(e)}
                        />
                    </div>
                    <div
                        class={style['dim-level']}
                        ref={(e) => { this.dimLevelElement = e }}
                        >
                        <HorizontalSlider
                            className={style['dim-level__slider']}
                            onChange={e => this.dimChange(e)}
                            value={level}
                        >
                        </HorizontalSlider>
                    </div>
                </div>
            </div>
        );
    }
}