import React from 'react';
import {observable, action} from 'mobx';
import {StateTypes} from '@/dal/State';
import {eventNames, dispatchToRemovePane, formatKey} from './TabsTool';

interface PropsTypes extends StateTypes, TabEventParam<{}> {}

export const withListenerTabPane = <P extends object>(Component: React.ComponentType<P>) => {
	class HOC extends React.Component<PropsTypes> {
		// tslint:disable
		@observable ref: any = null;
		constructor(props: PropsTypes) {
			super(props);
			this.onPaneActive = this.onPaneActive.bind(this);
			this.onPaneRemove = this.onPaneRemove.bind(this);
			this.dispatchRemoveEvent = this.dispatchRemoveEvent.bind(this);
			this.setRef = this.setRef.bind(this);
		}

		componentDidMount() {
			this.addListener();
		}

		componentWillUnmount() {
			this.removeAllListener();
		}

		addListener() {
			const eventKey = JSON.stringify(formatKey(this.props));
			// 监听 被激活
			addEventListener(`${eventNames.actived}-${eventKey}`, this.onPaneActive);
			// 监听 被关闭
			addEventListener(`${eventNames.removed}-${eventKey}`, this.onPaneRemove);
		}

		removeAllListener() {
			const eventKey = JSON.stringify(formatKey(this.props));
			removeEventListener(`${eventNames.actived}-${eventKey}`, this.onPaneActive);
			removeEventListener(`${eventNames.removed}-${eventKey}`, this.onPaneRemove);
		}

		onPaneActive() {
			this.ref.onPaneActive
				? this.ref.onPaneActive()
				: this.ref.wrappedInstance && this.ref.wrappedInstance.onPaneActive
				? this.ref.wrappedInstance.onPaneActive()
				: null;
		}

		onPaneRemove() {
			this.ref.onPaneRemove
				? this.ref.onPaneRemove().then(this.dispatchRemoveEvent)
				: this.ref.wrappedInstance && this.ref.wrappedInstance.onPaneRemove
				? this.ref.wrappedInstance.onPaneRemove().then(this.dispatchRemoveEvent)
				: this.dispatchRemoveEvent();
		}

		dispatchRemoveEvent() {
			this.removeAllListener();
			dispatchToRemovePane({
				tabKey: this.props.tabKey,
				paneKey: this.props.paneKey,
				params: this.props.params
			});
		}

		@action
		// tslint:disable
		setRef(ref: any) {
			this.ref = ref;
		}

		public render() {
			return <Component ref={this.setRef} {...(this.props as P)} />;
		}
	}

	return HOC;
};
