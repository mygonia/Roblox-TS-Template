enum badgeLevels {
	Bronze,
	Silver,
	Gold,
}

export interface PlayerData {
	cash: number;
	gems: number;
	progress: {
		["city"]: string;
		["restaurant"]: string;
		["foodStationLevels"]: Array<number>;
	};
	totalPlaytime: number;
	customersServed: number;
	cashEarned: number;
	cashSpent: number;
	gemsEarned: number;
	gemsSpent: number;
	chestsOpened: number;
	achievements: { [id: string]: boolean };
	eventBadges: { [eventName: string]: { dateEarned: number; levelAchieved: badgeLevels } };
	settings: Settings;
}

export interface Settings {
	music: boolean;
	sound_effects: boolean;
}
