export interface PlayerData {
	cash: number;
	gems: number;
	totalPlaytime: number;
	settings: Settings;
}

export interface Settings {
	music: boolean;
	sound_effects: boolean;
}
