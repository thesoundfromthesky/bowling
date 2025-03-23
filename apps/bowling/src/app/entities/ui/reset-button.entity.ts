import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { AdvancedDynamicTextureService } from '../../core/advanced-dynamic-texture.service';
import { SceneService } from '../../core/scene.service';
import { Button, Control } from '@babylonjs/gui';
import { Quaternion, Vector3 } from '@babylonjs/core';

@injectable()
export class ResetButtonEntity {
  private readonly advancedDynamicTextureService = injectService(
    AdvancedDynamicTextureService
  );
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.createButtonComponent();
  }

  private createButtonComponent() {
    const resetButton = Button.CreateSimpleButton('reset', 'Reset');
    this.advancedDynamicTextureService.advancedDynamicTexture.addControl(
      resetButton
    );
    resetButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    resetButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    resetButton.color = 'white';
    resetButton.background = 'green';
    resetButton.width = '80px';
    resetButton.height = '20px';

    const resetGame = () => {
      const bowlingBall =
        this.sceneService.scene.getMeshByName('BowlingBallBaked');
      if (bowlingBall) {
        const { physicsBody, rotationQuaternion } = bowlingBall;
        if (physicsBody) {
          physicsBody.disablePreStep = false;
          physicsBody.setLinearVelocity(Vector3.Zero());
          physicsBody.setAngularVelocity(Vector3.Zero());

          this.sceneService.scene.onAfterRenderObservable.addOnce(() => {
            physicsBody.disablePreStep = true;
          });
        }
        bowlingBall.position.copyFromFloats(0, 0.1, 7.865);
        if (rotationQuaternion) {
          rotationQuaternion.copyFrom(Quaternion.Identity());
        }
      }

      const bowlingPins =
        this.sceneService.scene.getTransformNodesById('Clone of Cylinder');

      if (bowlingPins.length) {
        const pinPositions = [
          new Vector3(0, 0.15, -7.3),
          new Vector3(0.1, 0.15, -7.45),
          new Vector3(-0.1, 0.15, -7.45),
          new Vector3(0, 0.15, -7.6),
          new Vector3(0.2, 0.15, -7.6),
          new Vector3(-0.2, 0.15, -7.6),
          new Vector3(-0.3, 0.15, -7.75),
          new Vector3(-0.1, 0.15, -7.75),
          new Vector3(0.1, 0.15, -7.75),
          new Vector3(0.3, 0.15, -7.75),
        ];

        bowlingPins.forEach((bowlingPin, i) => {
          const { physicsBody, rotationQuaternion } = bowlingPin;
          if (physicsBody) {
            physicsBody.disablePreStep = false;
            physicsBody.setLinearVelocity(Vector3.Zero());
            physicsBody.setAngularVelocity(Vector3.Zero());
            this.sceneService.scene.onAfterRenderObservable.addOnce(() => {
              physicsBody.disablePreStep = true;
            });
          }
          bowlingPin.position.copyFrom(pinPositions[i]);
          if (rotationQuaternion) {
            rotationQuaternion.copyFrom(Quaternion.Identity());
          }
        });
      }
    };
    resetButton.onPointerClickObservable.add(resetGame);
  }
}
