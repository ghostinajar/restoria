// Grudge
// a record of someone an agent wants to attack, with a name, id, and date when the grudge started
export class Grudge {
    constructor(targetId, targetName, targetType) {
        this.targetId = targetId;
        this.targetName = targetName;
        this.targetType = targetType;
        this.date = new Date();
    }
    targetId;
    targetName;
    targetType;
    date;
}
