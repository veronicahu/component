import React from 'react';
import {autobind} from 'core-decorators';
import {observer} from 'mobx-react';
import {Tabs} from 'antd';
import {observable} from 'mobx';
import {eventNames, dispatchOnPaneActived, dispatchOnPaneRemoved, formatKey} from './TabsTool';

interface PropsType {
	tabKey: string; // tab的key,用于区分不同的tabs
	basePane: PaneItem; // 第一个pane
	getPane: (key: string, params: object) => PaneItem; // 获取pane的方法
}

/**
 * @description Tabs 封装
 * @author veronica
 * @date 2020-01-17
 * @class TabsContainer
 * @extends {React.Component<PropsType>}
 */
@autobind
@observer
class TabsContainer extends React.Component<PropsType> {
	@observable paneList: PaneItem[] = []; // 当前tab中pane的列表
	@observable activeKey: string = null; // 当前激活的pane的key
	@observable keyList: string[] = []; // 当前tab中的key的列表

	componentDidMount() {
		this.initPaneList();
		this.addListener();
	}

	componentWillUnmount() {
		this.removeListener();
	}

	/**
	 * @description 初始化panelist
	 * @author veronica
	 * @date 2020-02-05
	 * @memberof TabsContainer
	 */
	initPaneList() {
		const cacheKeyList = sessionStorage.getItem(`${this.props.tabKey}-keylist`);
		const cacheActivedKey = sessionStorage.getItem(`${this.props.tabKey}-actived-key`);

		let paneList = []; // pane列表
		let key = null; // 激活的key
		let keyList = []; // key列表

		if (cacheKeyList) {
			// 有缓存
			key = cacheActivedKey;
			keyList = JSON.parse(cacheKeyList);
			paneList = keyList.map((keyString: string) => {
				const keyParmas = JSON.parse(keyString);
				return this.props.getPane(keyParmas.paneKey, keyParmas.params);
			});
		} else {
			let newProps = formatKey(this.props.basePane.content.props);
			// 无缓存
			key = `${JSON.stringify(newProps)}`;
			keyList = [key];
			paneList = [this.props.basePane];
		}

		this.paneList.push(...paneList);
		this.keyList.push(...keyList);
		this.activeKey = key;
		this.chchePaneList();
	}

	addListener() {
		// 监听 有人想添加pane
		addEventListener(`${this.props.tabKey}-${eventNames.add}`, this.addTab);
		// 监听 有人想删除pane
		addEventListener(`${this.props.tabKey}-${eventNames.remove}`, this.removeTab);
		// 监听 有人想激活pane
		addEventListener(`${this.props.tabKey}-${eventNames.active}`, this.activeTab);
	}

	removeListener() {
		removeEventListener(`${this.props.tabKey}-${eventNames.add}`, this.addTab);
		removeEventListener(`${this.props.tabKey}-${eventNames.remove}`, this.removeTab);
		removeEventListener(`${this.props.tabKey}-${eventNames.active}`, this.activeTab);
	}

	/**
	 * @description 激活的tab发生变化
	 * @author veronica
	 * @date 2020-01-17
	 * @param {string} activeKey
	 * @memberof TabsContainer
	 */
	onActiveTabChange(activeKey: string) {
		this.activeKey = activeKey;
		this.chchePaneList();
	}

	/**
	 * @description tab被添加或删除
	 * @author veronica
	 * @date 2020-01-17
	 * @param {string} targetKey
	 * @param {('add' | 'remove')} action
	 * @memberof TabsContainer
	 */
	onTabAddOrDelete(targetKey: string, action: 'add' | 'remove') {
		console.log('onTabAddOrDelete', action, ':', targetKey);
		if (action === 'add') {
			this.activeKey = targetKey;
			this.chchePaneList();
		}
		if (action === 'remove') {
			this.onTabRemove(targetKey);
		}
	}

	/**
	 * @description 点击pane 如果未被激活,抛出被激活事件
	 * @author veronica
	 * @date 2020-01-17
	 * @param {string} targetKey
	 * @memberof TabsContainer
	 */
	onTabClick(targetKey: string) {
		if (targetKey !== this.activeKey) {
			const paneProps = JSON.parse(targetKey);
			dispatchOnPaneActived(paneProps);
		}
	}

	/**
	 * @description 点击closeIcon删除pane,抛出被删除事件
	 * @author veronica
	 * @date 2020-01-17
	 * @param {string} targetKey
	 * @memberof TabsContainer
	 */
	onTabRemove(targetKey: string) {
		const paneProps = JSON.parse(targetKey);
		dispatchOnPaneRemoved(paneProps);
	}

	/**
	 * @description 添加pane
	 * @author veronica
	 * @date 2020-01-17
	 * @param {*} param
	 * @memberof TabsContainer
	 */
	addTab(event: CustomEvent) {
		const eventDetail = formatKey(event.detail);
		const key = `${JSON.stringify(eventDetail)}`;

		if (!this.keyList.includes(key)) {
			const paneItem: PaneItem = this.props.getPane(eventDetail.paneKey, eventDetail.params);
			this.paneList.push(paneItem);
			this.keyList.push(key);
		}

		this.activeKey = key;
		this.chchePaneList();
	}

	/**
	 * @description 删除pane
	 * @author veronica
	 * @date 2020-01-17
	 * @param {CustomEvent} event
	 * @memberof TabsContainer
	 */
	removeTab(event: CustomEvent) {
		console.log('removeTab', event);
		const eventDetail = formatKey(event.detail);
		const deleteIndex = this.keyList.findIndex(key => key === JSON.stringify(eventDetail));
		this.paneList.splice(deleteIndex, 1);
		this.keyList.splice(deleteIndex, 1);
		this.activeKey = this.keyList[deleteIndex - 1];
		this.chchePaneList();
	}

	/**
	 * @description 激活pane
	 * @author veronica
	 * @date 2020-01-17
	 * @param {CustomEvent} event
	 * @memberof TabsContainer
	 */
	activeTab(event: CustomEvent) {
		console.log('activeTab', event);
		const eventDetail = formatKey(event.detail);
		this.activeKey = JSON.stringify(eventDetail);
		this.chchePaneList();
	}

	/**
	 * @description panelist发生变化
	 * @author veronica
	 * @date 2020-02-05
	 * @memberof TabsContainer
	 */
	chchePaneList() {
		sessionStorage.setItem(`${this.props.tabKey}-keylist`, JSON.stringify(this.keyList));
		sessionStorage.setItem(`${this.props.tabKey}-actived-key`, this.activeKey);
	}

	render() {
		return (
			<Tabs
				onChange={this.onActiveTabChange}
				activeKey={this.activeKey}
				onEdit={this.onTabAddOrDelete}
				onTabClick={this.onTabClick}
				hideAdd
				type="editable-card">
				{this.paneList.length > 0 &&
					this.paneList.map(paneItem => {
						let newProps = formatKey(paneItem.content.props);
						return (
							<Tabs.TabPane
								tab={paneItem.title}
								closable={paneItem.closable}
								key={`${JSON.stringify(newProps)}`}>
								{paneItem.content}
							</Tabs.TabPane>
						);
					})}
			</Tabs>
		);
	}
}

export default TabsContainer;
