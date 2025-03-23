import { injectable } from 'inversify';
import { Injector } from '../injector/injector';
import { injectService } from '../injector/inject-service.function';
import { MainCameraEntity } from '../entities/cameras/main-camera.entity';
import { HemisphericLightEntity } from '../entities/lights/hemispheric-light.entity';
import { SceneService } from '../core/scene.service';
import HavokPhysics from '@babylonjs/havok';
import { HavokPlugin, Vector3 } from '@babylonjs/core';
import { BowlingAlleyEntity } from '../entities/bowling-alley.entity';
import { WorldManagerService } from '../core/world-manager.service';
import { BowlingBallEntity } from '../entities/bowling-ball.entity';
import { AssetContainerService } from '../core/asset-container.service';
import { BowlingPinEntity } from '../entities/bowling-pin.entity';
import { FireButtonEntity } from '../entities/ui/fire-button.entity';
import { ResetButtonEntity } from '../entities/ui/reset-button.entity';

@injectable()
export class BowlingAlleyWorld {
  private readonly injector = injectService(Injector);
  private readonly sceneService = injectService(SceneService);
  private readonly worldManagerService = injectService(WorldManagerService);
  private readonly assetContainerService = injectService(AssetContainerService);

  public constructor() {
    this.worldManagerService.onInitObservable.add(async () => {
      await this.initialize();
    });
  }

  private async initialize() {
    await this.initializePhysics();
    await this.initAsset();
    this.initializeWorld();
  }

  private async initializePhysics() {
    const havokInstance = await HavokPhysics(/* {
        locateFile: () => {
          const url = new URL(
            `../../../../node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm`,
            import.meta.url
          );
          return url.href;
        },
      } */);
    const gravityVector = new Vector3(0, -9.81, 0);
    const havokPhysicsPlugin = new HavokPlugin(true, havokInstance);
    this.sceneService.scene.enablePhysics(gravityVector, havokPhysicsPlugin);
  }

  private async initAsset() {
    await this.assetContainerService.getAssetContainer('meshes/bowling.glb');
    const root = this.sceneService.scene.getMeshByName('__root__');
    if (root && root.rotationQuaternion) {
      root.rotationQuaternion.y = 0;
    }
  }

  private initializeWorld() {
    this.injector.createInstances([
      MainCameraEntity,
      HemisphericLightEntity,
      BowlingAlleyEntity,
      BowlingBallEntity,
      BowlingPinEntity,
      FireButtonEntity,
      ResetButtonEntity,
    ]);
  }
}
