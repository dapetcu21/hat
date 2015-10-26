import _url from 'url-parse';
window.urlParse = _url;
import './createElementShim';

import GameView from './GameView';

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-GameView', viewClass: GameView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-GameView', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
