import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { AssetContainerService } from '../core/asset-container.service';
import { SceneService } from '../core/scene.service';
import { MeshComponent } from '../components/mesh.component';
import { PhysicsAggregate, PhysicsShapeType } from '@babylonjs/core';

@injectable()
export class BowlingBallEntity {
  private readonly worldService = injectService(WorldService);
  private readonly assetContainerService = injectService(AssetContainerService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private async initialize() {
    const { mesh } = await this.createMeshComponent();
    this.worldService.getWorld<MeshComponent>().add({ mesh });
  }

  private async createMeshComponent() {
    await this.assetContainerService.getAssetContainer('meshes/bowling.glb');

    const bowlingBall =
      this.sceneService.scene.getMeshByName('BowlingBallBaked');
    if (bowlingBall) {
      bowlingBall.position.y = 0.1;
      bowlingBall.position.z = 7.865;
      new PhysicsAggregate(
        bowlingBall,
        PhysicsShapeType.SPHERE,
        { mass: 1, restitution: 0 },
        this.sceneService.scene
      );

      return new MeshComponent(bowlingBall);
    }

    throw Error('bowling ball not found');
  }
}
