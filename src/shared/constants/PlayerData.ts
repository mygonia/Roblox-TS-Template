import { PlayerData } from "../types/PlayerData";
import { Achievements } from "./Achievements";

export const DEFAULT_PLAYER_DATA: PlayerData = {
	cash: 100,
	gems: 100,
	progress: {
		["city"]: "Toronto",
		["restaurant"]: "Lemonade Stand",
		["foodStationLevels"]: [0],
	},
	totalPlaytime: 0,
	customersServed: 0,
	cashEarned: 0,
	cashSpent: 0,
	gemsEarned: 0,
	gemsSpent: 0,
	chestsOpened: 0,
	eventBadges: {},
	achievements: Achievements,
	settings: {
		music: true,
		sound_effects: true,
	},
};
