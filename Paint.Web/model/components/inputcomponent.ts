/// <reference path="../core/component.ts" />

class InputComponent extends Component {
    moveLeftKey: string = 'A';
    moveLeftActive: boolean;

    moveRightKey: string = 'D';
    moveRightActive: boolean;

    jumpKey: string = 'W';
    jumpActive: boolean;

    downKey: string = 'S';
    downActive: boolean;

    paintKey: string = ' ';
    paintActive: boolean;
    paintActivePrevious: boolean;

    interactionKey: string = 'E';
    interactionActive: boolean;
    interactionActivePrevious: boolean;
}