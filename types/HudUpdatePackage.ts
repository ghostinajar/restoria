// hudUpdatePackage
// user data sent to client for display in HUD

interface IHudUpdatePackage {
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  currentMv: number;
  maxMv: number;
  attackCooldown: number;
  bonusCooldown: number;
  fullCooldown: number;
  combatTargetName: string | undefined;
}

export default IHudUpdatePackage;
