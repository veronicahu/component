/**
 * @description tab 事件类型
 * @enum {number}
 */
enum TabEventType {
	ADD = 'add',
	ADDED = 'added',
	ACTIVE = 'active',
	ACTIVED = 'actived',
	REMOVE = 'remove',
	REMOVED = 'removed'
}
/**
 * tab 事件名称
 */
const eventNames = {
	add: 'to-add-pane',
	active: 'to-active-pane',
	remove: 'to-remote-pane',

	added: 'pane-added',
	actived: 'pane-actived',
	removed: 'pane-removed'
};

/**
 * @description 派发tab事件
 * @author veronica
 * @date 2020-01-17
 * @param {TabEventType} type
 * @param {TabEventParam<{}>} params
 */
function dispatchTabEvent(type: TabEventType, params: TabEventParam<{}>) {
	const tabKey = params.tabKey; // tab标识
	const eventName = eventNames[type];
	let eventString: string = null; // 事件名称

	if (type === TabEventType.ADD || type === TabEventType.ACTIVE || type === TabEventType.REMOVE) {
		eventString = `${tabKey}-${eventName}`;
	} else {
		eventString = `${eventName}-${JSON.stringify(params)}`;
	}
	console.log('触发事件', eventString);

	dispatchEvent(
		new CustomEvent(eventString, {
			bubbles: true, // 是否冒泡
			cancelable: false, // 是否取消默认事件
			detail: params
		})
	);
}

/**
 * @description 添加pane
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchToAddPane(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.ADD, param);
}

/**
 * @description 激活pane
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchToActivePane(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.ACTIVE, param);
}
/**
 * @description pane被激活
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchOnPaneActived(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.ACTIVED, param);
}
/**
 * @description pane被添加
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchOnPaneAdded(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.ADDED, param);
}
/**
 * @description 删除pane
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchToRemovePane(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.REMOVE, param);
}
/**
 * @description pane被删除
 * @author veronica
 * @date 2020-01-17
 * @export
 * @param {TabEventParam<{}>} param
 */
function dispatchOnPaneRemoved(param: TabEventParam<{}>) {
	dispatchTabEvent(TabEventType.REMOVED, param);
}

// tslint:disable-next-line
function formatKey(oriProps: any) {
	let newProps = {
		tabKey: oriProps.tabKey,
		paneKey: oriProps.paneKey,
		params: oriProps.params
	};
	return newProps;
}

export {
	eventNames,
	dispatchToAddPane,
	dispatchToActivePane,
	dispatchToRemovePane,
	dispatchOnPaneActived,
	dispatchOnPaneAdded,
	dispatchOnPaneRemoved,
	formatKey
};
