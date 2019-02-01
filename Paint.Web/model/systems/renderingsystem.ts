/// <reference path="../core/system.ts" />

class RenderingSystem extends System {
    private requiredComponents: string[] = [RenderableComponent.name];

    public Update(deltaTime: number): void {
        var camera = <CameraComponent>this.engine.GetEntities([CameraComponent.name])[0].GetComponent(CameraComponent.name);
        var context = Game.Instance.context;
        context.clearRect(0, 0, Game.ResolutionWidth, Game.ResolutionHeight);

        var entities = this.engine.GetEntities(this.requiredComponents);
        entities.sort(function (a, b) {
            var renderA = <RenderableComponent>a.GetComponent(RenderableComponent.name);
            var renderB = <RenderableComponent>b.GetComponent(RenderableComponent.name);
            if (renderA.renderLayer < renderB.renderLayer) {
                return -1;
            }
            if (renderB.renderLayer < renderA.renderLayer) {
                return 1;
            }

            if (renderA.renderPriority < renderB.renderPriority) {
                return -1;
            }
            if (renderB.renderPriority < renderA.renderPriority) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < entities.length; ++i) {
            var renderableComponent: RenderableComponent = <RenderableComponent>entities[i].GetComponent(RenderableComponent.name);
            var cameraSpeedModifier = renderableComponent.renderLayer == RenderLayer.Background ? 0.5 : (renderableComponent.renderLayer == RenderLayer.Foreground ? 2 : 1);

            if (renderableComponent.gameAnimation) {
                var extra = renderableComponent.orientationLeft ? renderableComponent.width : 0;

                context.translate(renderableComponent.positionComponent.position.x - (camera.positionComponent.position.x * cameraSpeedModifier) + extra, renderableComponent.positionComponent.position.y - camera.positionComponent.position.y);

                if (renderableComponent.orientationLeft) {
                    context.scale(-1, 1);
                }
                context.drawImage(renderableComponent.gameAnimation.imageFile
                    , renderableComponent.gameAnimation.sourceX + (renderableComponent.gameAnimation.width * renderableComponent.frame)
                    , renderableComponent.gameAnimation.sourceY, renderableComponent.gameAnimation.width
                    , renderableComponent.gameAnimation.height
                    , 0
                    , 0
                    , renderableComponent.width
                    , renderableComponent.height
                );
                if (renderableComponent.orientationLeft) {
                    context.scale(-1, 1);
                }

                context.translate(-(renderableComponent.positionComponent.position.x - (camera.positionComponent.position.x * cameraSpeedModifier) + extra), -(renderableComponent.positionComponent.position.y - camera.positionComponent.position.y));
            } else {
                context.beginPath();
                context.fillStyle = renderableComponent.color;
                context.strokeStyle = renderableComponent.color;
                context.fillRect(renderableComponent.positionComponent.position.x - (camera.positionComponent.position.x * cameraSpeedModifier), renderableComponent.positionComponent.position.y - camera.positionComponent.position.y, renderableComponent.width, renderableComponent.height);
            }
        }

        var texts = this.engine.GetEntities([TextComponent.name]);
        for (var i = 0; i < texts.length; ++i) {
            var text = <TextComponent>texts[i].GetComponent(TextComponent.name);
            context.fillStyle = '#ffffff';
            context.strokeStyle = '#000000';
            context.textAlign = 'center';
            context.font = '30pt Calibri';
            context.fillText(text.text, text.positionComponent.position.x - camera.positionComponent.position.x, text.positionComponent.position.y - camera.positionComponent.position.y);
            context.strokeText(text.text, text.positionComponent.position.x - camera.positionComponent.position.x, text.positionComponent.position.y - camera.positionComponent.position.y);

            context.fill();
            context.stroke();
        }

        var texts = this.engine.GetEntities([TopTextComponent.name]);
        for (var i = 0; i < texts.length; ++i) {
            var topText = <TopTextComponent>texts[i].GetComponent(TopTextComponent.name);
            context.fillStyle = '#ffffff';
            context.strokeStyle = '#000000';
            context.textAlign = 'center';
            context.textBaseline = 'top';
            context.font = '20pt Calibri';

            var splitText = topText.text.split('\n');
            for (var j = 0; j < splitText.length; ++j) {
                context.fillText(splitText[j].toUpperCase(), Game.ResolutionWidth / 2, 5 + (35 * j));
                context.strokeText(splitText[j].toUpperCase(), Game.ResolutionWidth / 2, 5 + (35 * j));
            }

            context.textAlign = 'left';
            context.font = '16pt Calibri';
            var startY = 35 * j + 10;
            for (var k = 0; k < topText.options.length; ++k) {
                if (topText.chosenOption == k) {
                    context.lineWidth = 4;
                    context.beginPath();
                    context.moveTo(15, startY + (30 * k));
                    context.lineTo(15, startY + (30 * k) + 20);
                    context.lineTo(35, startY + (30 * k) + 10);
                    context.closePath();
                    context.stroke();
                    context.fill();
                }

                context.lineWidth = 1;
                context.fillText(topText.options[k].toUpperCase(), 50, startY + (30 * k));
                context.strokeText(topText.options[k].toUpperCase(), 50, startY + (30 * k));
            }

            context.fill();
            context.stroke();
        }
    }
}