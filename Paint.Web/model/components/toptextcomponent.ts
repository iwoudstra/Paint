/// <reference path="../core/component.ts" />

class TopTextComponent extends Component {
    text: string;
    options: string[];
    chosenOption: number = 0;

    constructor(text: string, options: string[] = []) {
        super();
        this.text = text;
        this.options = options;
    }
}