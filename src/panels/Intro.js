import React, {Fragment} from 'react';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';


import './Intro.css';

const Intro = ({id, SnackbarError, fetchedUser,userHasSeenIntro, go}) => {
	return (
	<Panel id={id} centered={true}>
		<PanelHeader>
			Test
		</PanelHeader>
		
	</Panel>
	)
};



export default Intro;
