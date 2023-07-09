import { OnInit, Service } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, RunService } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { DEFAULT_PLAYER_DATA } from "shared/constants/PlayerData";
import { PlayerData, Settings } from "shared/types/PlayerData";
import { forEveryPlayer } from "shared/util/functions/forEveryPlayer";

const DATASTORE_NAME = "PlayerData";
const KEY_TEMPLATE = "%d_Data";

@Service()
export class PlayerDataService implements OnInit {
	private profileStore = ProfileService.GetProfileStore(DATASTORE_NAME, DEFAULT_PLAYER_DATA);
	private profiles = new Map<Player, Profile<PlayerData>>();

	onInit() {
		forEveryPlayer(
			(player) => this.createProfile(player),
			(player) => this.removeProfile(player),
		);

		forEveryPlayer((player) => this.incrementPlaytime(player));

		Functions.getData.setCallback((player, data) => {
			const profile = this.profiles.get(player);
			return profile?.Data?.[data] ?? false;
		});
	}

	private createProfile(player: Player) {
		const userId = player.UserId;
		const profileKey = KEY_TEMPLATE.format(userId);
		const profile = this.profileStore.LoadProfileAsync(profileKey);

		if (!profile) return player.Kick();

		profile.ListenToRelease(() => {
			this.profiles.delete(player);
			player.Kick();
		});

		profile.AddUserId(userId);
		profile.Reconcile();

		this.profiles.set(player, profile);
		Events.updateData.fire(player, HttpService.JSONEncode(profile.Data));
	}

	private removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();
	}

	public getProfile(player: Player) {
		const profile = this.profiles.get(player);

		if (profile) {
			const setCash = (value: number) => {
				profile.Data.cash = value;
				Events.updateCash(player, value);
			};

			const adjustCash = (value: number) => {
				const amount = profile.Data.cash + value;
				setCash(amount);
			};

			const setGems = (value: number) => {
				profile.Data.gems = value;
				Events.updateGems(player, value);
			};

			const adjustGems = (value: number) => {
				const amount = profile.Data.gems + value;
				setGems(amount);
			};

			return {
				data: profile.Data,
				setCash: setCash,
				adjustCash: adjustCash,
				setGems: setGems,
				adjustGems: adjustGems,
			};
		}

		return false;
	}

	private incrementPlaytime(player: Player) {
		const profile = this.profiles.get(player);
		const interval = 1; //in seconds
		let counter = 0;
		RunService.Heartbeat.Connect((deltaTime) => {
			counter = counter + deltaTime;
			if (counter >= interval && profile) {
				counter -= interval;
				profile.Data.totalPlaytime += interval;
			}
		});
	}
}
