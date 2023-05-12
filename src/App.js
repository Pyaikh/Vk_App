import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol, Input } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';



import { Icon16ErrorCircleFill } from '@vkontakte/icons';

import Home from './panels/Home';
import Intro from './panels/Intro';
import { func, object } from 'prop-types';

const ROUTES = {
	HOME: 'home',
	INTRO: 'intro'
};

const STORAGE_KEYS = {
	STATUS: 'status',

};



const App = () => {
	const [activePanel, setActivePanel] = useState(ROUTES.INTRO);
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
	const [snackbar, setSnackbar] = useState(null);
  
	useEffect(() => {
	  async function fetchData() {
		try {
		  const user = await bridge.send('VKWebAppGetUserInfo');
		  const storageData = await bridge.send('VKWebAppStorageGet', { keys: Object.values(STORAGE_KEYS) });
		  console.log(storageData);
		  const data = {};
		  storageData.keys.forEach(({ key, value }) => {
			try {
			  data[key] = value ? JSON.parse(value) : {};
			  if (data.hasOwnProperty(key)) {
				switch (key) {
				  case STORAGE_KEYS.STATUS:
					if (data[key].hasSeenIntro) {
					  setActivePanel(ROUTES.HOME);
					  setUserHasSeenIntro(true);
					}
					break;
				  default:
					break;
				}
			  }
			} catch (error) {
			  setSnackbar(
				<Snackbar
				  layout='vertical'
				  onClose={() => setSnackbar(null)}
				  before={
					<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)' }}>
					  <Icon16ErrorCircleFill fill='#fff' width='14' height='14' />
					</Avatar>
				  }
				  duration={900}
				>
				  Проблемы с получением данных из Storage
				</Snackbar>
			  );
			}
		  });
		  setUser(user);
		  setPopout(null);
		} catch (error) {
		  setSnackbar(
			<Snackbar
			  layout='vertical'
			  onClose={() => setSnackbar(null)}
			  before={
				<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)' }}>
				  <Icon16ErrorCircleFill fill='#fff' width='14' height='14' />
				</Avatar>
			  }
			  duration={900}
			>
			  Проблемы с получением данных
			</Snackbar>
		  );
		}
	  }
	  fetchData();
	}, []);
  
	const viewIntro = async function () {
	  try {
		await bridge.send('VKWebAppStorageSet', {
		  key: STORAGE_KEYS.STATUS,
		  value: JSON.stringify({ hasSeenIntro: true })
		});
	  } catch (error) {
		setSnackbar(
		  <Snackbar
			layout='vertical'
			onClose={() => setSnackbar(null)}
			before={
			  <Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)' }}>
				<Icon16ErrorCircleFill fill='#fff' width='14' height='14' />
			  </Avatar>
			}
			duration={900}
		  >
			Проблемы с отправкой данных в Storage
		  </Snackbar>
		);
	  }
	};
  
	return (
	  <View activePanel={activePanel} popout={popout}>
		<Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} viewIntro={viewIntro} />
		<Home id={ROUTES.HOME} />
		{snackbar}
	  </View>
	);
  };
  
  
  

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};	
	

	const viewIntro = async function () {
		try {
		  await bridge.send('VKWebAppStorageSet', {
			key: STORAGE_KEYS.STATUS,
			value: JSON.stringify({ hasSeenIntro: true })
		  });
		} catch (error) {
		  setSnackbar(
			<Snackbar
			  layout='vertical'
			  onClose={() => setSnackbar(null)}
			  before={
				<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)' }}>
				  <Icon16ErrorCircleFill fill='#fff' width='14' height='14' />
				</Avatar>
			  }
			  duration={900}
			>
			  Проблемы с отправкой данных в Storage
			</Snackbar>
		  );
		}
	  


	  return (
		<ConfigProvider>
		  <AdaptivityProvider>
			<AppRoot>
			  <SplitLayout popout={popout}>
				<SplitCol>
				  <View activePanel={activePanel}>
					<Home id={ROUTES.HOME} fetchedUser={fetchedUser} go={go} SnackbarError={snackbar} />
					<Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} SnackbarError={snackbar} userHasSeenIntro={userHasSeenIntro}/>
				  </View>
				</SplitCol>
			  </SplitLayout>
			  {snackbar}
			</AppRoot>
		  </AdaptivityProvider>
		</ConfigProvider>
	  )
	  };
export default App;
