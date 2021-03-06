'use strict';

var SignalsTable = React.createClass({
    displayName: 'SignalsTable',


    /**
     * This function returns seconds count before next signals arriving.
     */
    getElapsedTime: function getElapsedTime(maxSignalTime) {
        // Birth time of recent signal in milliseconds
        maxSignalTime = maxSignalTime || 0;
        // Walk through all signals to calc max signal time
        if (maxSignalTime == 0) {
            for (var i = 0; i < this.state.signals.length; i++) {
                maxSignalTime = Math.max(this.state.signals[i].tsMs, maxSignalTime);
            }
        }
        // Time when new signal will arrived.
        var signalsArrivingTime = maxSignalTime + this.state.interval;
        var elapsedTime = signalsArrivingTime - new Date();
        return Math.max(0, elapsedTime);
    },

    getInitialState: function getInitialState() {
        return {
            elapsed: 0,
            signals: this.props.signals,
            interval: this.props.interval
        };
    },

    componentDidMount: function componentDidMount() {
        this.timer = setInterval(this.tick, 37);
    },

    componentWillUnmount: function componentWillUnmount() {
        clearInterval(this.timer);
    },

    tick: function tick() {
        this.setState({ elapsed: this.getElapsedTime() });
    },

    addSignal: function addSignal(signal) {
        var signals = this.props.signals;
        signals.unshift(signal);
        signals.sort(function (a, b) {
            if (a.id < b.id) {
                return 1;
            } else if (a.id > b.id) {
                return -1;
            }
            return 0;
        });
        this.setState({ signals: signals });
    },

    render: function render() {
        var lifeTime = 60 * 1000;
        var elapsedString = (this.state.elapsed / 1000).toFixed(0) + ' seconds';
        var signals = this.props.signals;
        var that = this;

        var nextUpdateInClasses = ['table-view-cell', 'nextUpdateIn'];
        if (this.state.elapsed < 1) {
            nextUpdateInClasses.push('expired');
        }
        if (this.state.elapsed < lifeTime * 0.25) {
            nextUpdateInClasses.push('soon');
        }
        var nextUpdateInClass = nextUpdateInClasses.join(' ');

        return React.createElement(
            'ul',
            { className: 'table-view', id: 'signals-table' },
            React.createElement(
                'li',
                { className: nextUpdateInClass },
                React.createElement(
                    'p',
                    null,
                    'Next update in ',
                    React.createElement(
                        'b',
                        null,
                        elapsedString
                    )
                )
            ),
            React.createElement(
                'li',
                { className: 'table-view-cell' },
                React.createElement(
                    'ul',
                    { className: 'signal header' },
                    React.createElement(
                        'li',
                        { className: 'symbol' },
                        'Symbol'
                    ),
                    React.createElement(
                        'li',
                        { className: 'direction' },
                        'Option'
                    ),
                    React.createElement(
                        'li',
                        { className: 'time' },
                        'Time'
                    ),
                    React.createElement(
                        'li',
                        { className: 'reliability' },
                        'Reliability'
                    )
                )
            ),
            React.createElement('li', { className: 'table-view-divider' }),
            signals.map(function (signal) {
                var directionClassName = 'direction direction-' + signal.direction.toString().toLowerCase();
                var reliabilityClassName = 'reliability reliability-' + signal.reliability;
                var lifeTimePercent = that.getElapsedTime(signal.tsMs) / lifeTime * 100;
                var className = 'table-view-cell table-view-cell-signal ';
                className += lifeTimePercent > 0 ? 'active ' : 'expired ';
                return React.createElement(
                    'li',
                    { key: signal.key, className: className },
                    React.createElement(
                        'ul',
                        { className: 'signal' },
                        React.createElement(
                            'li',
                            { className: 'symbol' },
                            signal.symbol
                        ),
                        React.createElement(
                            'li',
                            { className: directionClassName },
                            signal.direction
                        ),
                        React.createElement(
                            'li',
                            { className: 'time' },
                            signal.time
                        ),
                        React.createElement(
                            'li',
                            { className: reliabilityClassName },
                            ' '
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'signalMeta' },
                        React.createElement(
                            'div',
                            { className: 'signalId' },
                            '#',
                            signal.id
                        ),
                        React.createElement(
                            'div',
                            { className: 'signalLifeTimeContainer' },
                            React.createElement(
                                'div',
                                { className: 'signalLifeTime' },
                                React.createElement('div', { className: 'signalLifeTimeBar', style: { width: lifeTimePercent + '%' } })
                            )
                        )
                    )
                );
            })
        );
    }
});