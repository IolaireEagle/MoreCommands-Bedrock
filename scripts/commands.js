import { world, Player, MinecraftEffectTypes, Container } from "@minecraft/server"

export const commands = {};

function killAll(sender, killPlayers = "false") {
    if (killPlayers == "true") {
        sender.dimension.runCommandAsync("kill @e");
    } else if (killPlayers == "false") {
        sender.dimension.runCommandAsync("kill @e[type=!player]");
    } else {
        sender.sendMessage("§cIncorrect syntax! Correct usage: !killall <killPlayers: bool>");
    }
}

function breakCommand(sender, dropItem = "false") {
  try {
    const block = sender.getBlockFromViewDirection();
    const blockCoords = "${block.x} ${block.y} ${block.z}";

    let result = "setblock ${blockCoords} air";
    if (dropItem === "true") {
      result += " [] destroy";
    } else if (dropItem === "false") {
      // Do nothing else
    } else {
      sender.sendMessage("§cIncorrect syntax! Correct usage: !break <dropItem: bool>");
      return;
    }

    sender.runCommandAsync(result);
  } catch (e) {
    sender.sendMessage("§cBlock is out of range!");
  }
}


function explodeCommand(sender, radius = "4") {
    try {
        const block = sender.getBlockFromViewDirection();
        block.dimension.createExplosion(block.location, parseInt(radius));
    } catch (e) {
        sender.sendMessage("§cBlock is out of range!");
    }
}

function feedCommand(sender) {
    sender.addEffect(MinecraftEffectTypes.saturation, 2, 255, false);
    sender.playSound("random.burp");
    sender.sendMessage("§7§oYou start to feel full...");
}
// TODO - Add target variable
function healCommand(sender) {
    sender.getComponent("health").resetToMaxValue();
    sender.sendMessage("§7§oAhhhh...");
}

// TODO - Add target variable
function gmCommand(sender, mode) {
    const validModes = ["a", "s", "c", "sp", "adventure", "survival", "creative", "spectator"];
    if (validModes.includes(mode)) {
        let result = "gamemode".concat(" ", mode, "@s");
        sender.runCommandAsync(result);
    } else {
        sender.sendMessage("§cInvalid gamemode!");
    }
}

// TODO - Add target variable
function iCommand(sender, item, amount = "1") {
    let result = "give @s ";
        result = result.concat(item, " ", amount);
        sender.runCommandAsync(result);
}

// TODO - Add target variable
function heartsCommand(sender, amount) {
    let intAmount = parseFloat(amount) * 2;
    sender.getComponent("health").setCurrent(parseInt(intAmount));
}

function invseeCommand(sender, target) {
    const players = world.getAllPlayers();
    if (!(sender instanceof Player)) return;
    const senderInv = sender.getComponent("inventory").container;
    var targetInv 
    for (let i = 0; i < players.length; i++) {
        if (players[i].name == target) {
            targetInv = players[i].getComponent("inventory").container
            senderInv = targetInv
        } else {
            continue;
        }
    }
}

commands.peaceful = (sender) => { sender.runCommandAsync("difficulty p"); sender.sendMessage("§dDifficulty set to §aPeaceful!"); };
commands.easy = (sender) => { sender.runCommandAsync("difficulty e"); sender.sendMessage("§dDifficulty set to §eEasy!"); };
commands.normal = (sender) => { sender.runCommandAsync("difficulty n"); sender.sendMessage("§dDifficulty set to §6Normal!"); };
commands.hard = (sender) => { sender.runCommandAsync("difficulty h"); sender.sendMessage("§dDifficulty set to §4Hard!"); };
commands.killall = (sender, killPlayers) => { killAll(sender, killPlayers) };
commands.break = (sender, dropItem) => { breakCommand(sender, dropItem) };
commands.explode = (sender, radius) => { explodeCommand(sender, radius) };
commands.feed = (sender) => { feedCommand(sender) };
commands.heal = (sender) => { healCommand(sender) };
commands.gm = (sender, mode) => { gmCommand(sender, mode) };
commands.gma = (sender) => { sender.runCommandAsync("gamemode a"); sender.sendMessage("§dGamemode set to Adventure!"); };
commands.gms = (sender) => { sender.runCommandAsync("gamemode s"); sender.sendMessage("§dGamemode set to Survival!"); };
commands.gmc = (sender) => { sender.runCommandAsync("gamemode c"); sender.sendMessage("§dGamemode set to Creative!"); };
commands.gmsp = (sender) => { sender.runCommandAsync("gamemode spectator"); sender.sendMessage("§dGamemode set to Spectator!"); };
commands.i = (sender, item, amount) => { iCommand(sender, item, amount) };
commands.hearts = (sender, amount) => { heartsCommand(sender, amount) };
commands.invsee = (sender, target) => { invseeCommand(sender, target) }