interface PaneItem {
	title: string; // pane 标题
	content: JSX.Element; // pane component
	paneKey: string; // pane key
	closable: boolean; // pane 是否可关闭
}
interface TabEventParam<T> {
	paneKey: string;
	tabKey: string;
	paneTitle?: string;
	params?: T;
}
