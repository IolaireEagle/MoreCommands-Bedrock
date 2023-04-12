import { world, Player, MinecraftEffectTypes } from "@minecraft/server"

import { commands } from "./commands.js"

// this is the command parser function
function parseCommand(commandString, sender) {
  const [commandName, ...args] = commandString.trim().slice(1).split(' ');
  const command = commands[commandName];
  
  if (typeof command === 'function') {
    command(sender, ...args);
  } else {
    sender.sendMessage("§cUnknown command!");
  }
}

world.events.beforeChat.subscribe((event) => {
    const player = event.sender;
    if (!(player instanceof Player)) return;
    if (!event.message.startsWith("!")) {
        return;
    } else {
        parseCommand(event.message, event.sender);
        event.cancel = true;
    }
})

