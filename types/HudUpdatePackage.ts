// hudUpdatePackage
// user data sent to client for display in HUD

interface IHudUpdatePackage {
  combatTargetName: string | undefined;
  actionQueueLabels: [
    string | undefined,
    string | undefined,
    string | undefined
  ];
}

export default IHudUpdatePackage