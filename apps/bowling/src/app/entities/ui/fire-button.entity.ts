import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { AdvancedDynamicTextureService } from '../../core/advanced-dynamic-texture.service';
import { Button, Control } from '@babylonjs/gui';
import { SceneService } from '../../core/scene.service';
import { Vector3 } from '@babylonjs/core';

@injectable()
export class FireButtonEntity {
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
    const fireButton = Button.CreateSimpleButton('fire', 'Fire');
    this.advancedDynamicTextureService.advancedDynamicTexture.addControl(
      fireButton
    );
    fireButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fireButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    fireButton.color = 'white';
    fireButton.background = 'green';
    fireButton.width = '80px';
    fireButton.height = '20px';
    fireButton.topInPixels = -20;
    
    const fireBowlingBall = () => {
      const bowlingBall =
        this.sceneService.scene.getMeshByName('BowlingBallBaked');
      if (bowlingBall && bowlingBall.physicsBody) {
        bowlingBall.physicsBody.applyImpulse(
          new Vector3(0, 0, 20),
          bowlingBall.absolutePosition
        );
      }
    };
    fireButton.onPointerClickObservable.add(fireBowlingBall);
  }
}
