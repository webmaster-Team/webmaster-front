import * as React from 'react';

export default class LoadComponentAsync extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Component: null
        }
    }

    componentDidMount() {
 　　　　// 这里使用的import进行动态加载组件
        import(this.props.componentName
         /* webpackChunkName: "[request]" */
        ).then(Component => {
            this.setState({
                Component: Component.default
            })
        })
    }

    render () {
        let Component = this.state.Component
        if (Component) {
            return <Component />
        } else {
            return null
        }
    }
}