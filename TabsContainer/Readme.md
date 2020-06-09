# TabContainer

## 简介

本组件封装了 antd 的 Tabs 组件，可直接使用，不用关心事件之间的管理。

## 使用方法

### 1. 基础条件

1.1 pane 独立成一个组件，并使用 `withListenerTabPane` 封装

```tsx
// 普通组件
import {withListenerTabPane} from '@/pages/components/TabsContainer';
interface PropsTypes extends StateTypes, TabEventParam<{salaryId: number}>, RouteComponentProps {}
class StaffListPage extends React.Component<PropsTypes> {
	// ....
	@action
	onPaneRemove() {
		return new Promise((resolve, _reject) => {
			console.log('当pane被删除');
			resolve();
		});
	}

	@action
	onPaneActive() {
		console.log('当pane被激活');
	}
}

const SalaryDetailHoc = withListenerTabPane(StaffListPage);
export default SalaryDetailHoc;

// form表单，写法如下
interface PropsTypes extends StateTypes, TabEventParam<{}>, RouteComponentProps, FormComponentProps {}
class StaffListPage extends React.Component<PropsTypes> {
	// ....
}
const SalaryDetailHoc = withListenerTabPane(StaffListPage);
export default Form.create<PropsTypes>()(SalaryDetailHoc);
```

1.2 在 tabs 页面，定义 pane 获取方法

```ts
	import {TabsContainer} from '@/pages/components/TabsContainer';
	let FMCSalary = React.lazy(() =>
		import(/* webpackChunkName: "FMCSalary" */ '@/pages/SalaryManage')
	);
	let SalaryDetail = React.lazy(() =>
		import(/* webpackChunkName: "SalaryDetail" */ '@/pages/SalaryDetail')
	);

	@action
	getPane(key: string, params?: object & {paneTitle?: string}) {
		switch (key) {
			case 'SalaryManage':
				return {
					title: '工资列表',
					content: (
						<FMCSalaryHoc tabKey={'FMCSalary'} paneKey={'SalaryManage'} params={params}></FMCSalaryHoc>
					),
					paneKey: 'SalaryManage',
					closable: false
				};
			case 'SalaryDetail':
				return {
					title: params.paneTitle || '工资详情',
					content: (
						<SalaryDetailHoc
							tabKey={'FMCSalary'}
							paneKey={'SalaryDetail'}
							params={params}></SalaryDetailHoc>
					),
					paneKey: 'SalaryDetail',
					closable: true
				};
		}
	}

```

### 2. 新增、删除、激活、刷新

#### 新增

```ts
	import {dispatchToAddPane} from '@/pages/components/TabsContainer';

	showPlanDetail(val: PlanItem) {
		dispatchToAddPane({tabKey: this.props.tabKey, paneKey: 'PlanDetails', params: {planId: val.planId}});
	}
```

#### 删除

```ts
	import {dispatchToRemovePane} from '@/pages/components/TabsContainer';

	showPlanDetail(val: PlanItem) {
		dispatchToRemovePane({tabKey: this.props.tabKey, paneKey: 'PlanDetails', params: {planId: val.planId}});
	}
```

#### 激活

```ts
	import {dispatchToActivePane} from '@/pages/components/TabsContainer';

	showPlanDetail(val: PlanItem) {
		dispatchToActivePane({tabKey: this.props.tabKey, paneKey: 'PlanDetails', params: {planId: val.planId}});
	}
```

#### 刷新

```ts
	import {dispatchToAddPane} from '@/pages/components/TabsContainer';

	showPlanDetail(val: PlanItem) {
		dispatchToAddPane({tabKey: this.props.tabKey, paneKey: 'PlanDetails', params: {planId: val.planId}});
	}
```

## 设计思路

1. 将所有的`pane`统一放在`tabsContainer`中处理，方便`pane`的增删查。
2. 每一组`pane`有独立的`tabkey`,已避免多个`tab`同时使用时，造成数据污染。
3. `pane`的`key`，包含`pane`的所有参数，为了达到同一个`pane`不同参数的多开展示。
4. 将`tab`和`pane`的`事件`封装在各自的组件中，这样使用时，就可以不用去处理两者通信的`事件`了。
