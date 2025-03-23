import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { AssetContainerService } from '../core/asset-container.service';
import { SceneService } from '../core/scene.service';
import { PhysicsAggregate, PhysicsShapeType } from '@babylonjs/core';
import { TransformNodeComponent } from '../components/transform-node.component';

@injectable()
export class BowlingAlleyEntity {
  private readonly worldService = injectService(WorldService);
  private readonly assetContainerService = injectService(AssetContainerService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private async initialize() {
    const { transformNode } = await this.createTransformNodeComponent();
    this.worldService.getWorld<TransformNodeComponent>().add({ transformNode });
  }

  private async createTransformNodeComponent() {
    await this.assetContainerService.getAssetContainer('meshes/bowling.glb');

    const bowlingAlley =
      this.sceneService.scene.getTransformNodeByName('BowlingAlley');
    if (bowlingAlley) {
      const childMeshes = bowlingAlley.getChildMeshes();

      childMeshes.forEach((childMesh) => {
        new PhysicsAggregate(
          childMesh,
          PhysicsShapeType.MESH,
          { mass: 0, restitution: 0 },
          this.sceneService.scene
        );
      });

      return new TransformNodeComponent(bowlingAlley);
    }

    throw Error('bowling asset not found');
  }
}
