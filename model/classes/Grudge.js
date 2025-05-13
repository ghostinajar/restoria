// Grudge
// a record of someone an agent wants to attack, with a name, id, and date when the grudge started
export class Grudge {
    constructor(targetId, targetName, date) {
        this.targetId = targetId;
        this.targetName = targetName;
        this.date = new Date();
        this.priority = 0;
    }
    targetId;
    targetName;
    date;
    priority;
}
