import pandaPrompt from "./panda";
import hyenaPrompt from "./hyena";
import slothPrompt from "./sloth";
import lynxPrompt from "./lynx";
import friendPrompt from "./friend";
import friendClawPrompt from "./friendClaw";

export const promptByAgentName: Record<string, string> = {
  Panda: pandaPrompt,
  Hyena: hyenaPrompt,
  Sloth: slothPrompt,
  Lynx: lynxPrompt
};

export const promptByType: Record<string, string> = {
  friend: friendPrompt,
  friend_claw: friendClawPrompt
};
